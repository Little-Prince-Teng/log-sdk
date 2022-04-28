import LogSdk from './log'

function install(Vue, options) {
    if (install.installed) return
    install.installed = true

    const isDef = (v) => v !== undefined

    Vue.mixin({
        beforeCreate() {
            // 初始化logsdk实例
            if (isDef(this.$options.log)) {
                this._logRoot = this
                this._logsdk = this.$options.log
                this._logsdk.init(this, { ...options })
            } else {
                this._logRoot = (this.$parent && this.$parent._logRoot) || this
            }
        }
    })
}

LogSdk.install = install

export default LogSdk