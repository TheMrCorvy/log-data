export const getEnv = (key: string): string | undefined => {
	return typeof process !== "undefined" && process.env ? process.env[key] : undefined;
};
