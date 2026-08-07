import { describe, expect, test } from "vitest";
import { appRoutes } from "../routes";

describe("app routes", () => {
  test("includes a Wordle game route", () => {
    const flattenedRoutes = appRoutes.flatMap((route) => [route, ...(route.children || [])]);
    const wordleRoute = flattenedRoutes.find((route) => route.path === "/game/wordle");

    expect(wordleRoute).toBeDefined();
  });
});
