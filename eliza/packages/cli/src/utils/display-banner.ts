// Export function to display banner and version

import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';

// Function to get the package version
// --- Utility: Get local CLI version from package.json ---
export function getVersion(): string {
  // For ESM modules we need to use import.meta.url instead of __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Find package.json relative to the current file
  const packageJsonPath = path.resolve(__dirname, '../package.json');

  // Add a simple check in case the path is incorrect
  let version = '0.0.0'; // Fallback version
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Warning: package.json not found at ${packageJsonPath}`);
  } else {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      version = packageJson.version || '0.0.0';
    } catch (error) {
      console.error(`Error reading or parsing package.json at ${packageJsonPath}:`, error);
    }
  }
  return version;
}

// --- Utility: Get install tag based on CLI version ---
export function getCliInstallTag(): string {
  const version = getVersion();
  if (version.includes('-alpha')) {
    return 'alpha';
  } else if (version.includes('-beta')) {
    return 'beta';
  }
  return ''; // Return empty string for stable or non-tagged versions (implies latest)
}

// --- Utility: Check if terminal supports UTF-8 ---
export function isUtf8Locale() {
  for (const key of ['LC_ALL', 'LC_CTYPE', 'LANG', 'LANGUAGE']) {
    const v = process.env[key];
    if (typeof v === 'string' && /UTF-?8/i.test(v)) {
      return true;
    }
  }
  return false;
}
// --- Utility: Check for latest CLI version and notify user ---
async function checkForCliUpdate(currentVersion: string) {
  try {
    // Get the time data for all published versions to find the most recent
    const { stdout } = await execa('npm', ['view', '@elizaos/cli', 'time', '--json']);
    const timeData = JSON.parse(stdout);

    // Remove metadata entries like 'created' and 'modified'
    delete timeData.created;
    delete timeData.modified;

    // Find the most recently published version
    let latestVersion = '';
    let latestDate = new Date(0); // Start with epoch time

    for (const [version, dateString] of Object.entries(timeData)) {
      const publishDate = new Date(dateString as string);
      if (publishDate > latestDate) {
        latestDate = publishDate;
        latestVersion = version;
      }
    }

    // If already at the latest version or couldn't determine latest, exit
    if (!latestVersion || latestVersion === currentVersion) return;

    console.log(
      `\x1b[33m\nA new version of elizaOS CLI is available: ${latestVersion} (current: ${currentVersion})\x1b[0m`
    );
    console.log(`\x1b[32mUpdate with: elizaos update\x1b[0m\n`);
  } catch {
    /* silent: update check failure must not block banner */
  }
}

// --- Main: Display banner and version, then check for updates ---
export async function displayBanner() {
  if (!isUtf8Locale()) {
    // Terminal does not support UTF-8, skip banner
    return;
  }
  // Color ANSI escape codes
  const b = '\x1b[38;5;27m';
  const lightblue = '\x1b[38;5;51m';
  const w = '\x1b[38;5;255m';
  const r = '\x1b[0m';
  const red = '\x1b[38;5;196m';
  let versionColor = lightblue;

  const version = getVersion();

  // if version includes "beta" or "alpha" then use red
  if (version?.includes('beta') || version?.includes('alpha')) {
    versionColor = red;
  }
  const banners = [
    //     // Banner 2
    //     `
    // ${b}          ###                                  ${w}  # ###       #######  ${r}
    // ${b}         ###    #                            / ${w} /###     /       ###  ${r}
    // ${b}          ##   ###                          /  ${w}/  ###   /         ##  ${r}
    // ${b}          ##    #                          / ${w} ##   ###  ##        #   ${r}
    // ${b}          ##                              /  ${w}###    ###  ###          ${r}
    // ${b}   /##    ##  ###    ######      /###    ${w}##   ##     ## ## ###        ${r}
    // ${b}  / ###   ##   ###  /#######    / ###  / ${w}##   ##     ##  ### ###      ${r}
    // ${b} /   ###  ##    ## /      ##   /   ###/  ${w}##   ##     ##    ### ###    ${r}
    // ${b}##    ### ##    ##        /   ##    ##   ${w}##   ##     ##      ### /##  ${r}
    // ${b}########  ##    ##       /    ##    ##   ${w}##   ##     ##        #/ /## ${r}
    // ${b}#######   ##    ##      ###   ##    ##   ${w} ##  ##     ##         #/ ## ${r}
    // ${b}##        ##    ##       ###  ##    ##   ${w}  ## #      /           # /  ${r}
    // ${b}####    / ##    ##        ### ##    /#   ${w}   ###     /  /##        /   ${r}
    // ${b} ######/  ### / ### /      ##  ####/ ##  ${w}    ######/  /  ########/    ${r}
    // ${b}  #####    ##/   ##/       ##   ###   ## ${w}      ###   /     #####      ${r}
    // ${b}                           /             ${w}            |                ${r}
    // ${b}                          /              ${w}             \)              ${r}
    // ${b}                         /               ${w}                             ${r}
    // ${b}                        /                ${w}                             ${r}
    // `,

    //     // Banner 3
    //     `
    // ${b}      :::::::::::::      ::::::::::::::::::::    ::: ${w}    ::::::::  :::::::: ${r}
    // ${b}     :+:       :+:          :+:         :+:   :+: :+:${w}  :+:    :+::+:    :+: ${r}
    // ${b}    +:+       +:+          +:+        +:+   +:+   +:+${w} +:+    +:++:+         ${r}
    // ${b}   +#++:++#  +#+          +#+       +#+   +#++:++#++:${w}+#+    +:++#++:++#++   ${r}
    // ${b}  +#+       +#+          +#+      +#+    +#+     +#+${w}+#+    +#+       +#+    ${r}
    // ${b} #+#       #+#          #+#     #+#     #+#     #+##${w}+#    #+##+#    #+#     ${r}
    // ${b}##########################################     #### ${w}#######  ########       ${r}`,

    `
${b}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⠀⠙⠛⠿⢤⣦⣐⠀${w}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${r}
${b}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣐⣿⣿⢰⡀⠀⠀⠀⠈⠻⠀${w}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${r}
${b}⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠤⠾⠛⠛⣿⣶⣇⠀⠀⡆⠀⠀⠀${w}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${r}
${b}⠀⠀⢰⣋⡳⡄⠀⠀⠀⢨⣭⡀⠀⡤⠀⣀⣝⢿⣶⣿⡅⠀⠀⠀${w}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${r}
${b}⠀⠀⢸⣯⠀⣇⠀⠀⠀⣼⣿⣿⣆⢷⣴⣿⣿⡏⣛⡉⠀⠀⠀⠀${w}⢸⣿⣿⣿⣿⣿⣿⢸⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⣾⣿⣿⣧⠀⠀⠀⢸⠟⢀⣴⣿⣿⣿⣿⣦⡀⣠⣾⣿⣿⣿⣿⣦⡙⢿⠀${r}
${b}⠀⠀⠀⠙⢷⣮⠀⠀⢸⣿⣿⣿⣿⣷⣯⣟⣏⣼⣷⣅⠾⡟⠀⠀${w}⢸⣿⣇⣀⣀⣀⠀⢸⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⠀⠀⣠⣿⣿⠟⠁⠀⠀⣼⣿⡟⣿⣿⣆⠀⠀⠀⠀⣿⣿⠋⠀⠈⠻⣿⡇⣿⣿⣅⣀⣀⡛⠛⠃⠀⠀${r}
${b}⠀⠀⠀⠀⠀⠁⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀${w}⢸⣿⡿⠿⠿⠿⠀⢸⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣠⣾⣿⠟⠁⠀⠀⠀⣰⣿⣿⣁⣸⣿⣿⡄⠀⠀⠀⣿⣿⡀⠀⠀⢘⣿⣿⢈⣛⠿⠿⠿⣿⣷⡄⠀⠀${r}
${b}⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣉⡟⠀⠀⠀⠀⠀${w}⢸⣿⣧⣤⣤⣤⣤⢸⣿⣿⣦⣤⣤⣤⡄⣿⣿⡇⣾⣿⣿⣧⣤⣤⣤⡄⢰⣿⣿⠟⠛⠛⠻⣿⣿⡄⢠⡀⠻⣿⣿⣦⣴⣿⣿⠇⢿⣿⣦⣤⣤⣿⣿⠇⣠⠀${r}
${b}⠀⠀⠀⠀⠀⠀⠀⠀⢰⡈⠛⠿⣿⣿⣿⣿⣿⠋⠀⣦⣤⣄⠀⠀${w}⠘⠛⠛⠛⠛⠛⠛⠈⠛⠛⠛⠛⠛⠛⠃⠛⠛⠃⠛⠛⠛⠛⠛⠛⠛⠃⠛⠛⠃⠀⠀⠀⠀⠙⠛⠃⠘⠛⠀⠈⠛⠛⠛⠛⠁⠀⠀⠙⠛⠛⠛⠛⠁⠚⠛⠀${r}
${b}⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡦⠀⠀⠉⠛⠿⠃⠀⠀⠀⠁⠉⠀⠀${w}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${r}
${b}⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⢾⡃⠀⠀${w}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${r}
`,
  ];

  // Randomly select and log one banner
  const randomBanner = banners[Math.floor(Math.random() * banners.length)];

  console.log(randomBanner);

  if (version) {
    // log the version
    console.log(`${versionColor}Version: ${version}${r}`);
  }

  // Notify user if a new CLI version is available
  try {
    await checkForCliUpdate(version);
  } catch (error) {
    // Silently continue if update check fails
  }
}
