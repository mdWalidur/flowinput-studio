import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/download";

describe("slugify", () => {
  it("normalizes names to safe filenames", () => {
    expect(slugify("My FlowInput Result!!!")).toBe("my-flowinput-result");
  });

  it("falls back when input is empty", () => {
    expect(slugify("___")).toBe("flowinput-result");
  });
});
