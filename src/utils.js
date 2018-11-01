import store from './store';

const browser = require('webextension-polyfill');
const regex = /(?=(([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))).*\/#ticket\/zoom\/[0-9].*/gim;

function checkZammadTicket(url) {
    let test = regex.exec(url);

    console.log(store.state);

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