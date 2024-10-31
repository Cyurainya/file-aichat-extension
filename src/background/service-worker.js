// background.js

let pageContent = '';

// @ts-ignore
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SEND_CONTENT") {
    pageContent = message.content; // 保存 content 内容
  }
});

// 供 popup.js 获取数据
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_CONTENT") {
    // @ts-ignore
    sendResponse({ content: pageContent });
  }

  // 返回 true 以保持消息通道打开，以便异步调用 sendResponse
  return true;
});