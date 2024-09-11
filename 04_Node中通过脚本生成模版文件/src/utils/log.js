class Log {
  // 打印普通信息
  static info() {}

  /**
   * 打印成功信息
   * @param {String} mes 成功信息
   */
  static success(mes) {
    console.log(`[${new Date().toISOString()}] ✅ ${mes}`)
  }

  /**
   * 打印失败信息
   * @param {String} mes 失败原因
   * @param {Boolean} isExit 是否失败的时候退出进程
   */
  static error(mes, isExit = true) {
    console.log(`[${new Date().toISOString()}] ❌ ${mes}`)

    isExit && process.exit(1)
  }
}

export default Log
