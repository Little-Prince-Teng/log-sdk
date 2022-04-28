import { createApp, h } from 'vue'
import App from './App.vue'

import LogSdk from './core/index'

// 主机
const host = "cn-zhangjiakou.log.aliyuncs.com";
// 项目名
const project = "log-monitor-demo";
// 存储名
const logstore = "logmonitordemo-store";

const log = new LogSdk({
    uploadHost: `http://${project}.${host}/logstores/${logstore}/track`,
    errorWhiteList: [],
    apiKey: 'teng.lu'
})

const app = createApp({
    log,
    render: () => h(App)
})

app.use(LogSdk)

app.mount('#app')
