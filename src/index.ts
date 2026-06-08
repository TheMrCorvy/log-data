import { FeatureNames, isFeatureFlagEnabled } from "./featureFlags.js";
import logsForServer from "./logs/server.js";
import logsForClient from "./logs/client.js";

// The user can extend the CustomLayers interface inside their project to enable autocompletions for custom layers
interface LayersAvailable {
	"*": "*";
}

export type AllLayersAvailable = keyof LayersAvailable;

export interface LogDataParams {
	title?: string;
	data?: unknown;
	type?: "log" | "error" | "warn" | "info";
	clearConsole?: boolean;
	timeStamp?: boolean;
	addSpaceBefore?: boolean;
	addSpaceAfter?: boolean;
	layer?: AllLayersAvailable;
	addSeparatorBefore?: boolean;
	addSeparatorAfter?: boolean;
}

export type LogData = (params: LogDataParams) => void;

export const logData: LogData = ({
	data,
	layer,
	title,
	type = "log",
	timeStamp = false,
	clearConsole = false,
	addSpaceAfter = false,
	addSpaceBefore = false,
	addSeparatorAfter = false,
	addSeparatorBefore = false,
}) => {
	const layersAvailable = JSON.parse(
		process.env.LAYERS_AVAILABLE || "[]",
	) as string[];

	const allowAllLogs = isFeatureFlagEnabled(
		FeatureNames.CONSOLE_LOG_ALL_LAYERS,
	);
	const allowSpecificLayer = isFeatureFlagEnabled(
		FeatureNames.CONSOLE_LOG_LAYER_SPECIFIC,
	);

	let logIsAvailable = false;

	if (
		layer !== undefined &&
		layersAvailable.includes(layer) &&
		allowSpecificLayer
	) {
		logIsAvailable = true;
		// If the layer is set and the FF is allowing for specific layers, then the logs are available
	}

	if (allowAllLogs) {
		logIsAvailable = true;
	}

	if (layer === "*") {
		logIsAvailable = true;
	}

	if (!logIsAvailable) {
		return;
	}

	if (clearConsole) {
		console.clear();
	}

	const appName = process.env.APP_NAME || "Unknown App";
	const separator =
		"- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
	const isServer = typeof window === "undefined";

	const logLabel = title ? `${title}${data ? ": " : ""}` : "Debug log: ";

	if (isServer) {
		return logsForServer({
			data,
			type,
			timeStamp,
			addSpaceAfter,
			addSpaceBefore,
			addSeparatorAfter,
			addSeparatorBefore,
			appName,
			separator,
			logLabel,
			logIsAvailable,
		});
	} else {
		return logsForClient({
			data,
			type,
			timeStamp,
			addSpaceAfter,
			addSpaceBefore,
			addSeparatorAfter,
			addSeparatorBefore,
			logIsAvailable,
			appName,
			separator,
			logLabel,
		});
	}
};

export { FeatureNames, isFeatureFlagEnabled } from "./featureFlags.js";
export type { LayersAvailable };
