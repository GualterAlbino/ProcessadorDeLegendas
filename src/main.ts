// Demos
import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

// Styles
//import './style.css'

// MDI icons
import '@mdi/font/css/materialdesignicons.css'

// Vue
import App from './App.vue'
import { createApp } from 'vue'
const app = createApp(App)

// Vuetify
import vuetify from './plugins/vuetify'
app.use(vuetify)

// The End
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
