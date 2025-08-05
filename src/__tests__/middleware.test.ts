import { clerkMiddleware } from "@clerk/nextjs/server";
import middleware, { config } from "../middleware";

const RegExpConstructor = RegExp;
function safeRegExp(pattern: string): RegExp {
  // Potential place to add regex safety validation
  return new RegExpConstructor(pattern);
}

// Mock the Clerk middleware
jest.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: jest.fn(),
}));

describe("Middleware", () => {
  const mockClerkMiddleware = clerkMiddleware as jest.MockedFunction<
    typeof clerkMiddleware
  >;
  const mockMiddlewareFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockClerkMiddleware.mockReturnValue(mockMiddlewareFunction);
  });

  describe("clerkMiddleware integration", () => {
    it("should call clerkMiddleware with no arguments", () => {
      // Import triggers the middleware creation
      require("../middleware");

      expect(mockClerkMiddleware).toHaveBeenCalledWith();
      expect(mockClerkMiddleware).toHaveBeenCalledTimes(1);
    });

    it("should export the result of clerkMiddleware", () => {
      expect(middleware).toBe(mockMiddlewareFunction);
    });

    it("should be a function", () => {
      expect(typeof middleware).toBe("function");
    });
  });

  describe("config object", () => {
    it("should export a config object", () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
    });

    it("should have a matcher property", () => {
      expect(config).toHaveProperty("matcher");
      expect(Array.isArray(config.matcher)).toBe(true);
    });

    it("should have exactly 2 matcher patterns", () => {
      expect(config.matcher).toHaveLength(2);
    });

    describe("matcher patterns", () => {
      it("should include the main route matcher pattern", () => {
        const mainPattern =
          "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)";
        expect(config.matcher).toContain(mainPattern);
      });

      it("should include the API/TRPC matcher pattern", () => {
        const apiPattern = "/(api|trpc)(.*)";
        expect(config.matcher).toContain(apiPattern);
      });

      it("should have valid regex patterns", () => {
        config.matcher.forEach((pattern, index) => {
          expect(() => safeRegExp(pattern)).not.toThrow();
        });
      });
    });

    describe("route exclusions", () => {
      const mainPattern = config.matcher[0];

      it("should exclude _next directory", () => {
        const regex = safeRegExp(mainPattern);
        expect(regex.test("/_next/static/chunks/main.js")).toBe(false);
        expect(regex.test("/_next/webpack-hmr")).toBe(false);
      });

      it("should exclude static assets", () => {
        const regex = safeRegExp(mainPattern);
        const staticAssets = [
          "/favicon.ico",
          "/image.jpg",
          "/image.jpeg",
          "/image.webp",
          "/image.png",
          "/image.gif",
          "/image.svg",
          "/style.css",
          "/script.js",
          "/font.ttf",
          "/font.woff",
          "/font.woff2",
          "/data.csv",
          "/document.docx",
          "/document.doc",
          "/spreadsheet.xlsx",
          "/spreadsheet.xls",
          "/archive.zip",
          "/site.webmanifest",
        ];

        staticAssets.forEach((asset) => {
          expect(regex.test(asset)).toBe(false);
        });
      });

      it("should include JSON files (as they're not excluded)", () => {
        const regex = safeRegExp(mainPattern);
        expect(regex.test("/api/data.json")).toBe(true);
        expect(regex.test("/config.json")).toBe(true);
      });

      it("should include regular pages", () => {
        const regex = safeRegExp(mainPattern);
        expect(regex.test("/")).toBe(true);
        expect(regex.test("/about")).toBe(true);
        expect(regex.test("/dashboard")).toBe(true);
        expect(regex.test("/user/profile")).toBe(true);
      });
    });

    describe("API and TRPC routes", () => {
      const apiPattern = config.matcher[1];
      const regex = safeRegExp(apiPattern);

      it("should match API routes", () => {
        expect(regex.test("/api")).toBe(true);
        expect(regex.test("/api/")).toBe(true);
        expect(regex.test("/api/users")).toBe(true);
        expect(regex.test("/api/users/123")).toBe(true);
        expect(regex.test("/api/v1/data")).toBe(true);
      });

      it("should match TRPC routes", () => {
        expect(regex.test("/trpc")).toBe(true);
        expect(regex.test("/trpc/")).toBe(true);
        expect(regex.test("/trpc/user.get")).toBe(true);
        expect(regex.test("/trpc/posts.list")).toBe(true);
      });

      it("should not match non-API routes", () => {
        expect(regex.test("/")).toBe(false);
        expect(regex.test("/about")).toBe(false);
        expect(regex.test("/dashboard")).toBe(false);
        expect(regex.test("/application")).toBe(false);
        expect(regex.test("/trip")).toBe(false);
      });
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("should handle empty paths", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("")).toBe(false);
    });

    it("should handle root path", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/")).toBe(true);
    });

    it("should handle paths with query parameters", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/page?param=value")).toBe(true);
      expect(mainRegex.test("/style.css?v=123")).toBe(false);
    });

    it("should handle paths with fragments", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/page#section")).toBe(true);
    });

    it("should handle deeply nested paths", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(
        mainRegex.test("/very/deep/nested/path/structure")
      ).toBe(true);
    });

    it("should handle special characters in paths", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/path-with-dashes")).toBe(true);
      expect(mainRegex.test("/path_with_underscores")).toBe(true);
      expect(mainRegex.test("/path.with.dots")).toBe(true);
      expect(mainRegex.test("/path%20with%20encoded")).toBe(true);
    });

    it("should handle case sensitivity", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/API")).toBe(true);
      expect(mainRegex.test("/Api")).toBe(true);
      expect(mainRegex.test("/TRPC")).toBe(true);

      const apiRegex = new RegExp(config.matcher[1]);
      expect(apiRegex.test("/API")).toBe(false); // Case sensitive
      expect(apiRegex.test("/TRPC")).toBe(false); // Case sensitive
    });
  });

  describe("security considerations", () => {
    it("should not exclude protected routes", () => {
      const mainRegex = new RegExp(config.matcher[0]);

      // These should still be caught by middleware (not excluded)
      expect(mainRegex.test("/admin")).toBe(true);
      expect(mainRegex.test("/auth")).toBe(true);
      expect(mainRegex.test("/login")).toBe(true);
      expect(mainRegex.test("/signup")).toBe(true);
      expect(mainRegex.test("/dashboard")).toBe(true);
      expect(mainRegex.test("/profile")).toBe(true);
    });

    it("should exclude static assets even with path traversal attempts", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/../favicon.ico")).toBe(false);
      expect(mainRegex.test("/./style.css")).toBe(false);
      expect(mainRegex.test("/../../image.png")).toBe(false);
    });

    it("should handle potential bypass attempts", () => {
      const mainRegex = new RegExp(config.matcher[0]);

      // Should still catch these potential bypass attempts
      expect(mainRegex.test("/admin.html")).toBe(false); // Excluded due to .html
      expect(mainRegex.test("/config.js")).toBe(false); // Excluded due to .js
      expect(mainRegex.test("/secret.json")).toBe(true); // JSON not excluded
    });
  });

  describe("file extension handling", () => {
    it("should exclude HTML files", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/page.html")).toBe(false);
      expect(mainRegex.test("/index.htm")).toBe(false);
    });

    it("should exclude CSS files", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/styles.css")).toBe(false);
      expect(mainRegex.test("/global.css")).toBe(false);
    });

    it("should exclude JS files but not JSON", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/script.js")).toBe(false);
      expect(mainRegex.test("/config.json")).toBe(true); // JSON should not be excluded
    });

    it("should exclude image files", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/logo.jpg")).toBe(false);
      expect(mainRegex.test("/avatar.jpeg")).toBe(false);
      expect(mainRegex.test("/banner.webp")).toBe(false);
      expect(mainRegex.test("/icon.png")).toBe(false);
      expect(mainRegex.test("/animation.gif")).toBe(false);
      expect(mainRegex.test("/vector.svg")).toBe(false);
    });

    it("should exclude font files", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/font.ttf")).toBe(false);
      expect(mainRegex.test("/font.woff")).toBe(false);
      expect(mainRegex.test("/font.woff2")).toBe(false);
    });

    it("should exclude document files", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/document.docx")).toBe(false);
      expect(mainRegex.test("/document.doc")).toBe(false);
      expect(mainRegex.test("/spreadsheet.xlsx")).toBe(false);
      expect(mainRegex.test("/spreadsheet.xls")).toBe(false);
      expect(mainRegex.test("/data.csv")).toBe(false);
      expect(mainRegex.test("/archive.zip")).toBe(false);
    });

    it("should exclude other static files", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      expect(mainRegex.test("/favicon.ico")).toBe(false);
      expect(mainRegex.test("/manifest.webmanifest")).toBe(false);
    });
  });

  describe("performance considerations", () => {
    it("should compile regex patterns without errors", () => {
      expect(() => {
        config.matcher.forEach((pattern) => safeRegExp(pattern));
      }).not.toThrow();
    });

    it("should handle large number of test cases efficiently", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const testPaths = Array.from({ length: 1000 }, (_, i) => `/path${i}`);

      const startTime = Date.now();
      testPaths.forEach((path) => mainRegex.test(path));
      const endTime = Date.now();

      // Should complete within reasonable time (less than 100ms for 1000 tests)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should handle complex paths without performance degradation", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const complexPaths = [
        "/very/deeply/nested/path/with/many/segments",
        "/path/with/query?param1=value1&param2=value2&param3=value3",
        "/path/with/special/chars!@#$%^&*()+={}[]|:;\"'",
        "/api/v1/users/123/posts/456/comments/789/replies",
        "/trpc/user.profile.update.mutation.with.long.name",
      ];

      const startTime = Date.now();
      complexPaths.forEach((path) => mainRegex.test(path));
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(10);
    });
  });

  describe("realistic usage scenarios", () => {
    it("should handle typical Next.js application routes", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const apiRegex = new RegExp(config.matcher[1]);

      // Typical app routes that should be processed
      const appRoutes = [
        "/",
        "/about",
        "/contact",
        "/products",
        "/products/123",
        "/user/profile",
        "/user/settings",
        "/dashboard",
        "/admin/users",
      ];

      appRoutes.forEach((route) => {
        expect(mainRegex.test(route)).toBe(true);
        expect(apiRegex.test(route)).toBe(false);
      });
    });

    it("should handle typical API routes", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const apiRegex = new RegExp(config.matcher[1]);

      const apiRoutes = [
        "/api/users",
        "/api/users/123",
        "/api/auth/login",
        "/api/v1/posts",
        "/trpc/user.get",
        "/trpc/posts.list",
      ];

      apiRoutes.forEach((route) => {
        expect(apiRegex.test(route)).toBe(true);
        // API routes might also match main pattern
      });
    });

    it("should exclude typical static assets", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const apiRegex = new RegExp(config.matcher[1]);

      const staticAssets = [
        "/_next/static/chunks/main.js",
        "/_next/static/css/app.css",
        "/favicon.ico",
        "/logo.svg",
        "/images/hero.jpg",
        "/fonts/inter.woff2",
        "/styles/globals.css",
        "/scripts/analytics.js",
      ];

      staticAssets.forEach((asset) => {
        expect(mainRegex.test(asset)).toBe(false);
        expect(apiRegex.test(asset)).toBe(false);
      });
    });
  });

  describe("configuration validation", () => {
    it("should have consistent configuration structure", () => {
      expect(config).toEqual({
        matcher: expect.arrayContaining([
          expect.stringMatching(/^\(/), // Should start with opening parenthesis
          expect.stringMatching(/^\(/), // Should start with opening parenthesis
        ]),
      });
    });

    it("should maintain configuration integrity", () => {
      const originalMatcher = [...config.matcher];

      // Verify the configuration remains consistent
      expect(config.matcher).toHaveLength(2);
      expect(config.matcher[0]).toBe(originalMatcher[0]);
      expect(config.matcher[1]).toBe(originalMatcher[1]);
    });
  });

  describe("regex pattern analysis", () => {
    it("should have proper negative lookahead for main pattern", () => {
      const mainPattern = config.matcher[0];
      expect(mainPattern).toContain("(?!_next");
      expect(mainPattern).toContain(
        "(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)"
      );
    });

    it("should properly handle js vs json distinction", () => {
      const mainRegex = new RegExp(config.matcher[0]);

      // Should exclude .js files
      expect(mainRegex.test("/script.js")).toBe(false);
      expect(mainRegex.test("/app.js")).toBe(false);

      // Should include .json files (js(?!on) means js not followed by 'on')
      expect(mainRegex.test("/data.json")).toBe(true);
      expect(mainRegex.test("/config.json")).toBe(true);
    });

    it("should handle optional extensions correctly", () => {
      const mainRegex = new RegExp(config.matcher[0]);

      // Test html? pattern (html or htm)
      expect(mainRegex.test("/page.html")).toBe(false);
      expect(mainRegex.test("/page.htm")).toBe(false);

      // Test jpe?g pattern (jpeg or jpg)
      expect(mainRegex.test("/image.jpeg")).toBe(false);
      expect(mainRegex.test("/image.jpg")).toBe(false);

      // Test woff2? pattern (woff or woff2)
      expect(mainRegex.test("/font.woff")).toBe(false);
      expect(mainRegex.test("/font.woff2")).toBe(false);

      // Test docx? pattern (doc or docx)
      expect(mainRegex.test("/doc.doc")).toBe(false);
      expect(mainRegex.test("/doc.docx")).toBe(false);

      // Test xlsx? pattern (xls or xlsx)
      expect(mainRegex.test("/sheet.xls")).toBe(false);
      expect(mainRegex.test("/sheet.xlsx")).toBe(false);
    });
  });

  describe("failure scenarios", () => {
    it("should handle malformed URLs gracefully", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const apiRegex = new RegExp(config.matcher[1]);

      const malformedUrls = [
        "//double/slash",
        "/path//double/slash",
        "/path/./current/dir",
        "/path/../parent/dir",
        "/path with spaces",
        "/path\twith\ttabs",
        "/path\nwith\nnewlines",
      ];

      malformedUrls.forEach((url) => {
        expect(() => mainRegex.test(url)).not.toThrow();
        expect(() => apiRegex.test(url)).not.toThrow();
      });
    });

    it("should handle extremely long paths", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const longPath = "/" + "segment/".repeat(100) + "end";

      expect(() => mainRegex.test(longPath)).not.toThrow();
      expect(mainRegex.test(longPath)).toBe(true);
    });

    it("should handle paths with unicode characters", () => {
      const mainRegex = new RegExp(config.matcher[0]);
      const unicodePaths = [
        "/café",
        "/データ",
        "/😀",
        "/пользователь",
        "/用户",
      ];

      unicodePaths.forEach((path) => {
        expect(() => mainRegex.test(path)).not.toThrow();
        expect(mainRegex.test(path)).toBe(true);
      });
    });
  });
});