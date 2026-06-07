import { describe, it, expect } from "vitest";
import {
  cldImage,
  cldVideo,
  cldVideoPoster,
  detectCloudinaryAssetType,
  getOptimizedThumbnailUrl,
  optimizeCloudinaryUrl,
} from "./cloudinary";

describe("detectCloudinaryAssetType", () => {
  it("detects svg, raw, video and image assets", () => {
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

describe("optimizeCloudinaryUrl", () => {
  it("optimizes PNG raster images with f_auto and q_auto", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/v1/folder/abc.png";
    const output = optimizeCloudinaryUrl(input, "thumbnail");
    expect(output).toContain("c_limit,w_640,f_auto,q_auto");
    expect(output).toContain("folder/abc.png");
  });

  it("leaves SVG assets unchanged", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/v1/folder/logo.svg";
    expect(optimizeCloudinaryUrl(input, "thumbnail")).toBe(input);
  });

  it("leaves raw assets unchanged", () => {
    const input =
      "https://res.cloudinary.com/demo/raw/upload/v1/fonts/mono.ttf";
    expect(optimizeCloudinaryUrl(input, "thumbnail")).toBe(input);
  });

  it("does not duplicate existing complete image transforms", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/c_limit,w_640,f_auto,q_auto/v1/photo.png";
    expect(optimizeCloudinaryUrl(input, "thumbnail")).toBe(input);
  });
});

describe("cldVideo", () => {
  it("adds f_auto:video delivery params for videos", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/v1/clip.mp4";
    const output = cldVideo(input);
    expect(output).toContain("q_auto,vc_auto,f_auto:video");
  });

  it("adds ac_none for silent autoplay videos", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/v1/clip.mp4";
    const output = cldVideo(input, { silent: true });
    expect(output).toContain("ac_none");
  });
});

describe("cldVideoPoster", () => {
  it("preserves f_jpg when already present", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/so_0,f_jpg/v1/clip.mp4";
    const output = cldVideoPoster(input);
    expect(output).toContain("so_0");
    expect(output).toContain("f_jpg");
    expect(output).toContain("c_limit,w_800,q_auto");
  });

  it("adds poster transforms when missing", () => {
    const input =
      "https://res.cloudinary.com/demo/video/upload/v1/clip.mp4";
    const output = cldVideoPoster(input);
    expect(output).toContain("so_0,c_limit,w_800,q_auto,f_jpg");
  });
});

describe("cldImage", () => {
  it("is an alias for optimizeCloudinaryUrl on images", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/v1/icon.png";
    expect(cldImage(input, "icon")).toContain("c_limit,w_128,f_auto,q_auto");
  });
});

describe("getOptimizedThumbnailUrl", () => {
  it("returns empty string for undefined", () => {
    expect(getOptimizedThumbnailUrl(undefined)).toBe("");
  });

  it("returns original url when not cloudinary", () => {
    expect(getOptimizedThumbnailUrl("https://example.com/img.png")).toBe(
      "https://example.com/img.png"
    );
  });

  it("injects intentional crop transforms when width and height are provided", () => {
    const input =
      "https://res.cloudinary.com/demo/image/upload/v1/folder/abc.png";
    const output = getOptimizedThumbnailUrl(input, 100, 80);
    expect(output).toContain("w_100,h_80,c_fill,g_auto,f_auto,q_auto");
    expect(output).toContain("folder/abc.png");
  });
});
