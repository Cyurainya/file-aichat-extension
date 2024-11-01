

let mainContent = "";

// Listen for messages from the content script
// @ts-ignore
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "UPDATE_MAIN_CONTENT") {
    mainContent = message.content;

    // Send updated content to popup if it's open
    chrome.runtime.sendMessage({ type: "CONTENT_UPDATE", content: mainContent });
  }
});

// Handle popup requesting the latest content
// @ts-ignore
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "REQUEST_MAIN_CONTENT") {
    // @ts-ignore
    sendResponse({ content: mainContent });
  }
});
