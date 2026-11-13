// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../../../node_modules/@types/node/index.d.ts" />

import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { safeRedirectPath } from "./redirect.ts";

void test("safeRedirectPath keeps paths on this site", () => {
  strictEqual(safeRedirectPath("/reviews/donner"), "/reviews/donner");
  strictEqual(safeRedirectPath("/reviews?q=mor"), "/reviews?q=mor");
  strictEqual(safeRedirectPath("/"), "/");
});

void test("safeRedirectPath rejects other sites and odd values", () => {
  strictEqual(safeRedirectPath("https://evil.example"), undefined);
  strictEqual(safeRedirectPath("//evil.example"), undefined);
  strictEqual(safeRedirectPath("/\\evil.example"), undefined);
  strictEqual(safeRedirectPath("reviews"), undefined);
  strictEqual(safeRedirectPath("/reviews\n/x"), undefined);
  strictEqual(safeRedirectPath("/api/auth/logout"), undefined);
  strictEqual(safeRedirectPath(`/${"a".repeat(600)}`), undefined);
  strictEqual(safeRedirectPath(42), undefined);
  strictEqual(safeRedirectPath(null), undefined);
});
