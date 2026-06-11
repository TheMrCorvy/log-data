import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Helper to run shell commands with full stdio inheritance (enables interactive login/publish)
function runCommand(command) {
	try {
		execSync(command, { stdio: "inherit", shell: true });
		return true;
	} catch (error) {
		return false;
	}
}

// Helper to run commands and capture stdout
function captureCommand(command) {
	try {
		return execSync(command, { stdio: ["ignore", "pipe", "ignore"], encoding: "utf8", shell: true }).trim();
	} catch (error) {
		return null;
	}
}

const pkgPath = path.resolve(process.cwd(), "package.json");

if (!fs.existsSync(pkgPath)) {
	console.error(
		"❌ package.json not found in the current working directory.",
	);
	process.exit(1);
}

// 1. Read package.json metadata
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const packageName = pkg.name;
const currentVersion = pkg.version;

console.log("================================================");
console.log(`📦 Package: ${packageName}`);
console.log(`🏷️  Current Version: ${currentVersion}`);
console.log("================================================\n");

// 2. Check npm login status
console.log("🔄 Checking npm login status...");
const username = captureCommand("npm whoami");

if (username) {
	console.log(`✅ Already logged in as: ${username}\n`);
} else {
	console.log("⚠️  Not logged in to npm. Starting login process...\n");
	const loginSuccess = runCommand("npm login");
	if (!loginSuccess) {
		console.error("❌ Login failed or was aborted. Exiting.");
		process.exit(1);
	}
	console.log("✅ Login successful!\n");
}

// 3. Check if current version is already published
console.log(`🔄 Checking if version ${currentVersion} is already published...`);
const versionsRaw = captureCommand(`npm view ${packageName} versions --json`);

let publishedVersions = [];
if (versionsRaw) {
	try {
		const parsed = JSON.parse(versionsRaw);
		publishedVersions = Array.isArray(parsed) ? parsed : [parsed];
	} catch (e) {
		// If it's a single version string not parsed as array
		if (versionsRaw.trim()) {
			publishedVersions = [versionsRaw.replace(/"/g, "").trim()];
		}
	}
}

let publishVersion = currentVersion;
if (publishedVersions.includes(currentVersion)) {
	console.log(
		`⚠️  Version ${currentVersion} is already published on the npm registry.`,
	);
	console.log("🔄 Bumping patch version in package.json...");

	// Bump version locally without creating git tags/commits
	const bumpSuccess = runCommand("npm version patch --no-git-tag-version");
	if (!bumpSuccess) {
		console.error("❌ Failed to bump version. Exiting.");
		process.exit(1);
	}

	// Re-read updated package.json
	const updatedPkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	publishVersion = updatedPkg.version;
	console.log(`✅ Version bumped to: ${publishVersion}\n`);
} else {
	console.log(
		`✅ Version ${currentVersion} is available to publish (no bump needed).\n`,
	);
}

// 4. Run pnpm publish
console.log("🚀 Initiating build and publish process...");

// Choose proper command based on scoped package vs unscoped package
const isScoped = packageName.startsWith("@");
const publishCommand = isScoped
	? "npm publish --access public"
	: "npm publish";

const publishSuccess = runCommand(publishCommand);

if (publishSuccess) {
	console.log(
		`\n🎉 Successfully published ${packageName}@${publishVersion} to npm!`,
	);
} else {
	console.error(
		"\n❌ Publish failed. Please check the logs above for details.",
	);
	process.exit(1);
}
