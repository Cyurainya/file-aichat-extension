import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { SetStateAction, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import { html2md, isChromeExtension } from '../utils'

export const aiChatHook = () => {
  const [error, setError] = useImmer<boolean>(false)
  const [loading, setLoading] = useImmer<boolean>(false)
  const [messages, setMessages] = useImmer<ChatCompletionMessageParam[]>([])
  const [content, setContent] = useState<string>('')

  const sendMessage = async (msg: string) => {
    setLoading(true)
    setError(false)
    try {
      setMessages((prev) => [...prev, { role: 'user', content: msg }])
      const markdownStr = html2md(content)
      const host = process.env.VITE_API_HOST

      const response = await fetch(`${host}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: [
            {
              role: 'user',
              content: `我有这么一个文章(markdown形式的): ${markdownStr}。\n 我想问：${msg}`
            }
          ]
        })
      })
      // const data = await response?.json();
      const reader = response?.body?.getReader()
      let msgContent = ''
      setMessages((prev) => [...prev, { content: msgContent, role: 'system' }])
      const textDecoder = new TextDecoder() // 创建解码器
      while (true && reader) {
        // 循环读取内容
        /* 读取其中一部分内容 done 是否读取完成， value 读取到的内容 */
        const { done, value } = await reader.read()
        if (done) {
          return
        }
        const str = textDecoder.decode(value) // 利用解码器把数据解析成字符串
        msgContent += str
        setMessages((prev) =>  [...prev.slice(0, prev?.length - 1), { content: msgContent, role: 'system' }])
        console.log(str) // 这时候str就是服务器返回的内容
      }

      setError(false)
    } catch (e) {
      setMessages((prev) => [...prev, { content: '回答出错!', role: 'system' }])
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 向背景脚本请求页面内容
    let listener: any
    if (isChromeExtension()) {
      // @ts-ignore
      chrome.runtime.sendMessage({ type: 'REQUEST_MAIN_CONTENT' }, (response) => {
        if (response && response.content) {
          setContent(response.content)
        }
      })

      // Listen for updates from the background script
      listener = (message: { type: string; content: SetStateAction<string> }) => {
        if (message.type === 'CONTENT_UPDATE') {
          setContent(message.content)
        }
        return undefined
      }
      chrome.runtime.onMessage.addListener(listener)
    }

    return () => {
      if (isChromeExtension()) {
        chrome.runtime.onMessage.removeListener(listener)
      }
    }
  }, [])

  return {
    messages,
    error,
    loading,
    sendMessage,
    content
  }
}
