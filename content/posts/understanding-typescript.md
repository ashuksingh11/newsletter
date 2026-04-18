---
title: "Understanding TypeScript"
date: "2026-04-17"
summary: "Why TypeScript exists, how it differs from JavaScript, and how its type system catches bugs before they happen."
---

TypeScript is JavaScript with types. But what does that actually mean?

## The Problem TypeScript Solves

In JavaScript, you can pass any value anywhere. A function expecting a number might receive a string, and you won't know until your app crashes in production.

```javascript
// JavaScript — no error until runtime
function double(n) {
  return n * 2;
}
double("hello"); // NaN — silent bug!
```

TypeScript catches this **before your code runs**:

```typescript
// TypeScript — error immediately in your editor
function double(n: number): number {
  return n * 2;
}
double("hello"); // Error: Argument of type 'string' is not assignable
```

## Key TypeScript Features

### Type Annotations

You declare what type a variable or parameter should be:

```typescript
let name: string = "Alice";
let age: number = 30;
let isAdmin: boolean = false;
```

### Interfaces and Types

You can define the shape of an object:

```typescript
type BlogPost = {
  title: string;
  date: string;
  published: boolean;
};
```

### Type Inference

TypeScript is smart — you don't always need to write types. It can figure them out:

```typescript
let count = 42; // TypeScript knows this is a number
```

## Types Are Training Wheels That Never Come Off

Unlike training wheels, types remain valuable even for experienced developers. They serve as documentation, enable better editor autocomplete, and catch entire categories of bugs automatically.
