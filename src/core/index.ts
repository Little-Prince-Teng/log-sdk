import LogSdk from './index'

function install (Vue: any, options = {}) {
    if (install.installed) return
    install.installed = true
    const isDef = (v) => v !== undefined
    Vue.mixin({
        beforeCreate() {
            //赋值this，初始化log实例
            if (isDef(this.$options.log)) {
                this._logRoot = this
                this._eventlog = this.$options.log
                this._eventlog.init(this, ...options)
            } else {
                this._logRoot = (this.$parent && this.$parent._logRoot) || this
            }
        }
    })
}

LogSdk.install = install

export default LogSdk