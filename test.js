import { logData } from "./dist/index.js";

// ============================================================================
// TypeScript Autocomplete Customization Example:
//
// In your consumer TypeScript application, to get autocomplete suggestions for
// custom layers when calling logData(), create a declaration file (e.g.,
// `src/types/log-data.d.ts`) containing:
//
// ```typescript
// import "log-data";
//
// declare module "log-data" {
//     export interface CustomLayers {
//         my_custom_layer: true;
//         database_queries: true;
//         auth_service: true;
//     }
// }
// ```
// ============================================================================

process.env.CONSOLE_LOG_ALL_LAYERS = "true";
process.env.APP_NAME = "My Test App";

console.log("--- TEST 1: Server Side (should use Pino) ---");
logData({
	title: "Server Error Log",
	data: { reason: "Something went wrong" },
	type: "error",
	layer: "*",
	addSeparatorBefore: true,
	addSeparatorAfter: true,
});

console.log("\n--- TEST 2: Client Side (should use Console) ---");

// Safely define window on global to simulate browser/client environment
globalThis.window = {};

logData({
	title: "Client Log",
	data: { status: "success" },
	type: "log",
	layer: "*",
	addSeparatorBefore: true,
	addSeparatorAfter: true,
});

// Clean up
delete globalThis.window;
