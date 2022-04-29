import Upload from '../upload/index'
import UserBehavior from '../user-behavitor/index'
import Device from '../device/index'
import { getUploadData, getLines } from '../utils/index'
import getLastEvent from '../utils/getLastEvent'
// import getSelector from '../utils/getSelector'
import globalOnHttpXHRHandler from '../utils/globalOnHttpXHRHandler'

export default class ErrorHandle {
	upload: Upload
	userBehavior: UserBehavior
	deviceInfo: any

	constructor(upload: Upload) {
		this.upload = upload
		this.userBehavior = new UserBehavior()
		this.deviceInfo = Device.getDeviceInfo()
		this.monitorError()
		this.monitorUnhandledRejection()
		this.monitorHttpXHR()
	}

	public formatData(res: any, type = 'error') {
		const data = Object.assign({}, res, {
			device: this.deviceInfo,
			userBehavior: this.userBehavior.pagePath,
			type,
		})
		this.upload.add(data)
	}

	// 监控js错误
	public monitorError() {
		const that = this
		window.addEventListener('error', event => {
			// let uploadData
			console.log('error', event)
			const lastEvent = getLastEvent()
			const uploadData = getUploadData('stability', 'error', {
				errorType: "jsError", // js执行错误
				message: event.message, // 报错信息
				filename: event.filename,
				position: `${event.lineno}:${event.colno}`, // 报错的行列位置
				stack: getLines(event.error.stack), // 错误堆栈
				// selector: lastEvent ? getSelector(lastEvent.path) : "", // 代表最后一个操作的元素
				selector: lastEvent
			})
			// if (event.target && (event.target.src || event.target.href)) { // 资源加载错误
			//     uploadData = getUploadData('stability', 'error', {
			//         errorType: "resourceError", // 错误类型: 资源加载错误
			//         filename: event.target.src || event.target.href, // 报错文件（哪个文件报错了）
			//         tagName: event.target.tagName, // 元素标签名
			//         selector: getSelector(event.target), // 代表最后一个操作的元素
			//     })
			// } else { // js执行错误
			//     uploadData = getUploadData('stability', 'error', {
			//         errorType: "jsError", // js执行错误
			//         message: event.message, // 报错信息
			//         filename: event.filename,
			//         position: `${event.lineno}:${event.colno}`, // 报错的行列位置
			//         stack: getLines(event.error.stack), // 错误堆栈
			//         selector: lastEvent ? getSelector(lastEvent.path) : "", // 代表最后一个操作的元素
			//     })
			// }
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

	// 监控promise错误
	public monitorUnhandledRejection(): void {
		const that = this
		// window.onunhandledrejection = function (e: any): boolean {}
		window.addEventListener('unhandledrejection', event => {
			const lastEvent = getLastEvent(); // 获取到最后一个交互事件
			let message
			let filename
			let line = 0
			let column = 0
			let stack = ""
			const reason = event.reason
			if (typeof reason === "string") {
				message = reason
			} else if (typeof reason === "object") {
				message = reason.message
				if (reason.stack) {
					const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
					filename = matchResult[1]
					line = matchResult[2]
					column = matchResult[3]
				}
				stack = getLines(reason.stack)
			}
			const uploadData = getUploadData('stability', 'error', {
				errorType: "promiseError", // promise错误
				message, // 报错信息
				filename, // 哪个文件报错了
				position: `${line}:${column}`, // 报错的行列位置
				stack,
				selector: lastEvent
			})
			that.formatData(uploadData)
		}, true)
	}

	// 监控api请求错误
	public monitorHttpXHR () {
		const oldXHR = window.XMLHttpRequest
		const that = this
		// window.XMLHttpRequest = globalOnHttpXHRHandler(oldXHR, (res) => {
		// 	console.log('res', res)
		// 	if (res.url.includes(that.upload.uploadHost)) return
		// 	// that.formatData(res, 'api')
		// })
		// // const oldXHR = window.XMLHttpRequest
		// const oldOpen = XMLHttpRequest.prototype.open
		// XMLHttpRequest.prototype.open = function (method, url, async): void {
		// 	// 把上报接口过滤掉
		// 	if (!url.match(/logstores/) && !url.match(/sockjs/)) {
		// 	this.logData = { method, url, async };
		// 	}
		// 	return oldOpen.apply(this, arguments);
		// };
		// let oldSend = XMLHttpRequest.prototype.send;
		// XMLHttpRequest.prototype.send = function (body) {
		// 	if (this.logData) {
		// 	let startTime = Date.now();
		// 	let handler = (type) => (event) => {
		// 		// 持续时间
		// 		let duration = Date.now() - startTime;
		// 		let status = this.status;
		// 		let statusText = this.statusText;
		// 		tracker.send({
		// 		kind: "stability",
		// 		type: "xhr",
		// 		eventType: type,
		// 		pathname: this.logData.url,
		// 		status: status + "-" + statusText, // 状态码
		// 		duration,
		// 		response: this.response ? JSON.stringify(this.response) : "", // 响应体
		// 		params: body || "", // 入参
		// 		});
		// 	};
		// 	this.addEventListener("load", handler("load"), false);
		// 	this.addEventListener("error", handler, false);
		// 	this.addEventListener("abort", handler, false);
		// 	}
		// 	return oldSend.apply(this, arguments);
		// };
	}

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