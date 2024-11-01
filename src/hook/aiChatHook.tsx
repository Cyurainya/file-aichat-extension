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
      console.log('hots',host)
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
      const data = await response?.json()
      const newMsg = {
        content: data?.response?.content,
        role: 'system'
      }
      setMessages((prev) => [...prev, newMsg])
      setError(false)
    } catch (e) {
      console.log(e)
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
