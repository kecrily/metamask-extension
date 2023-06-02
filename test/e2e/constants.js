const tinyDelayMs = 200;
const regularDelayMs = tinyDelayMs * 2;
const largeDelayMs = regularDelayMs * 2;
const veryLargeDelayMs = largeDelayMs * 2;
const dappBasePort = 8080;

const WINDOW_TITLES = Object.freeze({
  ExtensionInFullScreenView: 'MetaMask',
  TestDApp: 'E2E Test Dapp',
  Notification: 'MetaMask Notification',
  ServiceWorkerSettings: 'Inspect with Chrome Developer Tools',
  InstalledExtensions: 'Extensions',
});

const DAPP_URL = 'http://127.0.0.1:8080';
const DAPP_ONE_URL = 'http://127.0.0.1:8081';
const SERVICE_WORKER_URL = 'chrome://inspect/#service-workers';

const PRIVATE_KEY =
  '0x7C9529A67102755B7E6102D6D950AC5D5863C98713805CEC576B945B15B71EAC';

const TEST_SEED_PHRASE =
  'forum vessel pink push lonely enact gentle tail admit parrot grunt dress';

const TEST_SEED_PHRASE_TWO =
  'phrase upgrade clock rough situate wedding elder clever doctor stamp excess tent';

const WALLET_PASSWORD = 'correct horse battery staple';

const STALELIST_URL =
  'https://static.metafi.codefi.network/api/v1/lists/stalelist.json';

const emptyHtmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>title</title>
  </head>
  <body>
    Empty page
  </body>
</html>`;

module.exports = {
  DAPP_URL,
  DAPP_ONE_URL,
  SERVICE_WORKER_URL,
  TEST_SEED_PHRASE,
  TEST_SEED_PHRASE_TWO,
  tinyDelayMs,
  regularDelayMs,
  largeDelayMs,
  veryLargeDelayMs,
  WALLET_PASSWORD,
  WINDOW_TITLES,
  PRIVATE_KEY,
  STALELIST_URL,
  emptyHtmlPage,
  dappBasePort,
};
