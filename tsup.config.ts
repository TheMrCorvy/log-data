import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/browser.ts"],
	format: ["cjs", "esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	outExtension({ format }) {
		if (format === "esm") {
			return { js: ".mjs", dts: ".d.mts" };
		}
		return { js: ".js", dts: ".d.ts" };
	},
});
