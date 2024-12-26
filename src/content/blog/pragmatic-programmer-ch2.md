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

One part of good design is to not duplicate knowledge, or in other words: don't repeat yourself.
This book coined the phrase "Don't Repeat Yourself" (abbreviated as DRY), which is advice most programmers have likely heard before.
I've heard this phrase all through my career, and for most of that time, I thought it was just basic advice about not copying & pasting code.
However, in this twentieth anniversary edition of the book, the authors clarify that code duplication is only a trivial part of this advice.
They advise against duplicating _knowledge_ in an application.
"Knowledge" here means requirements and design decisions, which frequently change, even when we are assured that they won't.

This was a surprise to me, because this is the same type of "knowledge" that John Ousterhout says must be encapsulated and hidden,
as much as possible, in order to keep code maintainable, in his book <ins>A Philosophy of Software Design</ins>.





