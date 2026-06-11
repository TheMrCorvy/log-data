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
*Note: Default feature flag names are `CONSOLE_LOG_ALL_LAYERS` and `CONSOLE_LOG_LAYER_SPECIFIC`.*

### 3. Logs Path
Set the output directory for server-side log files. If not defined, logs default to `stdout`:
```env
LOGS_PATH="./logs"
```
Logs will be saved under this path as `<APP_NAME>.log` (using the `APP_NAME` environment variable).

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
  addSeparatorBefore: true
});
```

### 2. `isFeatureFlagEnabled`
Check if a specific feature flag is active by calling `isFeatureFlagEnabled` with `FeatureNames` (or a custom flag):

```typescript
import { isFeatureFlagEnabled, FeatureNames } from "log-data";

if (isFeatureFlagEnabled(FeatureNames.CONSOLE_LOG_ALL_LAYERS)) {
  logData({
    title: "Feature Flag Active",
    data: { flag: FeatureNames.CONSOLE_LOG_ALL_LAYERS },
    type: "log"
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

export type FeatureFlagsAvailable = typeof FeatureFlagsAvailable[keyof typeof FeatureFlagsAvailable];
```

By typing `FeatureFlagsAvailable.`, your IDE will autocomplete both your custom options and the default ones (e.g. `CONSOLE_LOG_ALL_LAYERS`).

You can then pass the flag directly to `isFeatureFlagEnabled`:

```typescript
import { isFeatureFlagEnabled } from "log-data";

if (isFeatureFlagEnabled(FeatureFlagsAvailable.MY_CUSTOM_FLAG)) {
  // Runs if MY_CUSTOM_FLAG is enabled in process.env.FEATURE_FLAGS
}
```
