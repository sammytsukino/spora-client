import { describe, it, expect } from "vitest";
import type { ApiFlora } from "@/lib/floras";
import {
  buildLineageItems,
  chunkLineageItems,
  ensureHandle,
  formatGeneration,
  formatSeed,
  resolveAuthorUsernameForProfile,
  resolveFloraAuthor,
} from "./floraPresentation";

const baseFlora = {
  _id: "abc123def456",
  title: "Test Flora",
  text: "Body",
  generative: { soilId: "soil-xyz-789" },
  lineage: { generation: 2 },
} as ApiFlora;

describe("floraPresentation", () => {
  it("ensureHandle adds @ when missing", () => {
    expect(ensureHandle("user")).toBe("@user");
    expect(ensureHandle("@user")).toBe("@user");
  });

  it("formatGeneration defaults invalid values to GEN_0", () => {
    expect(formatGeneration(3)).toBe("GEN_3");
    expect(formatGeneration(undefined)).toBe("GEN_0");
  });

  it("formatSeed uses soilId suffix", () => {
    expect(formatSeed(baseFlora)).toBe("#YZ-789");
  });

  it("resolveFloraAuthor prefers authorUsername", () => {
    expect(resolveFloraAuthor({ ...baseFlora, authorUsername: "cultivator" })).toEqual({
      author: "@cultivator",
      authorName: "cultivator",
    });
  });

  it("resolveAuthorUsernameForProfile blocks anonymous and forbidden", () => {
    expect(resolveAuthorUsernameForProfile("@Anonymous", null)).toBeNull();
    expect(
      resolveAuthorUsernameForProfile(
        "@[forbidden_author]",
        "[forbidden_author]",
      ),
    ).toBeNull();
    expect(resolveAuthorUsernameForProfile("@valid", "valid")).toBe("valid");
  });

  it("buildLineageItems falls back to author only", () => {
    expect(buildLineageItems(baseFlora, "@solo")).toEqual([
      { handle: "@solo", floraId: "abc123def456" },
    ]);
  });

  it("chunkLineageItems groups pairs", () => {
    expect(chunkLineageItems([1, 2, 3])).toEqual([[1, 2], [3]]);
  });
});
