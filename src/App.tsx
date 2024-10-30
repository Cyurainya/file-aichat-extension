import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TurndownService from 'turndown';
import remarkGfm from 'remark-gfm';
import './App.css'
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { gfm, tables, strikethrough } from 'turndown-plugin-gfm'

function App() {
  const [markdownOutput, setMarkdownOutput] = useState<string>('');

  function html2md(htmlString: any){
    const turndownService = new TurndownService({ codeBlockStyle: 'fenced' })
    // Use the gfm plugin
    turndownService.use(gfm)

    // Use the table and strikethrough plugins only
    turndownService.use([tables, strikethrough])
    // 自定义配置

    const markdown = turndownService.turndown(htmlString)
    return markdown
  }

  const handleClick = async () => {
    const htmlInput = document.getElementById('content')
    const markdown = html2md(htmlInput);
    console.log(markdown)
    setMarkdownOutput(markdown);
  }

  return (
    <div id='content'>
      <div id='content'>
        <table>

          <thead>
            <tr>
              <th >Person</th>
              <th >Most interest in</th>
              <th >Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th >Chris</th>
              <td>HTML tables</td>
              <td>22</td>
            </tr>
            <tr>
              <th >Dennis</th>
              <td>Web accessibility</td>
              <td>45</td>
            </tr>
            <tr>
              <th >Sarah</th>
              <td>JavaScript frameworks</td>
              <td>29</td>
            </tr>
            <tr>
              <th >Karen</th>
              <td>Web performance</td>
              <td>36</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Average age</th>
              <td>33</td>
            </tr>
          </tfoot>
        </table>

        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleClick}>
          生成pdf
        </button>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownOutput}</ReactMarkdown>



    </div >
  )
}

export default App
