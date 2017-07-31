function saveFile(url) {
    chrome.runtime.onMessage.removeListener(saveFile);
    window.open(url, '_blank');
}

chrome.runtime.onMessage.addListener(saveFile);
