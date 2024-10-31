// content.js

window.onload = () => {
  // 页面加载完成后执行
  const contentElement = document.getElementsByTagName('article');
  console.log('contentElement',contentElement)
  if (contentElement) {
    const contentHTML = contentElement[0].innerHTML;
    // 发送消息到背景脚本，包含页面的 content 内容
    chrome.runtime.sendMessage({ type: "SEND_CONTENT", content: contentHTML });
  } else {
    console.warn("未找到 ID 为 content 的元素");
  }
};