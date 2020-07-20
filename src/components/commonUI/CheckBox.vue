<template>
  <div>
    <input class="checkbox" :id="id" type="checkbox" required="" :checked="val" @change="changeFunc">
    <label :for="id">{{text}}</label>
  </div>
</template>

<script>
export default {
  name: 'CheckBox',
  props: {
    changeFunc: {
      type: Function,
      required: true
    },
    val: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      required: false,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default: 'checkbox'
    }
  }
}
</script>
<style scoped >
  .checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
    margin: 10px 0 0 20px;
  }
  .checkbox + label {
    top: 4px;
    position: relative;
    padding: 0 0 0 36px;
    cursor: pointer;
  }
  .checkbox:checked + label:before {
    border: 1px solid #4a4a4a;
    background-color: #41464a;
  }
  .checkbox + label:before {
    border: 1px solid #4a4a4a;
    content: '';
    position: absolute;
    top: -4px;
    left: 0;
    width: 32px;
    height: 14px;
    border-radius: 8px;
    background: #fff;
    transition: .2s;
  }
  .checkbox + label:after {
    content: '';
    position: absolute;
    top: -1px;
    left: 3px;
    width: 9px;
    height: 9px;
    border-radius: 5px;
    transition: .2s;
    background:#4a4a4a;
  }
  .checkbox:checked + label:after {
    left: 22px;
    background: #FFF;
  }

  .checkbox + label:before {
    content: '';
    position: absolute;
    top: -4px;
    left: 0;
    width: 32px;
    height: 14px;
    border-radius: 8px;
    background: #fff;
    transition: .2s;
  }
</style>
