import { describe, expect, it } from "vitest";
import { createSeededRandomNumberGenerator } from "../utilities/seededRandomNumberGenerator";

describe("createSeededRandomNumberGenerator", () => {
  it("produces deterministic numeric sequences for the same seed phrase", () => {
    const firstGenerator = createSeededRandomNumberGenerator("Deterministic-Random-Seed");
    const secondGenerator = createSeededRandomNumberGenerator("Deterministic-Random-Seed");

    expect(firstGenerator.nextFraction()).toBe(secondGenerator.nextFraction());
    expect(firstGenerator.nextInteger(10)).toBe(secondGenerator.nextInteger(10));
    expect(firstGenerator.pickOne(["triangle", "square", "wave"])).toBe(
      secondGenerator.pickOne(["triangle", "square", "wave"])
    );
  });

  it("throws helpful errors for invalid integer and selection requests", () => {
    const seededRandomNumberGenerator = createSeededRandomNumberGenerator("Error-Seed");

    expect(() => seededRandomNumberGenerator.nextInteger(0)).toThrow(
      /must be greater than zero/i
    );
    expect(() => seededRandomNumberGenerator.pickOne([])).toThrow(
      /at least one available value/i
    );
    expect(() => seededRandomNumberGenerator.pickWeighted([])).toThrow(
      /at least one weighted option/i
    );
  });

  it("can fall back to the final weighted option when the weights are degenerate", () => {
    const seededRandomNumberGenerator = createSeededRandomNumberGenerator("Degenerate-Weight-Seed");

    expect(
      seededRandomNumberGenerator.pickWeighted([
        { value: "first", weight: Number.NaN },
        { value: "second", weight: Number.NaN }
      ])
    ).toBe("second");
  });
});
