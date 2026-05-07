---
description: "Use when creating or updating HTML lesson notes in docs/ for the CodeClub Calculator project. Covers required page structure, age-appropriate language rules, highlight.js code formatting, collapsible hints, CSS classes, and navigation conventions."
applyTo: "docs/**/*.html"
---

# Lesson Notes HTML Rules

## Audience

- Age 10–11 (UK KS2/KS3 boundary), first text-based coding project
- Short sentences, active voice, second person ("you", "your")
- No jargon without a plain-English definition and analogy first
- Analogies are essential: e.g. "a variable is like a labelled box that stores something"

---

## Required Page Structure

Each `lesson*.html` must include, in this order:

1. **Top nav** — `<nav class="lesson-nav">` with prev/next lesson links
2. **`<main>`** block containing:
   a. `<h1>` title
   b. `<div class="goals-box">` — "What you'll learn today" list (3–5 bullets)
   c. `<div class="recap-box">` — brief recap of the previous lesson
   d. Numbered **Phases** — one `<section class="phase">` per concept cluster (see below)
   e. `<div class="full-program">` — complete program listing at end-of-lesson state
   f. `<div class="summary-box">` — "What You Learned" bullet list
3. **Bottom nav** — repeat `<nav class="lesson-nav">`

---

## Phase Structure (inner pattern for each phase)

```
<section class="phase">
  <h2>Phase N — Title</h2>

  <div class="concept-box">
    <p class="concept-title">🔑 Concept name</p>
    <div class="analogy">Plain-English analogy (REQUIRED)</div>
    <p>Formal definition after the analogy.</p>
  </div>

  <!-- Code introduction + line-by-line explanation -->

  <div class="try-it">
    <h3>🎮 Try it!</h3>
    <p>What to type and what to observe.</p>
    <details><summary>💡 Hint</summary>...</details>
  </div>

  <div class="challenge">
    <h3>⭐ Challenge</h3>
    <!-- Two levels of hints: conceptual, then solution -->
    <details><summary>💡 Hint</summary>...</details>
    <details><summary>💡 Bigger hint</summary>...</details>
  </div>
</section>
```

---

## CSS Classes

| Class | Purpose |
|---|---|
| `concept-box` | Wrapper for a new concept introduction |
| `concept-title` | Heading / emoji label inside concept box |
| `analogy` | Highlighted analogy block — REQUIRED inside every concept-box |
| `try-it` | Interactive exercise block |
| `challenge` | Optional stretch goal block |
| `steps` (on `<ol>`) | Numbered step-by-step list |
| `recap-box` | Recap section at the top of a lesson |
| `summary-box` | End-of-lesson "What You Learned" section |
| `var-table` | Table of variables and their meanings |
| `phase` | Wraps each numbered phase `<section>` |
| `goals-box` | "What you'll learn today" list |
| `full-program` | Section containing the complete program listing |
| `info-box` | General informational callout |
| `side-by-side` | Flex row containing two `<pre>` blocks for comparison |
| `lesson-nav` | Top and bottom navigation bar |
| `lesson-badge` | Session number badge inside nav |

---

## Navigation

```html
<nav class="lesson-nav">
  <a href="lessonN-1.html">&larr; Session N-1</a>
  <span class="lesson-badge">Session N</span>
  <a href="lessonN+1.html">Session N+1 &rarr;</a>  <!-- blank <span> if last lesson -->
</nav>
```

---

## Code Formatting

```html
<pre><code class="language-python">
# your code here
</code></pre>
```

- CDN stylesheet in `<head>`:
  `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css`
- Script + init before `</body>`:
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
  ```

---

## Language Rules

- Say "type this code" — not "implement the following"
- Say "the screen" — not "the display widget"
- Say "your calculator" — make it personal
- Say "press Run" — not "execute the program"
- Every line of new code shown must be explained in plain English immediately after
- Never show a code block without a sentence introducing what it does

---

## Proto-Function Callbacks (Lesson 4 only)

When introducing a Lesson 4 calculator function, always open with a "Remember X from Session 3?" concept box. See `copilot-instructions.md` proto-function map for the full table.

For `calculate()` and `press_equals()`, include a `<div class="side-by-side">` comparison showing the Lesson 3 proto-function alongside the new Lesson 4 function.
