/**
 * getUploadData方法是获取上报数据
 * @param kind string 监控指标大类，例如稳定性stability
 * @param type 监控类型，例如error
 * @param customData 自定义数据
 * @returns 
 */
function getUploadData (kind: string, type: string, customData: object): object {
    return { kind, type, ...customData }
}

/**
 * getLines方法处理错误堆栈数据
 * @param stack 错误堆栈
 * @returns 
 */
function getLines(stack) {
    return stack
        .split("\n")
        .slice(1)
        .map((item) => item.replace(/^\s+at\s+/g, ""))
        .join("^")
}

/**
 * checkCache方法校验错误缓存
 * @param data 错误数据
 * @returns 
 */
function checkCache (data: any) {
    const type = data.type
    
    if (type === 'error') {
      const errorMessage = data?.exception?.values?.[0]?.value
      if (this.errorMap[errorMessage]) {
        return false
      } else {
        this.errorMap[errorMessage] = true
        return true
      }
    }
    if (type === 'api') {
      const url = data.url
      if (this.errorMap[url]) {
        return false
      } else {
        this.errorMap[url] = true
        return true
      }
    }
    
    return true
}

export {
    getUploadData,
    getLines,
    checkCache
}