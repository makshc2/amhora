<template>
  <div class="small-select">
    <button
      :class="['small-select-togler', {'small-select-togler_opened': isOpen}]"
      @click="toggleSelect"
    >
      {{$t(value)}}
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="6" height="5"><defs><path id="a" d="M1858 590l2.342 2.273 2.341-2.273"/></defs><use fill-opacity="0" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#a" opacity=".4" transform="translate(-1857 -589)"/></svg></button>
    <ul
      class="small-select-list"
      v-on-click-outside="closeSelect"
      v-if="isOpen"
    >
      <li
        class="small-select-list__item"
        v-for="(item, key, i) in items"
        :key="i"
      >
        <button
          @click="select(item)"
          class="small-select-list__btn"
        >
          {{$t(item)}}
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'SmallSelect',
  data () {
    return {
      isOpen: false
    }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    toggleSelect () {
      this.isOpen = !this.isOpen
    },
    closeSelect () {
      this.isOpen = false
    },
    select (val) {
      this.$emit('onSelect', val)
      this.closeSelect()
    }
  }
}
</script>

<style lang="scss">
  .small-select{
    position: relative;
    height: 24px;
  }
  .small-select-togler{
    display: flex;
    align-items: center;
    padding: 0 6px;
    min-width: 58px;
    height: 24px;
    border-radius: 2px;
    background-color: #e6e6e6;
    font-family: "Avenir Next Cyr Demi", sans-serif;
    color: #41464a;
    font-size: 13px;
    line-height: 16px;
    font-weight: 800;
    justify-content: space-between;
    stroke: #41464a;
    border: none;
    cursor: pointer;
    text-transform: capitalize;
    svg{
      margin-left: 10px;
    }

    &.small-select-togler_opened,
    &:hover{
      background-color: #41464a;
      color: #fff;
      stroke: #fff;
    }
  }

  .small-select-list{
    list-style: none;
    display: flex;
    flex-direction: column;
    min-width: 86px;
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.09);
    border-radius: 2px;
    background-color: #fdfdfd;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 3;
  }

  .small-select-list__item{
    width: 100%;
    height: 30px;
    &:hover{
      background-color: #d8d8d830;
    }

    .small-select-list__btn{
      width: 100%;
      height: 100%;
      border: none;
      cursor: pointer;
      background-color: transparent;
      color: #41464a;
      font-size: 13px;
      font-family: "Avenir Next Cyr Demi", sans-serif;
      font-weight: 800;
      padding: 7px;
      display: flex;
      align-items: center;
      text-transform: capitalize;
    }
  }
</style>
