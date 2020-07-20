<template>
  <div class="convert-select">
    <button @click="toggleSelect" class="square-button width-button-crypto"
            :class="{openSelect:isOpened}">
      {{selected}}<svg class="arrow-ico" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="7" height="5" viewBox="0 0 7 5"><defs><path id="ni25a" d="M1669 449l2.724 2.724 2.724-2.724"/></defs><g><g transform="translate(-1668 -448)"><use fill-opacity="0" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#ni25a"/></g></g></svg>
    </button>
    <div class='options' v-if="isOpened" v-on-click-outside="closeSelect">
      <button :disabled="(needDisable && !calculateCryptoFiatPairs[activeCrypto][item])"
              v-for="item in options" :key="item" class="option"
              @click="select(item)">
        {{item}}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConverterSelect',
  props: {
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: String,
      required: true
    },
    activeCrypto: String,
    calculateCryptoFiatPairs: Object,
    needDisable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isOpened: false
    }
  },
  methods: {
    toggleSelect () {
      this.isOpened = !this.isOpened
    },
    select (item) {
      this.$emit('onSelect', item)
      this.closeSelect()
    },
    closeSelect () {
      this.isOpened = false
    }
  }
}
</script>


