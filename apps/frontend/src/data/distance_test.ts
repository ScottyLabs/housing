// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />
import { ok, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { estimateTravel, metersBetween } from "./distance.ts";

void test("distance between identical points is zero", () => {
  strictEqual(metersBetween(40.4433, -79.9436, 40.4433, -79.9436), 0);
});

void test("one degree of latitude is about 111 km", () => {
  const meters = metersBetween(40, -80, 41, -80);
  ok(meters > 110_000 && meters < 112_500, `got ${meters}`);
});

void test("estimates are at least one minute and bikes beat walking", () => {
  const near = estimateTravel(5);
  strictEqual(near.walk, 1);
  strictEqual(near.bike, 1);
  strictEqual(near.drive, 1);
  const far = estimateTravel(1000);
  ok(far.bike < far.walk, "biking should be faster than walking");
  ok(far.drive <= far.bike, "driving should not be slower than biking");
});
