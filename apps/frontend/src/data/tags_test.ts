// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { ok } from "node:assert/strict";
import { test } from "node:test";
import buildingsData from "./buildings.json" with { type: "json" };
import { buildingTags } from "./tags.tsx";

// Check the full catalog, including buildings hidden from the three-card previews.
// A missing definition (previously Spirit House's "offline" tag) crashes the expanded list.
void test("every building's editorial tags have display definitions", () => {
  const knownTags = new Set(buildingTags.map((tag) => tag.id));

  for (const building of buildingsData) {
    for (const tagId of building.editorialTags ?? []) {
      ok(knownTags.has(tagId), `Building ${building.name} contains invalid tag: ${tagId}`);
    }
  }
});
