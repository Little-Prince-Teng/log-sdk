import Upload from '../upload/index.ts'
import UserBehavior from '../user-behavitor/index.ts'
import Device from '../device/index.ts'
import { getUploadData, getLines } from '../utils/index.ts'
import { getLastEvent } from '../utils/getLastEvent.ts'
import { getSelector } from '../utils/getSelector.ts'

export default class ErrorHandle {
    upload: Upload
    userBehavior: UserBehavior
    deviceInfo: any
  
    constructor(upload: Upload) {
      this.upload = upload
      this.userBehavior = new UserBehavior()
      this.deviceInfo = Device.getDeviceInfo()
      this.instrumentError()
      // this.instrumentUnhandledRejection()
      // this.instrumentHttpXHR()
    }
  
    public formatData (res: any, type = 'error') {
      const data = Object.assign({}, res, {
        device: this.deviceInfo,
        userBehavior: this.userBehavior.pagePath,
        type,
      })
      this.upload.add(data)
    }

    // 处理js错误
    public instrumentError() {
        const that = this
        window.addEventListener('error', event => {
            let uploadData
            const lastEvent = getLastEvent()
            if (event.target && (event.target.src || event.target.href)) { // 资源加载错误
                uploadData = getUploadData('stability', 'error', {
                    errorType: "resourceError", // 错误类型: 资源加载错误
                    filename: event.target.src || event.target.href, // 报错文件（哪个文件报错了）
                    tagName: event.target.tagName, // 元素标签名
                    selector: getSelector(event.target), // 代表最后一个操作的元素
                })
            } else { // js执行错误
                uploadData = getUploadData('stability', 'error', {
                    errorType: "jsError", // js执行错误
                    message: event.message, // 报错信息
                    filename: event.filename,
                    position: `${event.lineno}:${event.colno}`, // 报错的行列位置
                    stack: getLines(event.error.stack), // 错误堆栈
                    selector: lastEvent ? getSelector(lastEvent.path) : "", // 代表最后一个操作的元素
                })
            }
            that.formatData(uploadData)
        }, true)
        // window.onerror = function(msg: any, url: any, line: any, column: any, error: any): boolean {
        //     const res = { msg, url, line, column, error }
    
        //     if (_oldOnErrorHandler) {
        //     return _oldOnErrorHandler.call(null, msg, url, line, column, error)
        //     }
        //     that.formatData(res)
        //     return false
        // }
    }
  
    // public instrumentUnhandledRejection(): void {
    //   const _oldOnUnhandledRejectionHandler = window.onunhandledrejection;
    //   const that = this
    //   window.onunhandledrejection = function(e: any): boolean {
    //     const res = globalOnUnhandledRejectionHandler(e)
  
    //     if (_oldOnUnhandledRejectionHandler) {
    //       return _oldOnUnhandledRejectionHandler.apply(this, e);
    //     }
    //     that.formatData(res)
    //     return true;
    //   };
    // }
  
    // public instrumentHttpXHR () {
    //   const oldXHR = window.XMLHttpRequest
    //   const that = this
    //   window.XMLHttpRequest = globalOnHttpXHRHandler(oldXHR, (res) => {
    //     if (res.url.includes(this.upload.uploadHost)) return
    //     this.formatData(res, 'api')
    //   })
    // }
  
    // public vueHandler(err: any, vm: any) {
    //   const event = globalVueErrorHandler(err, vm)
    //   this.formatData(event)
    // }
    // // 上报一个自定义事件
    // public customizeErrorHandler (error: Error) {
    //   const event = eventFromStacktrace(computeStackTrace(error));
    //   this.formatData(event)
    // }
}