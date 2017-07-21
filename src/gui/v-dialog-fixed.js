import Bootable from '../../node_modules/vuetify/src/mixins/bootable'
//import Overlayable from '../../node_modules/vuetify/src/mixins/overlayable'
import Toggleable from '../../node_modules/vuetify/src/mixins/toggleable'

import { addOnceEventListener } from '../../node_modules/vuetify/src/mixins/../util/helpers'


// vuetify/src/mixins/overlayable
var Overlayable = {
  data () {
    return {
      overlay: null,
      isTransitioning: false
    }
  },

  props: {
    hideOverlay: Boolean,
    overflow: Boolean
  },

  beforeDestroy () {
    this.removeOverlay()
  },

  methods: {
    genOverlay () {
      if (!this.isActive || this.hideOverlay || this.overlay) return

      const overlay = document.createElement('div')
      overlay.className = 'overlay'
      overlay.onclick = () => {
        if (this.permanet) return
        else if (!this.persistent) this.isActive = false
        else if (this.isMobile) this.isActive = false
      }

      if (this.absolute) overlay.className += ' overlay--absolute'

      this.hideScroll()
      const app = this.$el.closest('[data-app]')
      app &&
        app.appendChild(overlay) ||
        console.warn('Application is missing <v-app> component')

      this.isTransitioning = true
      addOnceEventListener(overlay, 'transitionend', () => (this.isTransitioning = false))

      this.overlay = overlay

      requestAnimationFrame(() => {
        overlay.className += ' overlay--active'
      })

      return true
    },
    removeOverlay () {
      if (!this.overlay) return

      addOnceEventListener(this.overlay, 'transitionend', () => {
        this.overlay && this.overlay.remove()
        this.overlay = null
        this.showScroll()
        this.isTransitioning = false
      })

      this.overlay.className = this.overlay.className.replace('overlay--active', '')
    },
    hideScroll () {
      if (this.overflow) return
      document.documentElement.style.overflowY = 'hidden'
    },
    showScroll () {
      document.documentElement.style.overflowY = null
    }
  }
}

export default {
  name: 'dialog',

  mixins: [Bootable, Overlayable, Toggleable],

  data: () => ({
    app: null
  }),

  props: {
  	debugName: String,
    disabled: Boolean,
    persistent: Boolean,
    fullscreen: Boolean,
    lazy: Boolean,
    origin: {
      type: String,
      default: 'center center'
    },
    width: {
      type: [String, Number],
      default: 290
    },
    scrollable: Boolean,
    transition: {
      type: [String, Boolean],
      default: 'v-dialog-transition'
    }
  },

  computed: {
    classes () {
      return {
        'dialog': true,
        'dialog--active': this.isActive,
        'dialog--persistent': this.persistent,
        'dialog--fullscreen': this.fullscreen,
        'dialog--stacked-actions': this.stackedActions && !this.fullscreen,
        'dialog--scrollable': this.scrollable
      }
    },
    computedTransition () {
      return !this.transition
        ? 'transition'
        : this.transition
    }
  },

  watch: {
    isActive (val) {
      if (val) {
      	if (!this.fullscreen && !this.hideOverlay) {
					console.log(`v-dialog "${this.debugName}": genOverlay (watch)`)
      		this.genOverlay()
      	}
        this.fullscreen && this.hideScroll()
      } else {
				console.log(`v-dialog "${this.debugName}": removeOverlay (watch)`)
        this.removeOverlay()
      }
    }
  },

  mounted () {
    this.app = document.querySelector('[data-app]')
    this.$nextTick(() => {
      this.app && this.app.appendChild(this.$refs.content)
    })
    this.$vuetify.load(() => {
    	if (this.isActive) {
    		console.log(`v-dialog "${this.debugName}": genOverlay (mounted)`)
    		this.genOverlay()
    	}
    })
  },

  beforeDestroy () {
    this.app &&
      this.app.contains(this.$refs.content) &&
      this.app.removeChild(this.$refs.content)
		console.log(`v-dialog "${this.debugName}": removeOverlay (beforeDestroy)`)
    this.removeOverlay()
  },

  methods: {
    closeConditional (e) {
      // close dialog if !persistent and clicked outside
      return !this.persistent
    }
  },

  render (h) {
    const children = []
    const data = {
      'class': this.classes,
      ref: 'dialog',
      directives: [
        { name: 'click-outside', value: this.closeConditional },
        { name: 'show', value: this.isActive }
      ]
    }

    if (!this.fullscreen) {
      data.style = {
        width: isNaN(this.width) ? this.width : `${this.width}px`
      }
    }

    if (this.$slots.activator) {
      children.push(h('div', {
        'class': 'dialog__activator',
        on: {
          click: e => {
            e.stopPropagation()
            if (!this.disabled) this.isActive = !this.isActive
          }
        }
      }, [this.$slots.activator]))
    }

    const dialog = h(this.computedTransition, {
      props: { origin: this.origin }
    }, [h('div', data, [this.$slots.default])])

    children.push(h('div', {
      'class': 'dialog__content',
      ref: 'content'
    }, [dialog]))

    return h('div', {
      'class': 'dialog__container'
    }, children)
  }
}
