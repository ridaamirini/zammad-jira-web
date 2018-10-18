import {checkZammadTicket, togglePageAction} from "./utils";

global.browser = require('webextension-polyfill');

global.browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab && message.type === 'showPageAction') {
        togglePageAction(sender.tab.id, true);
    }
});

// Disable the plugin when you navigate away from a ticket
global.browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!changeInfo.url) return;

    if (!checkZammadTicket(changeInfo.url)) {
        togglePageAction(tabId);
    } else {
        togglePageAction(tabId, true);
    }
});
