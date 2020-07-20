<template>
  <div class="day-pagination-wrapper">
    <button
      @click="onPrevDay"
      class="day-pagination-button"
      :disabled="isPrevDisabled"
    >
      {{$t('block_explorer.prev_day')}}
    </button>
    <CustomDatepicker
      :max="dayAgo || today"
      :min="firstBitcoinBlockDate"
      :selectedDate="selectedDate"
      @onSelectedChange="selectedChange"
      class="datepicker"
    />
    <button
      @click="onNextDay"
      class="day-pagination-button"
      :disabled="isNextDisabled"
    >
      {{$t('block_explorer.next_day')}}
    </button>
  </div>
</template>
<script>
import moment from 'moment'
import CustomDatepicker from './CustomDatepicker'
export default {
  name: 'DayPagination',
  components: { CustomDatepicker },
  props: {
    selectedDate: {
      type: Date,
      default: () => new Date()
    },
    dayAgo: {
      type: Date,
      default: undefined
    },
    statistic: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      today: new Date(),
      firstBitcoinBlockDate: new Date(2009, 0, 1)
    }
  },
  methods: {
    onPrevDay () {
      this.$emit('onUpdateDate', moment(this.selectedDate).subtract(1, 'days').toDate())
    },
    onNextDay () {
      this.$emit('onUpdateDate', moment(this.selectedDate).add(1, 'days').toDate())
    },
    selectedChange (date) {
      this.$emit('onUpdateDate', date)
    }
  },
  computed: {
    isNextDisabled () {
      if (this.statistic) {
        return moment(this.selectedDate).add(2, 'days').isAfter(moment(this.today))
      } else {
        return moment(this.selectedDate).add(1, 'days').isAfter(moment(this.today))
      }
    },
    isPrevDisabled () {
      return moment(this.selectedDate).subtract(1, 'days').isBefore(moment(this.firstBitcoinBlockDate))
    }
  }
}
</script>

<style lang="scss">
  .day-pagination-wrapper{
    display: flex;
  }
  .day-pagination-button{
    border: none;
    border-radius: 2px;
    background-color: #d8d8d820;
    padding: 10px 15px;
    color: #41464a;
    font-size: 13px;
    cursor: pointer;
    &:hover{
      background-color: #41464a;
      color: #ffffff;
    }
    &.pd-button{
      margin-left: 10px;
    }
    &:last-child{
      margin-left: auto;
    }
    &:disabled{
      opacity: 0.8;
      cursor: not-allowed;
    }
  }
</style>

<style scoped>
  .datepicker{
    margin-left: 10px;
  }
</style>
