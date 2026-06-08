import { LogDataParams } from "../index.js";
import { printTimeStamp } from "../timestamp.js";

interface LogsForClientParams extends LogDataParams {
	logIsAvailable: boolean;
	appName: string;
	separator: string;
	logLabel: string;
}

type LogsForClient = (params: LogsForClientParams) => void;

const logsForClient: LogsForClient = ({
	data,
	type = "log",
	logLabel,
	timeStamp = false,
	addSpaceAfter = false,
	addSpaceBefore = false,
	addSeparatorAfter = false,
	addSeparatorBefore = false,
	logIsAvailable,
	appName,
	separator,
}) => {
	let dataString: unknown;

	logSpace(addSpaceBefore);

	try {
		dataString = JSON.stringify({ app: appName, payload: data });
	} catch (err) {
		if (logIsAvailable) {
			console.warn("The data provided was corrupted or circular.", err);
			logSpace(true);
		}

		dataString = { app: appName, payload: data };
	}

	if (addSeparatorBefore) {
		console.log(separator);
	}

	switch (type) {
		case "error":
			console.error(logLabel, data ? dataString : "");
			break;

		case "warn":
			console.warn(logLabel, data ? dataString : "");
			break;

		case "info":
			console.info(logLabel, data ? dataString : "");

			break;

		default:
			console.log(logLabel, data ? dataString : "");
			break;
	}

	if (timeStamp) {
		logSpace(addSpaceAfter);
		console.log(printTimeStamp());
		logSpace(addSpaceAfter);
	}

	if (addSeparatorAfter) {
		console.log(separator);
	}

	logSpace(addSpaceAfter);
};

const logSpace = (addSpaceAfter: boolean) => {
	if (addSpaceAfter) {
		console.log(" ");
	}
};

export default logsForClient;
