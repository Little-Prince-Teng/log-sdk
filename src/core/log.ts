// // import getLastEvent from '../utils/getLastEvent'

// class LogSdk {
//     constructor(cfg = {}) {
//         this.app = null
//         this.cfg = cfg
//     }

//     init(app, options) {
//         if (this.app) return
//         this.app = app
//         console.log(options)
//         this.monitorJsError()
//         this.addEventListener()
//     }

//     monitorJsError () {
//         window.addEventListener('error', event => {
//             console.log('上报错误', event)
//             // let lastEvent = getLastEvent() // 获取到最后一个交互事件
//             if (event.target && (event.target.src || event.target.href)) { // 资源加载错误
//                 console.log('资源加载错误')
//             } else { // js执行错误

//             }
//         })

//         window.onerror = function(msg, url, line, column, error) {
//             const res = { msg, url, line, column, error }
//             console.log('res', res)
//             return false;
//         }
//     }

//     addEventListener () {
//         window.addEventListener('click', e => {
//           console.log('用户点击行为', e)
//           return true
//         }, true)
//     }
// }

// export default LogSdk