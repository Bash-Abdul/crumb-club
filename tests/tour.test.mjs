import test from "node:test";
import assert from "node:assert/strict";
import {
  tourSteps,
  readTourStatus,
  clampTourStep,
} from "../src/features/tour/tour-steps.ts";
test("only completed and skipped tours are remembered as dismissed", () => {
  assert.equal(readTourStatus("complete"), "complete");
  assert.equal(readTourStatus("skipped"), "skipped");
  for (const value of [null, undefined, "unknown", {}, 0])
    assert.equal(readTourStatus(value), null);
});
test("walkthrough steps have unique real interface targets and bounded navigation", () => {
  assert.equal(
    new Set(tourSteps.map((step) => step.target)).size,
    tourSteps.length,
  );
  for (const step of tourSteps) assert.ok(step.title && step.text);
  assert.equal(clampTourStep(-1), 0);
  assert.equal(clampTourStep(100), tourSteps.length - 1);
  assert.equal(clampTourStep(NaN), 0);
  assert.equal(clampTourStep(2), 2);
});
