# log-data

A simple, environment-aware logging library for client and server.

## Configuration (Environment Variables)

Configure these variables in your project's `.env` file:

### 1. Available Layers

Define active layers for logging using `LAYERS_AVAILABLE` as a JSON array string:

```env
LAYERS_AVAILABLE='["auth", "database", "api"]'
```

### 2. Feature Flags

Define feature flags as a JSON array of objects with `feature` and `enabled` properties:

```env
FEATURE_FLAGS='[{"feature": "CONSOLE_LOG_ALL_LAYERS", "enabled": false}, {"feature": "CONSOLE_LOG_LAYER_SPECIFIC", "enabled": true}]'
```

_Note: Default feature flag names are `CONSOLE_LOG_ALL_LAYERS` and `CONSOLE_LOG_LAYER_SPECIFIC`._

### 3. Logs Path

Set the output directory for server-side log files. If not defined, logs default to `stdout`:

```env
LOGS_PATH="./logs"
```

Logs will be saved under this path as `<APP_NAME>.log` (using the `APP_NAME` environment variable).

This variable should be and absolute path from the root directory to the folder that will contain the logs.

If this folder doesn't exists, then logData function will create it during the first execution.

### 4. Use console

Set the env var USE_CONSOLE = true || "true" in order to tell the package that you want to see the logs in the terminal rather than in the logs file.

This feature is going to be very useful while developing ;) By default is set to false, making it send the logs to pino, but you can set it up by adding this in your .env file:

```env
USE_CONSOLE=true
```

---

## Usage & API

### 1. `logData`

Import and call `logData` to log payloads. It routes to Pino on the server and `console` on the client:

```typescript
import { logData } from "log-data";

logData({
	title: "User Signup",
	data: { userId: 123 },
	type: "info", // "log" | "warn" | "error" | "info"
	layer: "auth", // Suggested by TS autocomplete if declared
	timeStamp: true,
	addSeparatorBefore: true,
});
```

### 2. `isFeatureFlagEnabled`

Check if a specific feature flag is active by calling `isFeatureFlagEnabled` with `FeatureNames` (or a custom flag):

```typescript
import { isFeatureFlagEnabled, FeatureNames } from "log-data";

if (isFeatureFlagEnabled(FeatureNames.CONSOLE_LOG_ALL_LAYERS)) {
	logData({
		title: "Feature Flag Active",
		data: { string: "Your data goes here." },
		type: "info",
	});
}
```

---

## TypeScript Setup

### 1. Declaring Custom Layers (Autocomplete in `logData`)

To enable type checking and autocomplete suggestions for custom layers when calling `logData`, create a type declaration file (e.g., `src/types/log-data.d.ts` or `global.d.ts`) in your consumer project:

```typescript
import "log-data";

declare module "log-data" {
	// Extend LayersAvailable interface using declaration merging
	export interface LayersAvailable {
		auth: "auth";
		database: "database";
		api: "api";
	}
}
```

### 2. Declaring Custom Feature Flags (Autocomplete & Type Safety)

To declare custom feature flags and extend the library's `FeatureNames`, create a constant named `FeatureFlagsAvailable` that spreads the base `FeatureNames` object and adds your custom options:

```typescript
import { FeatureNames } from "log-data";

export const FeatureFlagsAvailable = {
	...FeatureNames,
	MY_CUSTOM_FLAG: "MY_CUSTOM_FLAG",
} as const;

export type FeatureFlagsAvailable =
	(typeof FeatureFlagsAvailable)[keyof typeof FeatureFlagsAvailable];
```

By typing `FeatureFlagsAvailable.`, your IDE will autocomplete both your custom options and the default ones (e.g. `CONSOLE_LOG_ALL_LAYERS`).

You can then pass the flag directly to `isFeatureFlagEnabled`:

```typescript
import { isFeatureFlagEnabled } from "log-data";

if (isFeatureFlagEnabled(FeatureFlagsAvailable.MY_CUSTOM_FLAG)) {
	// Runs if MY_CUSTOM_FLAG is enabled in process.env.FEATURE_FLAGS
}
```
