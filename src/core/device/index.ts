const UA = require('ua-device');

export default class Device {
    static getDeviceInfo (): IDeviceInfo | null {
        if (window.navigator && window.navigator.userAgent) {
          const device: IUAResponse = new UA(window.navigator.userAgent)
    
          const device_os_name =  device?.os?.name
          // 操作系统版本
          const device_os_version = device?.os.version?.original
          // 浏览器名称
          const device_browser_name = device?.browser?.name
          // 浏览器版本
          const device_browser_version = device?.browser?.version?.original
          // 浏览器核心
          const device_engine_name = device?.engine?.name
    
          const device_engine_version = device?.engine?.version?.original
    
    
          return {
            device_browser_name,
            device_browser_version,
            device_engine_name,
            device_engine_version,
            device_os_name,
            device_os_version
          }
        }
        return null
    }
}