global.browser = require('webextension-polyfill');


global.browser.runtime.sendMessage({ type: 'checkZammadUrl' });