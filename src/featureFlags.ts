export const FeatureNames = {
	CONSOLE_LOG_ALL_LAYERS: "CONSOLE_LOG_ALL_LAYERS",
	CONSOLE_LOG_LAYER_SPECIFIC: "CONSOLE_LOG_LAYER_SPECIFIC",
};

export type FeatureNames = (typeof FeatureNames)[keyof typeof FeatureNames];

export interface FeatureFlag {
	enabled: boolean;
	feature: FeatureNames;
}

const getFeatureFlags = (): FeatureFlag[] | null => {
	const featureFlagsString = process.env.FEATURE_FLAGS;

	if (!featureFlagsString) {
		return null;
	}

	return JSON.parse(featureFlagsString);
};

export const isFeatureFlagEnabled = (ff: FeatureNames): boolean => {
	const featureFlagList = getFeatureFlags();

	if (!featureFlagList || featureFlagList.length === 0) {
		return false;
	}

	const featureFlag = featureFlagList.find((f) => f.feature === ff);

	if (!featureFlag) return false;

	return featureFlag.enabled;
};
