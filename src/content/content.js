// contentScript.js

function sendMainContent() {
  const mainElement = document.getElementById('main-content')

  if (mainElement) {
    let content = mainElement.innerHTML
    const startTag = '<div id="main-content" class="wiki-content">'
    if (content.startsWith(startTag)) {
      content = content.slice(startTag.length)
    }

    // 判断结尾是否有 </div> 并去除
    const endTag = '</div>'
    if (content.endsWith(endTag)) {
      content = content.slice(0, -endTag.length)
    }
    chrome.runtime.sendMessage({ type: 'UPDATE_MAIN_CONTENT', content })
  }
}

// Initial fetch of content when the script is loaded
sendMainContent()

// Set up a MutationObserver to watch for changes in the "main" element
const mainElement = document.getElementById('main-content')
if (mainElement) {
  const observer = new MutationObserver(sendMainContent)
  observer.observe(mainElement, { childList: true, subtree: true })
}
