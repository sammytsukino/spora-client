import { describe, it, expect } from "vitest";
import {
  optimizeCloudinaryUrl,
  cldImage,
  cldVideo,
  cldVideoPoster,
  detectCloudinaryAssetType,
  getOptimizedThumbnailUrl,
} from "./cloudinary";

describe("detectCloudinaryAssetType", () => {
  it("detects svg, raw, video, and image", () => {
    expect(
      detectCloudinaryAssetType(
        "https://res.cloudinary.com/demo/image/upload/v1/logo.svg"
      )
    ).toBe("svg");
    expect(
      detectCloudinaryAssetType(
        "https://res.cloudinary.com/demo/raw/upload/v1/font.ttf"
      )
    ).toBe("raw");
    expect(
      detectCloudinaryAssetType(
        "https://res.cloudinary.com/demo/video/upload/v1/clip.mp4"
      )
    ).toBe("video");
    expect(
      detectCloudinaryAssetType(
        "https://res.cloudinary.com/demo/image/upload/v1/photo.png"
      )
    ).toBe("image");
  });
});

describe("optimizeCloudinaryUrl / cldImage", () => {
  it("returns empty string for undefined", () => {
    expect(optimizeCloudinaryUrl(undefined)).toBe("");
    expect(cldImage(undefined)).toBe("");
  });

  it("returns original url when not cloudinary", () => {
    expect(optimizeCloudinaryUrl("https://example.com/img.png")).toBe(
      "https://example.com/img.png"
    );
  });

  it("optimizes PNG with preset transforms before version", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/v1/folder/abc.png";
    const output = cldImage(input, "thumbnail");
    expect(output).toBe(
      "https://res.cloudinary.com/demo/image/upload/c_limit,w_640/f_auto/q_auto/v1/folder/abc.png"
    );
  });

  it("leaves SVG unchanged", () => {
    const svg =
      "https://res.cloudinary.com/demo/image/upload/v1/folder/logo.svg";
    expect(cldImage(svg, "hero")).toBe(svg);
  });

  it("leaves raw assets unchanged", () => {
    const raw =
      "https://res.cloudinary.com/demo/raw/upload/v1/fonts/supply.ttf";
    expect(optimizeCloudinaryUrl(raw, "content")).toBe(raw);
  });

  it("does not duplicate existing f_auto and q_auto", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/q_auto/f_auto/v1/photo.png";
    const output = cldImage(input, "icon");
    expect(output).toBe(
      "https://res.cloudinary.com/demo/image/upload/q_auto/f_auto/c_limit,w_128/v1/photo.png"
    );
    expect(output.match(/f_auto/g)?.length).toBe(1);
    expect(output.match(/q_auto/g)?.length).toBe(1);
  });
});

describe("cldVideo", () => {
  it("adds f_auto:video delivery transforms", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/v1/clip.mp4";
    const output = cldVideo(input);
    expect(output).toContain("q_auto/vc_auto/f_auto:video/");
    expect(output).not.toMatch(/\/f_auto\/(?!video)/);
  });

  it("adds ac_none for autoplay videos", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/v1/bg.mp4";
    const output = cldVideo(input, { autoplay: true });
    expect(output).toContain("ac_none");
    expect(output).toContain("f_auto:video");
  });

  it("does not duplicate video transforms", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/q_auto/vc_auto/f_auto:video/v1/clip.mp4";
    expect(cldVideo(input)).toBe(input);
  });
});

describe("cldVideoPoster", () => {
  it("preserves f_jpg and adds poster sizing", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/so_0/f_jpg/v1/clip.jpg";
    const output = cldVideoPoster(input);
    expect(output).toContain("f_jpg");
    expect(output).toContain("c_limit,w_800");
    expect(output).toContain("q_auto");
    expect(output).not.toContain("f_auto");
  });
});

describe("getOptimizedThumbnailUrl", () => {
  it("injects fill crop for legacy thumbnail usage", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/v1/folder/abc.png";
    const output = getOptimizedThumbnailUrl(input, 100, 80);
    expect(output).toContain("c_fill,g_auto,w_100,h_80");
    expect(output).toContain("f_auto");
    expect(output).toContain("q_auto");
  });
});
