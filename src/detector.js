import {checkZammadTicket} from "./utils";

global.browser = require('webextension-polyfill');

if (checkZammadTicket(window.location.href)) {
    global.browser.runtime.sendMessage({ type: 'showPageAction' });
}