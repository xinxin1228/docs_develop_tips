import './style.css'

const $ = selector => document.querySelector(selector)

const uploadEl = $('.upload')
const inputEl = $('#input')
const urlEl = $('#url')
const btnEl = $('#btn')

uploadEl.addEventListener('click', () => {
  inputEl.click()
})
uploadEl.addEventListener('dragover', e => {
  e.preventDefault()
  uploadEl.classList.add('focus')
})
uploadEl.addEventListener('drop', e => {
  e.preventDefault()
  uploadEl.classList.remove('focus')

  // Array.from(e.dataTransfer.files).forEach(async file => {
  //   const { width, height } = await getImageWidthHeightByFile(file)
  //   console.log(file.name, `${width}X${height}`)
  // })

  Promise.allSettled(
    Array.from(e.dataTransfer.files).map(async file => {
      // const info = await getImageWidthHeightByFile(file)
      const info = await getImageWidthHeight(file)

      return {
        name: file.name,
        ...info,
      }
    })
  ).then(res => {
    console.log(res.map(n => n.value))
  })
})
uploadEl.addEventListener('dragleave', e => {
  uploadEl.classList.remove('focus')
})

inputEl.addEventListener('change', e => {
  Array.from(e.target.files).forEach(async file => {
    // const { width, height } = await getImageWidthHeightByFile(file)
    const { width, height } = await getImageWidthHeight(file)
    console.log(file.name, `${width}X${height}`)
  })
})

btnEl.addEventListener('click', async () => {
  // const info = await getImageWidthHeightByUrl(urlEl.value)
  const info = await getImageWidthHeight(urlEl.value)
  console.log('click', info)
})

/**
 * 根据本地读取的file对象，获取宽高
 * @param {File} file 本地读取的file对象
 * @returns { width, height, errTip? }
 */
function getImageWidthHeightByFile(file) {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.src = url
    img.addEventListener('error', () => {
      resolve({ errTip: '该文件不是图片类型！' })
      URL.revokeObjectURL(url)
    })

    img.addEventListener('load', e => {
      // resolve({ width: e.target.width, height: e.target.height })
      resolve({ width: img.width, height: img.height })
      console.log('xxx')
    })
  })
}
/**
 * 根据url获取宽高
 * @param {string} url 图像url地址
 * @returns { width, height, errTip? }
 */
function getImageWidthHeightByUrl(url) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = url
    img.addEventListener('load', e => {
      resolve({ width: e.target.width, height: e.target.height })
    })
    img.addEventListener('error', () => {
      resolve({ errTip: '该文件不是图片类型！' })
    })
  })
}

/**
 * 获取图像的宽高
 * @param {string|File} param url地址或File对象
 * @returns { width, height, errTip? }
 */
function getImageWidthHeight(param) {
  let url = param

  if (param instanceof File) {
    url = URL.createObjectURL(param)
  }

  return new Promise(resolve => {
    const img = new Image()
    img.src = url
    img.addEventListener('load', e => {
      resolve({ width: e.target.width, height: e.target.height })
      URL.revokeObjectURL(url)
    })
    img.addEventListener('error', () => {
      resolve({ errTip: '该文件不是图片类型！' })
    })
  })
}
