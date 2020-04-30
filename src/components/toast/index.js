import Vue from 'vue'
import toast from '@/components/toast/toast.vue'
import router from '@/router'
const Toast = Vue.extend(toast)
export default {
  install(Vue) {
    Vue.prototype.toast = (options = {}) => {
      const renderToast = new Toast({ router })
      renderToast.$nextTick(() => {
        renderToast.$set(renderToast, 'show', true)
      })
      Object.keys(options).forEach(i => {
        if (options[i] instanceof Function) {
          renderToast.$on(i, options[i])
        } else {
          renderToast.$set(renderToast, i, options[i])
        }
      })
      const fragment = document.createDocumentFragment()
      const toastNode = document.createElement('div')
      fragment.appendChild(toastNode)
      document.body.appendChild(fragment)
      return renderToast.$mount(toastNode)
    }
  }
}
