const $ = dom => document.querySelector(dom)

// 点击上传
const inputEl = $('#input')
const ulEl = $('.file-list')
const btn = $('#btn')
const drop = $('.drop')

inputEl.addEventListener('change', e => {
  console.log(e.target.files)

  const fileList = Array.from(e.target.files).map(file => ({
    file,
    path: file.webkitRelativePath,
  }))

  renderFileTree(fileList)
})

btn.addEventListener('click', async () => {
  const directoryHandle = await window.showDirectoryPicker()
  const entriesList = []

  async function readEntries(dir, rootDirName) {
    for await (const entry of dir.values()) {
      if (entry.kind === 'directory') {
        await readEntries(entry, `${rootDirName}/${entry.name}`)
      } else if (entry.kind === 'file') {
        const file = await entry.getFile()
        const path = `${rootDirName}/${entry.name}`

        entriesList.push({ file, path })
      }
    }
  }

  await readEntries(directoryHandle, `/${directoryHandle.name}`)

  console.log('entriesList', entriesList)

  renderFileTree(entriesList)
})

// 拖放进入时触发
drop.addEventListener('dragover', e => {
  e.preventDefault()
})
// 拖放松手时触发
drop.addEventListener('drop', e => {
  e.preventDefault()
  // console.log(e.dataTransfer.items)

  const entriesList = [] // 上传的所有文件列表
  const emptyDirList = [] // 空文件夹列表

  Promise.allSettled(
    Array.from(e.dataTransfer.items).map(dir =>
      readEntries(dir.webkitGetAsEntry())
    )
  ).then(() => {
    console.log('所有上传的文件夹', entriesList)
    console.log('空文件夹列表', emptyDirList)
    renderFileTree(entriesList)
  })

  // 递归读取文件信息
  async function readEntries(entry) {
    // 文件夹
    if (entry.isDirectory) {
      const directoryReader = entry.createReader()

      let entries = await new Promise(resolve => {
        let results = []
        directoryReader.readEntries(list => {
          results = [...results, ...list]
          if (list.length > 0) {
            resolve(results)
          } else {
            emptyDirList.push(entry.fullPath)
            resolve(results)
          }
        })
      })

      for (const entry of entries) {
        await readEntries(entry)
      }
    }
    // 文件
    else {
      const file = await getFileObject(entry)

      entriesList.push({ file, path: entry.fullPath })
    }
  }

  // 从FileSystemFileEntry获取File对象
  async function getFileObject(fileEntry) {
    return new Promise(resolve => {
      fileEntry.file(resolve)
    })
  }
})
// 点击上传
drop.addEventListener('click', () => {
  inputEl.click()
})

function renderFileTree(fileList) {
  const doms = document.createDocumentFragment()

  for (const file of fileList) {
    const item = document.createElement('li')
    item.textContent = `${file.path}  ${file.file.size} bytes`
    doms.append(item)
  }

  ulEl.append(doms)
}
