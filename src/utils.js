import store from './store';

const browser = require('webextension-polyfill');
const regex = null; // REGEX

function checkZammadTicket(url) {
    let test = regex.exec(url);

    console.log(url);
    console.log(store.state);
    console.log(test);
    console.log(!!(test && test[1]));

    return !!(test && test[1]);
}

function togglePageAction(tabId, show = false) {
    if (show) {
        browser.browserAction.setIcon({
            tabId,
            path: {
                48: 'icons/icon_48.png',
                128: 'icons/icon_128.png'
            }
        });

        browser.browserAction.setPopup({
            tabId,
            popup: 'popup/popup.html'
        });

        return;
    }

    browser.browserAction.setIcon({
        tabId,
        path: {
            48: 'icons/icon_48-gray.png',
            128: 'icons/icon_128-gray.png'
        }
    });

    browser.browserAction.setPopup({
        tabId,
        popup: 'popup/not-found.html'
    })
}

function getZammadURL() {
    return `${location.protocol}//${location.host}`;
}

function last(array) {
    return array[array.length - 1];
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export {
    checkZammadTicket,
    togglePageAction,
    getZammadURL,
    last,
    isNumeric
}