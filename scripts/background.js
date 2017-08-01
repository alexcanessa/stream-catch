'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var infos = { badges: {} };
var updateBadge = function updateBadge(tabId) {
    if (!infos.badges[tabId]) {
        return;
    }

    chrome.browserAction.setBadgeText({ text: '1', tabId: tabId });
};
var saveUrl = function saveUrl(requestDetails) {
    if (!requestDetails.url.match(/.(mp4|avi|mov|wmv)$/i)) {
        return;
    }

    chrome.tabs.query({ currentWindow: true, active: true }, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            id = _ref2[0].id;

        infos.badges[id] = requestDetails.url;

        updateBadge(id);
    });
};

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            id = _ref4[0].id;

        if (!infos.badges[id]) {
            return;
        }

        chrome.tabs.executeScript(id, { file: 'scripts/content.js' }, function () {
            chrome.tabs.sendMessage(id, infos.badges[id]);
        });
    });
});
chrome.webRequest.onBeforeRequest.addListener(saveUrl, { urls: ['<all_urls>'], types: ['media'] });
chrome.tabs.onUpdated.addListener(function (tabId) {
    updateBadge(tabId);
});