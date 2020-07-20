<template>
  <div @click="copy" class="cursor-pointer">
    <slot name="action-button">
      <q-btn  size="8px"
              flat
              round
              icon="far fa-copy"
              :color="$attrs.color"
      />
    </slot>
    <span v-if="text" :class="['q-px-sm', 'text-' + $attrs.color]">
        {{$t(text)}}
    </span>
    <q-tooltip no-parent-event
               anchor="top middle"
               self="bottom middle"
               v-model="showing"
               class="q-px-md"
    >
      {{$t('global.copied')}}
    </q-tooltip>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'BaseCopyButton',
  props: {
    content: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showing: false
    }
  },
  methods: {
    copy () {
      this.showing = true
      copyToClipboard(this.content.toString().replace(/,/g, ' '))
        .then(() => {
          setTimeout(() => {
            this.showing = false
          }, 1000)
          this.$emit('actionDone')
        })
    }
  }
}
</script>
