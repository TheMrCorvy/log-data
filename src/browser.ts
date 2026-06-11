import { FeatureNames, isFeatureFlagEnabled } from "./featureFlags.js";
import logsForClient from "./logs/client.js";
import type { LogData, LayersAvailable } from "./index.js";
import { getEnv } from "./env.js";

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
		getEnv("LAYERS_AVAILABLE") || "[]",
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

	const appName = getEnv("APP_NAME") || "Unknown App";
	const separator =
		"- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
	const logLabel = title ? `${title}${data ? ": " : ""}` : "Debug log: ";

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
		clearConsole,
	});
};

export { FeatureNames, isFeatureFlagEnabled } from "./featureFlags.js";
export type { LayersAvailable };
