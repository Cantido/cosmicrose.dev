---
title: What I learned from building several HTMX apps on Elixir Phoenix
publishDate: 2024-03-12T19:00:00-06:00
---

Ever since I learned about [htmx](https://htmx.org) a few months ago, I've been hooked on it.
It unlocks richly interactive and performant web app designs without making you write a single line of your own JavaScript,
and without a byte of client-side state (outside of the DOM and maybe a session, of course).
Its philosophical underpinnings are also convincing: the browser is a powerful tool for rendering and navigating complex interfaces,
and when your server is responding to HTTP requests with HTML, like in the old days,
you can eliminate several layers of complexity from your application stack.

I remember a conversation with some co-workers as we were brainstorming how to address a performance issue.
Our React frontend was requesting _a lot_ of data from the backend.
Someone asked "without that data, how will we know what the user has permission to see?"
It suddenly became clear to me: the server knows what permissions the user has, and it knows what the user wants to see, why are we involving another system in this operation?
Heavy client-side state does not solve any issues, it is only a futile exercise in synchronizing distributed state.
The only place that your data is "correct" is in the database, so the server should produce the corresponding HTML and be done with it!
This quote from [intercooler.js](https://intercoolerjs.org/2016/02/17/api-churn-vs-security.html) sums up this idea perfectly:

> In an ideal world you would give your UI developers everything they could possibly need to build their UI efficiently: an open and expressive query layer that would let them tune the structure and return data of a query just so for those hot, complicated queries that always end up dominating system performance.
>
> But what if I told you that a place exists where you can do this?
>
> Such a place does exist.
>
> This place is called... the server side.

Whether or not you agree with this approach, I still suggest that you take a look at a few of the articles on [htmx's essays page](https://htmx.org/essays/).
They answered my questions and soothed my concerns while teaching me the magic of the HOWL stack.
(HOWL stands for "Hypermedia On Whatever you'd Like," a tongue-in-cheek way to say that any tech stack capable of producing HTML can easily use the hypermedia approach.)

I've built two applications with HTMX so far. Both apps use Elixir's Phoenix framework as a backend.
Overall, it's been a delightful experience, and it has made full-stack work fun for me again.
However, there are some rough edges I'd like to knock off.

## Initial Roadblocks

You need to tweak Phoenix's behavior in order to return HTML fragments without the root layout.
However, you do still need to render the root layout for the initial page load.
I added a function `Plug` to my router that disables the root element for HTMX requests.
It also detects when the request is using the `hx-boost` attribute, or if HTMX is restoring the page from history,
in which case it enables the app layout, which renders only the `<body>` content.

```elixir
def htmx_layout(conn, _opts) do
  if get_in(conn.assigns, [:htmx, :request]) do
    conn = put_root_layout(conn, html: false)

    if conn.assigns.htmx[:boosted] or conn.assigns.htmx[:history_restore_request] do
      put_layout(conn, html: {MyAppWeb.Layouts, :app})
    else
      put_layout(conn, html: false)
    end
  else
    conn
    |> put_root_layout(html: {MyAppWeb.Layouts, :root})
    |> put_layout(html: {MyAppWeb.Layouts, :app})
  end
end
```

In order to detect boosted or history requests, I wrote another `Plug` that extracts all of the information that HTMX adds in its requests.

```elixir
def detect_htmx_request(conn, _opts) do
  if get_req_header(conn, "hx-request") == ["true"] do
    assign(conn, :htmx, %{
      request: true,
      boosted: get_req_header(conn, "hx-boosted") != [],
      current_url: List.first(get_req_header(conn, "hx-current-url")),
      history_restore_request: get_req_header(conn, "hx-history-restore-request") == ["true"],
      prompt: List.first(get_req_header(conn, "hx-prompt")),
      target: List.first(get_req_header(conn, "hx-target")),
      trigger_name: List.first(get_req_header(conn, "hx-trigger-name")),
      trigger: List.first(get_req_header(conn, "hx-trigger"))
    })
  else
    conn
  end
end
```

Those are the only additions I needed to make to use HTMX.

## Phoenix Boilerplate

When you build an application built from many small templates, the Phoenix boilerplate begins to bother you.
What surprised me was that HTMX has actually pushed me away from Phoenix.
There's too much code for how little the framework ends up actually doing.
Every request you serve touches a _minimum_ of five files: the `Endpoint`, the `Router`, a `Controller`, a `HTML` module (formerly known as a `View`), and finally, your template.
It would be very much in the spirit of HTMX to collapse this sprawling separation of concerns into a single module with a coherent locality of behavior.

I'd still like to keep Phoenix's HEEx templates and the `~H""` sigil, though.
HEEx's function components are extremely convenient, I just wish they didn't have LiveView wired directly into them.

My recommendation here is to just build a `Plug` application, and experiment with other template engines like `Surface`.

## Routing

My second HTMX app was a clone of my company's web application, a messaging application.
I gave up on giving URLs to certain states of the page, for instance which of the user's inboxes was active.
It is difficult to make a URL serve either a small component or an entire page depending on whether the request is an HTMX request,
which makes HTMX attributes like `hx-boost` and `hx-push-url` much less useful than they could be.

My recommendation is to reserve a set of URLs specifically to represent full pages,
and push the value using `hx-push-url="/path/to/page"` instead of `hx-push-url="true"`.

```html
<div hx-get="/user/greeting" hx-push-url="/profile">
  Go to Profile
</div>
```

## Out-of-Band Swaps

It's hard to decompose a page into HTMX components.
The more finely you chop your interface, the more combinations of components you'll need to update in a single response.
You may then choose to err on the side of rendering larger areas of the page in a single response,
but that naturally results in more (or bigger) calls to the database, sometimes unecessarily querying values that haven't changed.

If you choose to go the other direction, however, and dice your interface into tiny bits, you'll discover the freedom of out-of-band swaps.
One response returns multiple components, each with an `id` attribute as well as the `hx-swap-oob="true"` attribute.
This tells HTMX to swap out each received component with the component in the DOM whose `id` matches.
There is the downside, however, that now, you require a separate template for every combination of components you wish to swap in.
If you choose to have one template that contains a page's worth of components, you've come right back to the full page render case.

```html
<div id="flash-message" hx-swap-oob="true">
  Your display name was updated!
</div>

<div id="greeting" hx-swap-oob="true">
  Hello, <%= @display_name %>
</div>
```

This problem can give you a better understanding of the interface's own suitability for HTMX in the first place.
HTMX is not suited for interfaces with lots of tightly-coupled components.
The HTMX site gives the example of a spreadsheet application as being unsuitable for HTMX, since many cells may need to update when data changes.

My recommendation here is to use out-of-band swaps as much as you need, but be careful of causing havoc by updating an element in too many different places.

## Templating

I think a new templating library, or new features built into EEx, could really help make it easier to make HTMX apps.
One of the essay's on HTMX's website is about [Template Fragments](https://htmx.org/essays/template-fragments/),
a feature of some template engines that lets you extract a piece of a template instead of rendering the entire thing.
This feature in EEx would be wonderful, especially if you could render multiple fragments in a single call.
I'm writing a library to attempt this, [Stencil](https://github.com/Cantido/stencil), but it's just a rough draft of how I think this functionality could work.
Currently, it allows you to define template fragments with the `<%| %>` EEx expression, like this:

```html
<main>
  <%| success_message do %>
    <div class="notification is-success">
      <%= @message %>
    </div>
  <% end %>
  <%| error_message do %>
    <div class="notification is-danger">
      <%= @message %>
    </div>
  <% end %>
  <%| content %>
    <p>Hello, world!</p>
  <% end %>
</main>
```

Then, you can extract just a fragment of this template using the `Stencil.Engine`, like this:

```elixir
EEx.eval_string(template, [assigns: [], fragment: :content], [engine: Stencil.Engine])
```

which would result in this fragment:

```html
<p>Hello, world!</p>
```

You don't need to specify any `@assigns` that aren't in your specific fragment.

I'm looking for ways to improve this library, especially to make it "feel" more like Elixir,
Right now, the template name in EEx isn't valid Elixir syntax, and Stencil uses the `<%| %>`
EEx expression as a marker to extract that token as an atom. It feels hacky.
If you have suggestions for how to improve this, please [submit an issue](https://github.com/Cantido/stencil/issues/new)!

## Conclusion

Given that it's a brand new way of building applications, HTMX is surprisingly easy to use with Phoenix.
The experience could be improved, sure, but there weren't any major roadblocks.
I have discovered that I do actually enjoy front-end work when I don't have to write JavaScript,
so I'm going to continue building my apps with HTMX for the time being.

