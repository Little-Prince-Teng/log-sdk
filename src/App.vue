<template>
	<img alt="Vue logo" src="./assets/logo.png">
	<HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
	<button @click="jsErrorClick">js执行错误</button>
	<button @click="promiseErrorClick">promise错误</button>
	<!-- <button @click="performanceClick">监控performance</button> -->
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';

@Options({
	components: {
		HelloWorld
	}
})

export default class App extends Vue {
	jsErrorClick = () => {
		throw new Error('出错了')
	}

	promiseErrorClick () {
		const p = () => new Promise((resolve, reject) => {
			reject('failed')
		})
		p()
	}

	// performanceClick () {
	// 	setTimeout(() => {
	// 		console.log('performance')
	// 	}, 2500)
	// }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
