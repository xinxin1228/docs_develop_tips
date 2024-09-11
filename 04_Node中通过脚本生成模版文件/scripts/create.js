import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseProcessArgv } from '../src/utils/parseProcessArgv.js'
import Log from '../src/utils/log.js'
import { FILETYPE } from '../src/utils/const.js'

// console.log(parseProcessArgv.argvInfo)
const __dirname = dirname(fileURLToPath(import.meta.url))

init()

// 初始化
function init() {
  let name = parseProcessArgv.getParam(0)

  if (!name) Log.error('请输入要添加的模版名称！')
  name = name.split(/_|-/).map(startStrToUpperCase).join('')
  const lang = parseProcessArgv.getOptionsParam(['t', 'typescript'])
    ? 'ts'
    : 'js'
  const fileName = `${name}$.${lang}`

  const CONTROLLER_URL = resolve(__dirname, '../src/controller')
  const SERVICE_URL = resolve(__dirname, '../src/service')
  const DAO_URL = resolve(__dirname, '../src/dao')

  // 路径映射
  const path_list = [
    {
      type: FILETYPE.CONTROLLER, // 文件类型
      path: resolve(CONTROLLER_URL, getFileName(fileName, FILETYPE.CONTROLLER)), // 文件路径
      entry: resolve(CONTROLLER_URL, `index.${lang}`), // 入口文件
    },
    {
      type: FILETYPE.SERVICE,
      path: resolve(SERVICE_URL, getFileName(fileName, FILETYPE.SERVICE)),
      entry: resolve(SERVICE_URL, `index.${lang}`), // 入口文件
    },
    {
      type: FILETYPE.DAO,
      path: resolve(DAO_URL, getFileName(fileName, FILETYPE.DAO)),
      entry: resolve(DAO_URL, `index.${lang}`), // 入口文件
    },
  ]

  // 非强制覆盖，检查是否一个某个文件已经存在
  const existFiles = path_list.filter(({ path }) => {
    return existsSync(path)
  })
  if (!parseProcessArgv.getOptionsParam(['f', 'force'])) {
    if (existFiles.length) {
      existFiles.forEach(({ type }) => {
        Log.error(
          `文件 ${type.toLowerCase()}/${getFileName(
            fileName,
            type
          )} 已经存在！`,
          false
        )
      })
      process.exit(1)
    }
  }

  // 批量创建
  path_list.forEach(({ type, path, entry }) => {
    // 创建文件
    writeFileSync(path, generatedContent(type, { name, lang }), {
      flag: 'w',
    })
    if (existFiles.find(n => n.type === type)) {
      Log.success(
        `文件 ${type.toLowerCase()}/${getFileName(fileName, type)} 覆写成功！`
      )
    } else {
      Log.success(
        `文件 ${type.toLowerCase()}/${getFileName(fileName, type)} 创建成功！`
      )
    }

    // 处理导入导出
    writeFileSync(
      entry,
      `\nexport { default as ${name}${type} } from './${getFileName(
        fileName,
        type
      )}'`,
      { flag: 'a+' }
    )
  })

  process.exit(0)
}

/**
 * 根据模版生成文件内容字符串
 * @param {String} type 模版类型 Controller | Service | Dao
 * @param {Object} data 模版数据
 * @returns
 */
function generatedContent(type, data) {
  if (!data || typeof data !== 'object') {
    Log.error('data类型必须是对象！')
    process.exit(1)
  }
  const { lang = 'js' } = data

  const templatePath = resolve(__dirname, `./template/${type}.${lang}.tmpl`)

  const isExit = existsSync(templatePath)
  if (!isExit)
    Log.error(`模版文件 /template/${type}.${lang}.tmpl 不存在，请先创建！`)
  const content = readFileSync(templatePath, 'utf-8')

  return content.replace(
    /<<%=\s*(\w+)\s*%>>/g,
    (match, p1) => data[p1] || match
  )
}

/**
 * 首字母大写
 * @param {String} str 要替换的字符串
 * @returns
 */
function startStrToUpperCase(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

/**
 * 根据文件类型获取文件名称
 * @param {String} fileName 文件模版字符串 替换 $
 * @param {String} type 类型 controller、service、dao
 */
function getFileName(fileName, type) {
  return fileName.replace('$', type)
}
