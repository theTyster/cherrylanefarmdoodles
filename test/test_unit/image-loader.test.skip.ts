import { describe, test, expect } from "vitest";
import { ImageLoader as CloudflareImageLoader } from "@/image-loader";
import { DevImageLoader as DevCloudflareImageLoader } from "@/image-loader__dev";

describe("CloudflareImageLoader", () => {
  test("should return a new ImageLoader instance", () => {
    const loader = new CloudflareImageLoader("Group_Photos?r=1");

    expect(loader.makeNormalizedURL()).toBe("i/Group_Photos?r=1");
    expect(loader).toMatchSnapshot();
  });
});

describe("DevCloudflareImageLoader", () => {
  test("should return a new ImageLoader instance", () => {
    const loader = new DevCloudflareImageLoader("Group_Photos?r=1");

    expect(loader.makeNormalizedURL()).toBe("http://localhost:3000/i/Group_Photos?r=1");
    expect(loader).toMatchSnapshot();
  });
});
