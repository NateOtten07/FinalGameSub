import { describe, expect, test } from "vitest";
import { appRoutes } from "../routes";

describe("type test routes", () => {
  test("includes a Type Test game route", () => {
    const flattenedRoutes = appRoutes.flatMap((route) => [route, ...(route.children || [])]);
    const typeTestRoute = flattenedRoutes.find((route) => route.path === "/game/type-test");

    expect(typeTestRoute).toBeDefined();
  });
});
