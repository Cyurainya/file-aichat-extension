import TurndownService from 'turndown';
import { gfm, tables, strikethrough } from "turndown-plugin-gfm";
export  function html2md(htmlString: any) {
  const turndownService = new TurndownService({ codeBlockStyle: 'fenced' })
  // Use the gfm plugin
  turndownService.use([gfm, tables, strikethrough])
  // 自定义配置

  const markdown = turndownService.turndown(htmlString)
  console.log('markdown',markdown)

  return markdown
}

export function isChromeExtension() {
  return typeof chrome !== "undefined" && !!chrome.runtime && !!chrome.runtime.sendMessage;
}