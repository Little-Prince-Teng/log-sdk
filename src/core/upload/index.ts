// import cache from '../utils/index.ts'

interface IErrorMap {
    [key: string]: boolean
}

export default class Upload {

    public apiKey: string
    // 上传的node服务地址
    public uploadHost: string;

    // 额外附加的数据
    public metadata: any

    // 已经收集过的数据
    public errorMap: IErrorMap = {}

    // 需要发送的错误内容
    public queue: any[] = []

    public customizeRequest?: (data: any) => any

    timer: any = -1

    public constructor(uploadHost: string, apiKey: string, metadata?: {}) {
        this.uploadHost = uploadHost
        this.apiKey = apiKey
        this.metadata = metadata;
    }

    add(data: any) {
        // if (cache.checkCache(data)) {
        //   this.queue.push(this.formatCustomizeRequest(data))
        // }

        if (this.timer !== -1) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.send()
            this.timer = -1
        }, 2000)
    }

    send() {
        if (!this.queue.length) return
        const xhr = new XMLHttpRequest()
        // 接入日志系统，此处以阿里云为例
        let body = JSON.stringify({
            __logs__: this.queue
        })
        xhr.open("POST", this.uploadHost, true)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.setRequestHeader("x-log-apiversion", "0.6.0")
        xhr.setRequestHeader("x-log-bodyrawsize", body.length)
        xhr.onload = function () {
            // console.log(xhr.response)
        }
        xhr.onerror = function (error) {
            console.log(error)
        };
        xhr.send(body)
        this.queue = []
    }

    formatCustomizeRequest(data: any) {
        if (typeof this.customizeRequest === 'function') {
            return this.customizeRequest(data)
        }
        return data
    }
}