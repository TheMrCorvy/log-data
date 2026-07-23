import pino from "pino";
import path from "path";
import fs from "fs";
import { LogDataParams } from "../index.js";
import { printTimeStamp } from "../timestamp.js";
import { getEnv } from "../env.js";

interface LogsForServerParams extends LogDataParams {
	appName: string;
	separator: string;
	logLabel: string;
	logIsAvailable: boolean;
}

type LogsForServer = (params: LogsForServerParams) => void;

interface LogDataPayload {
	app: string;
	payload: unknown;
	timestamp?: string;
}

const loggerCache = new Map<string, pino.Logger>();

const getLogger = (appName: string): pino.Logger => {
	const logsDir = getEnv("LOGS_PATH");

	if (!logsDir) {
		let defaultLogger = loggerCache.get("stdout");

		if (!defaultLogger) {
			defaultLogger = pino();
			loggerCache.set("stdout", defaultLogger);
		}
		return defaultLogger;
	}

	const resolvedDir = path.resolve(logsDir);
	const logFilePath = path.join(resolvedDir, `${appName}.log`);

	let logger = loggerCache.get(logFilePath);

	if (!logger) {
		if (!fs.existsSync(resolvedDir)) {
			fs.mkdirSync(resolvedDir, { recursive: true });
		}

		logger = pino(pino.destination(logFilePath));
		loggerCache.set(logFilePath, logger);
	}

	return logger;
};

const logsForServer: LogsForServer = ({
	data,
	type = "log",
	timeStamp = false,
	addSpaceAfter = false,
	addSpaceBefore = false,
	addSeparatorAfter = false,
	addSeparatorBefore = false,
	appName,
	separator,
	logLabel,
}) => {
	const pinoLogger = getLogger(appName);

	logSpace(pinoLogger, addSpaceBefore);

	if (addSeparatorBefore) {
		pinoLogger.info(separator);
		logSpace(pinoLogger, true);
	}

	const payload: LogDataPayload = {
		app: appName,
		payload: data ?? undefined,
	};

	if (timeStamp) {
		payload.timestamp = printTimeStamp();
	}

	switch (type) {
		case "error":
			pinoLogger.error(payload, logLabel);
			break;

		case "warn":
			pinoLogger.warn(payload, logLabel);
			break;

		case "info":
			pinoLogger.info(payload, logLabel);
			break;

		default:
			pinoLogger.info(payload, logLabel);
			break;
	}

	if (addSeparatorAfter) {
		pinoLogger.info(separator);
	}

	logSpace(pinoLogger, addSpaceAfter);
};

const logSpace = (logger: pino.Logger, booleanFlag: boolean) => {
	if (booleanFlag) {
		logger.info(" ");
	}
};

export default logsForServer;
