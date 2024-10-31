import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {  useEffect, useState } from "react";
import { useImmer } from "use-immer";
import TurndownService from 'turndown';
import { gfm, tables, strikethrough } from "turndown-plugin-gfm";


export const aiChatHook = () => {
  const [error, setError] = useImmer<boolean>(false)
  const [loading, setLoading] = useImmer<boolean>(false)
  const [messages, setMessages] = useImmer<ChatCompletionMessageParam[]>([]);
  const [content, setContent] = useState<string>('')

  function html2md(htmlString: any) {
    const turndownService = new TurndownService({ codeBlockStyle: 'fenced' })
    // Use the gfm plugin
    turndownService.use([gfm, tables, strikethrough])
    // 自定义配置

    const markdown = turndownService.turndown(htmlString)
    return markdown
  }

  const sendMessage = async (msg: string) => {
    setLoading(true)
    setError(false)
    try {
      setMessages(prev => [...prev, { role: 'user', content: msg }])
      const markdownStr = html2md(content)
      console.log('markdownStr',markdownStr)
      const response = await fetch('http://localhost:3000/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: [{ role: 'user', content: `我有这么一个文章(markdown形式的): ${markdownStr},${msg}` }] })
      })
      const data = await response?.json()
      const newMsg = {
        content: data?.response?.content,
        role: 'system'
      }
      setMessages(prev => [...prev, newMsg])
      setError(false)
    } catch (e) {
      console.log(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 向背景脚本请求页面内容\
    // @ts-ignore
    chrome.runtime.sendMessage({ type: "GET_CONTENT" }, (response) => {
      if (response && response.content) {
        setContent(response.content); // 设置获取的内容
      } else {
        setContent("");
      }
    });
  }, []);


  return {
    messages,
    error,
    loading,
    sendMessage,
    content
  }

}