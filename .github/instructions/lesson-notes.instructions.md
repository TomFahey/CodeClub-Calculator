---
description: "Use when creating or updating HTML lesson notes in docs/ for the CodeClub Calculator project. Covers required page structure, age-appropriate language rules, highlight.js code formatting, collapsible hints, and navigation conventions."
applyTo: "docs/**/*.html"
---
# Lesson Notes HTML Rules

## Audience
- Age 10–11 (UK KS2/KS3 boundary), first text-based coding project
- Short sentences, active voice, second person ("you", "your")
- No jargon without a plain-English definition and analogy first
- Analogies are essential: e.g. "a variable is like a labelled box that stores something"

## Required Page Structure (in this order)
Each `lesson*.html` must include these `<section>` blocks:
1. **Introduction** — what we're building today and why it's exciting (2–3 sentences max)
2. **New Concepts** — one `<div class="concept-box">` per new idea; analogy first, then definition
3. **Step-by-Step Walkthrough** — numbered `<ol>` steps; one action per step; explain every line of code shown
4. **Try It** — prompt to type the code into the IDE and run it on the Tab5
5. **Challenge** *(optional)* — extension task for faster students; clearly marked with `<div class="challenge">`

## HTML Conventions
- Load `highlight.js` from CDN for syntax highlighting
- Code blocks: `<pre><code class="language-python">...</code></pre>`
- Collapsible hints: `<details><summary>💡 Hint</summary>...</details>`
- Load shared styles: `<link rel="stylesheet" href="style.css">`
- Navigation footer: links to previous lesson, next lesson, and `index.html`
- Use semantic HTML: `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`

## Language Rules
- Say "type this code" — not "implement the following"
- Say "the screen" — not "the display widget" or "the UI component"
- Say "your calculator" — make it personal and theirs
- Say "press Run" — not "execute the program"
- Every line of new code shown must be explained in plain English immediately after
- Never show a block of code without a sentence introducing what it does
