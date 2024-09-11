import Log from './log.js'

class ParseProcessArgv {
  constructor() {
    this._argv = process.argv.slice(2)
    this.argvInfo = this._argv.reduce((prev, next) => {
      // 选项参数
      if (next.startsWith('-')) {
        prev.options ||= {}
        prev.options[next.replace(/^-+/g, '')] = true
      } else {
        prev.args ||= []
        prev.args.push(next)
      }

      return prev
    }, {})
  }
  get argv() {
    return this._argv
  }
  set argv(info) {
    Log.error('请忽修改process.argv！')
  }

  /**
   * 获取参数
   * @param {String|Number} param 获取指定索引的参数或查询参数是否存在
   */
  getParam(param) {
    if (typeof param === 'string') {
      return this.argvInfo.args?.includes(param)
    } else if (typeof param === 'number') {
      return this.argvInfo.args?.at(param)
    } else {
      Log.error('参数类型有误！')
    }
  }

  /**
   * 获取所有的参数
   */
  getParams() {
    return this.argvInfo.args
  }

  /**
   * 获取选项参数是否存在
   * @param {String|String[]} param 选项参数，数组的话有一个存在就返回true
   */
  getOptionsParam(param) {
    if (typeof param === 'string') {
      return this.argvInfo.options?.[param]
    } else if (Array.isArray(param)) {
      return param.some(n => this.argvInfo.options?.[n])
    } else {
      Log.error('参数类型有误！')
    }
  }

  /**
   * 获取所有的选项参数
   */
  getOptionsParams() {
    return this.argvInfo.options
  }
}

export const parseProcessArgv = new ParseProcessArgv()
