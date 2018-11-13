import {checkZammadTicket, togglePageAction} from "./utils";
import store from './store'; // For VuexWebExtensions

global.browser = require('webextension-polyfill');

global.browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab) {
        switch (message.type) {
            case 'showPageAction': togglePageAction(sender.tab.id, true);
                break;
            case 'hidePageAction': togglePageAction(sender.tab.id, false);
                break;
            case 'checkZammadUrl': {
                togglePageAction(
                    sender.tab.id,
                    checkZammadTicket(sender.tab.url)
                );
            }
                break;
        }
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