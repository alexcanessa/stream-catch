const infos = {badges: {}};
const updateBadge = tabId => {
    if (!infos.badges[tabId]) {
        return;
    }

    chrome.browserAction.setBadgeText({text: '1', tabId});
};
const saveUrl = requestDetails => {
    chrome.tabs.query({currentWindow: true, active: true}, ([{ id }]) => {
        infos.badges[id] = requestDetails.url;

        updateBadge(id);
    });
};

chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.query({currentWindow: true, active: true}, ([{ id }]) => {
        if (!infos.badges[id]) {
            return;
        }

        chrome.tabs.executeScript(id, {file: 'scripts/content.js'}, () => {
            chrome.tabs.sendMessage(id, infos.badges[id]);
        });
    });
});
chrome.webRequest.onBeforeRequest.addListener(
    saveUrl,
    {urls: ['<all_urls>'], types: ['media']}
);
chrome.tabs.onUpdated.addListener(tabId => {
    updateBadge(tabId);
});
