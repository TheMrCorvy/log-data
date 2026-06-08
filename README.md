# log-data

A lightweight, environment-aware, zero-dependency-wrapped logging library for TypeScript and JavaScript applications. It automatically routes server logs to **Pino** (for high-performance JSON logging) and client logs to standard **Console** methods.

## Features

- **Environment-Aware**: Automatically detects whether it is running on the client or the server (by checking if `window` is defined).
- **Server Logging**: Powered by [Pino](https://github.com/pinojs/pino) to produce highly performant, structured JSON logs.
- **Client Logging**: Uses standard browser `console` methods (`log`, `warn`, `error`, `info`) with optional formatting.
- **Layer-Based Filtering**: Easily toggle entire sections of logs via the `LAYERS_AVAILABLE` environment variable.
- **Feature Flags**: Fully supports runtime feature flags for toggling logs globally or selectively.
- **Customizable Autocomplete**: Extendable layers utilizing TypeScript declaration merging to preserve IDE autocompletions.

---

## Installation

Install the package via `pnpm`:

```bash
pnpm add log-data
```

Or using `npm` or `yarn`:

```bash
npm install log-data
# or
yarn add log-data
```

---

## Configuration & Environment Variables

Configure your environment variables inside your `.env` file:

```env
# The name of your application
APP_NAME="My Premium App"

# Enables logging across ALL layers if set to "true" or "1"
CONSOLE_LOG_ALL_LAYERS="true"

# Enables logging for specific layers defined in LAYERS_AVAILABLE if set to "true" or "1"
CONSOLE_LOG_LAYER_SPECIFIC="true"

# JSON array of layers that should be logged (when CONSOLE_LOG_LAYER_SPECIFIC is active)
LAYERS_AVAILABLE='["strapi_service", "auth_login", "my_custom_layer"]'
```

---

## How to Configure Autocomplete for Custom Layers

To extend the autocomplete options for the `layer` parameter in your specific projects, you can use TypeScript's declaration merging.

Simply create a type declaration file (e.g., `src/types/log-data.d.ts` or `global.d.ts`) in your consumer project:

```typescript
import "log-data";

declare module "log-data" {
	export interface CustomLayers {
		// Add your project-specific layers here as keys
		my_custom_layer: true;
		db_queries: true;
		payment_gateway: true;
	}
}
```

Once declared, your IDE will automatically suggest your custom layers (like `"my_custom_layer"`, `"db_queries"`, and `"payment_gateway"`) alongside the default ones when calling `logData`.

---

## Usage

```typescript
import { logData } from "log-data";

// 1. Simple logging with a title and payload
logData({
	title: "User logged in",
	data: { userId: "123", email: "user@example.com" },
	type: "info",
	layer: "auth_login", // Provides autocomplete suggestions!
});

// 2. Error logging with separators and spaces
logData({
	title: "Strapi fetch failed",
	data: { statusCode: 500, error: "Internal Server Error" },
	type: "error",
	layer: "strapi_service",
	addSeparatorBefore: true,
	addSeparatorAfter: true,
	addSpaceBefore: true,
	addSpaceAfter: true,
});

// 3. Simple log with timestamp
logData({
	title: "Queue job started",
	type: "log",
	layer: "queue_jobs",
	timeStamp: true,
});
```

---

## Output Behavior

### Client-side (Browser)

Logs look like standard styled messages:

```text
--------------------------------------------------------------------------------------------
User logged in: {"app":"My Premium App","payload":{"userId":"123","email":"user@example.com"}}
--------------------------------------------------------------------------------------------
```

### Server-side (Node.js)

Logs look like structured JSON records produced by Pino:

```json
{
	"level": 30,
	"time": 1623120000000,
	"pid": 12345,
	"hostname": "server-1",
	"app": "My Premium App",
	"payload": { "userId": "123", "email": "user@example.com" },
	"msg": "User logged in: "
}
```

## Developer Scripts

Within the `log-data` library:

- **Build**: `pnpm run build`
- **Lint**: `pnpm run lint`

## License

[ISC](LICENSE)
