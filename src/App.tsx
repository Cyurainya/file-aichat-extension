import chatai from './assets/chatai.jpg'
import sendLogo from './assets/send.svg'
import { nanoid } from 'nanoid'

// import TurndownService from 'turndown';
import remarkGfm from 'remark-gfm'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
// import { gfm, tables, strikethrough } from 'turndown-plugin-gfm'
import './App.css'
import { Input } from 'antd'
import { aiChatHook } from './hook/aiChatHook'

function App() {
  // const [markdownOutput, setMarkdownOutput] = useState<string>('');
  const [inputVal, setInputVal] = useState<string>('')

  const { messages, sendMessage, content } = aiChatHook()

  const sendMsg = async () => {
    console.log('send')
    sendMessage(inputVal.toString())
    // sendMessage && sendMessage(inputVal.toString());
    setInputVal('')
    // const htmlInput = document.getElementById('content')
    // const markdown = html2md(htmlInput);
    // console.log(markdown)
    // setMarkdownOutput(markdown);
  }

  const handleKeyDown = (event: any) => {
    console.log('event.key', event.key)
    console.log('event.shiftKey', event.shiftKey)

    if (event.key === 'Enter') {
      event.preventDefault()

      if (event.shiftKey) {
        console.log('黄行')
        setInputVal((pre) => pre + '\n')
      } else {
        console.log('发送')
        sendMsg()
      }
    }
  }

  useEffect(() => {
    console.log(process.env.VITE_API_HOST)
  }, [])

  return (
    <div id='chromeBox'>
      <div className='contentBox'>
        {
          // @ts-ignore
          messages?.length > 0 ? (
            <div className='overflow-y-scroll h-80 my-2'>
              {
                // @ts-ignore
                messages?.map((item: { role: string | undefined; content: string }) => (
                  <div
                    className={
                      item?.role === 'user'
                        ? 'p-2'
                        : 'p-2 bg-white overflow-x-scroll w-80 rounded-sm'
                    }
                    key={nanoid()}>
                    {item?.role === 'user' ? (
                      <span>{item?.content?.toString()}</span>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{item?.content}</ReactMarkdown>
                    )}
                  </div>
                ))
              }
            </div>
          ) : (
            <div className='emptyBox'>
              <img src={chatai} className='aiLogo' />借 AI 之力，解析文章, 探索知识新境界!
              {content?.length ? 'got it' : 'no'}
            </div>
          )
        }
      </div>

      <div>
        {/* {loading ? <div className='loadingBox'><Spin size='small'></Spin>正在回答中...</div> : <></>} */}

        <div className='inputBox'>
          <Input.TextArea
            allowClear
            value={inputVal}
            onKeyDown={handleKeyDown}
            onChange={(event: any) => {
              setInputVal(event.target.value)
            }}
          />
          <div className='button' onClick={() => sendMsg()}>
            <img src={sendLogo} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
