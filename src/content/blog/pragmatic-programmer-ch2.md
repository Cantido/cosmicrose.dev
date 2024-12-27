---
title: A Pragmatic Approach — The Pragmatic Programmer Ch. 2 Review
author: rosa-richter
tags: [pragmatic-programmer]
publishDate: 2024-12-26
draft: true
---

Chapter two of The Pragmatic Programmer covered topics closer to the development process than chapter one: design, prototyping, and estimation.

## Make code easy to change

This chapter presented a core value: _make your code easy to change._
Failing that, at least make your code easy to replace.
A good design is easier to change that a bad design.

The first part of good design is to not duplicate knowledge, or in other words: don't repeat yourself.
This book coined the phrase "Don't Repeat Yourself" (abbreviated as DRY), which is advice most programmers have likely heard before.
I've heard this phrase all through my career, and for most of that time, I thought it was just basic advice about not copying & pasting code.
However, in this twentieth anniversary edition of the book, the authors clarify that code duplication is only a trivial part of this advice.
They advise against duplicating _knowledge_ in an application.
"Knowledge" here means requirements and design decisions, which frequently change, even when we are assured that they won't.

The second part of good design is to keep unrelated code independent from other code.
This independence is called "orthogonality" in the book.
You do this by keeping modules _coherent_, which means all members of the module serve a related purpose.
Code that does not serve that purpose is in other modules.

For example, a layered architecture can improve some software's design by introducing abstractions between layers of code.
Abstractions hide irrelevant details within each layer, reducing the likelihood that other layers will have to change with it.
All of a layer's components should serve a related purpose.


## Uncertainty is the first target

The next couple of sections address what you can do when parts of a project are uncertain, or risky. You can take two approaches:

1. Take a vertical slice of the most uncertain functionality, and start developing there.
2. Build a prototype that can answer your question quickly, and throw it away when you're done.

## Try a domain-specific language

"external" DSLs, which are custom syntax requiring you to implement your own parser, vs "internal" DSLs, which are implemented within an exising programming language.

## Take time to make estimates


