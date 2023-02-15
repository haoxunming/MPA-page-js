const path = require('path')
const fs = require('fs')

const r = (p) => path.resolve(__dirname, p)

const baseChunk = ['chunk-vendors', 'chunk-common']

function getEntry(pageConfig) {
  const pages = {}
  const pagesDir = fs.readdirSync(r('../src/pages'))

  const { chunkConfig, templateMap } = pageConfig

  pagesDir.forEach((page) => {
    const entry = `src/pages/${page}/index.js`

    const chunks = pageAddChunks(baseChunk, chunkConfig, page)
    // 将页面chunk添加进去
    chunks.push(page)

    if (fs.existsSync(r(`../${entry}`))) {
      pages[page] = {
        entry,
        template: 'public/index.html',
        chunks,
      }
      if (templateMap[page]) {
        pages[page] = { ...pages[page], ...templateMap[page] }
      }
    }
  })

  return pages
}

function pageAddChunks(baseChunk, chunkConfig, page) {
  const chunks = [...baseChunk]
  // 将分离出来的chunk添加到相应的页面
  Object.keys(chunkConfig).forEach((chunk) => {
    if (chunkConfig[chunk].includes(page)) {
      chunks.push(chunk)
    }
  })

  return chunks
}

module.exports = {
  getEntry,
}
