import pino from "pino";
import { LogDataParams } from "../index.js";
import { printTimeStamp } from "../timestamp.js";

interface LogsForServerParams extends LogDataParams {
	appName: string;
	separator: string;
	logLabel: string;
	logIsAvailable: boolean;
}

type LogsForServer = (params: LogsForServerParams) => void;

const pinoLogger = pino();

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
	logSpace(addSpaceBefore);

	if (addSeparatorBefore) {
		pinoLogger.info(separator);
		logSpace(true);
	}

	const payload = data
		? { app: appName, payload: data }
		: { app: appName, payload: undefined };

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

	if (timeStamp) {
		logSpace(addSpaceAfter);
		pinoLogger.info(printTimeStamp());
		logSpace(addSpaceAfter);
	}

	if (addSeparatorAfter) {
		pinoLogger.info(separator);
	}

	logSpace(addSpaceAfter);
};

const logSpace = (booleanFlag: boolean) => {
	if (booleanFlag) {
		pinoLogger.info(" ");
	}
};

export default logsForServer;
