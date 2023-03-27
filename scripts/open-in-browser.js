const { exec } = require('child_process')
const { platform } = require('os');

const WINDOWS_PLATFORM = 'win32';
const MAC_PLATFORM = 'darwin';

const osPlatform = platform(); 
const args = process.argv.slice(2);
let [url, browser] = args;

if (!browser) {
  browser = osPlatform === WINDOWS_PLATFORM
      ? 'chrome'
      : osPlatform === MAC_PLATFORM
      ? `"Google Chrome"`
      : 'google-chrome'
} 

let command
if (osPlatform === WINDOWS_PLATFORM) {
  command = `start ${browser} ${url}`;
} else if (osPlatform === MAC_PLATFORM) {
  command = `open -a ${browser} ${url}`;
} else {
  command = `${browser} --no-sandbox ${url}`;
}

console.log(`executing command: ${command}`);

exec(command);
