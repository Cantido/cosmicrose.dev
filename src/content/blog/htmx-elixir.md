---
title: What I learned from building several HTMX apps on Elixir Phoenix
draft: true
publishDate: 2024-03-11
---

Ever since I learned about [htmx](https://htmx.org) a few months ago, I've been hooked on it.
It unlocks richly interactive and performant web app designs without making you write a single line of your own JavaScript,
and without a byte of client-side state (outside of the DOM, of course).
Its philosophical underpinnings are also convincing: the browser is a powerful tool for rendering and navigating complex interfaces,
and when your server is responding to HTTP requests with HTML, like in the old days,
you can let the browser do the work and eliminate several layers of complexity from your application stack.
Whether or not you agree with this approach, I still suggest that you take a look at a few of the articles on [htmx's essays page](https://htmx.org/essays/).

I've built two applications with HTMX so far. Both apps use Elixir's Phoenix framework as a backend.
Overall, it's been a delightful experience, and it has made full-stack work fun for me again.
However, there are some rough edges I'd like to knock off.

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

This is actually related to the interface's own suitability for using HTMX in the first place.
HTMX is not suited for interfaces with lots of tightly-coupled components.
The HTMX site gives the example of a spreadsheet application as being unsuitable for HTMX, since many cells may need to update when data changes.

My recommendation here is to use out-of-band swaps as much as you need, but be careful of causing havoc by updating an element in too many different places.

I think a new templating library, or new features built into EEx, could really help here.
One of the essay's on HTMX's website is about [Template Fragments](https://htmx.org/essays/template-fragments/),
a feature of some template engines that lets you extract a piece of a template instead of rendering the entire thing.
This feature in EEx would be wonderful, especially if you could render multiple fragments in a single call.
I'm writing a library to attempt this, [Stencil](https://github.com/Cantido/stencil), but it's just a rough draft of how I think this functionality could work.




