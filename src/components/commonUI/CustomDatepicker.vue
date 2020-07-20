<template>
  <div class="datepicker">
    <button
      @click="handleOpened"
      :class="['datepicker-button', {'datepicker-button__opened': isOpened}]">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="15" viewBox="0 0 15 15"><defs><path id="2ngea" d="M457 264.58v-11.32h12.83v11.32z"/><path id="2ngeb" d="M460.015 253.375V251"/><path id="2ngec" d="M466.405 253.375V251"/><path id="2nged" d="M459.26 257.455h8.304"/><path id="2ngee" d="M459.26 260.885h3.02"/></defs><g><g transform="translate(-456 -251)"><g><g><g><g><use fill-opacity="0" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#2ngea"/></g><g><use fill-opacity="0" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#2ngeb"/></g><g><use fill-opacity="0" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#2ngec"/></g><g><use fill-opacity="0" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#2nged"/></g><g><use fill-opacity="0" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#2ngee"/></g></g></g></g></g></g></svg>
      {{selectedReadableDate}}
    </button>
    <div
      class="datepicker-wrapper"
      v-if="isOpened"
      v-on-click-outside="close"
    >
      <v-datepicker
        v-focus
        tabindex="0"
        mode='single'
        :themeStyles="{ wrapper: { border: '0'}}"
        :value="selectedDate"
        @dayclick="onValueChange"
        :select-attribute="myAttribute"
        :disabled-attribute="myDisabledAttribute"
        :is-inline="true"
        :formats='formats'
        titlePosition="left"
        :datePickerShowDayPopover="false"
        :max-date="max"
        :min-date="min"
        :show-popover="false"
        popover-visibility="hidden"
      >
          <span slot='header-title' slot-scope='{ monthLabel, yearLabel }'>
          {{ monthLabel }} <span class="datepicker-year">{{ yearLabel }}</span>
  </span>
      </v-datepicker>
    </div>
  </div>
</template>
<script>

import moment from 'moment'
import { setupCalendar } from 'v-calendar'
export default {
  name: 'CustomDatepicker',
  data () {
    return {
      isOpened: false,
      myAttribute: {
        highlight: {
          backgroundColor: '#41464a',
          color: '#fff',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      myDisabledAttribute: {
        contentStyle: {
          color: '#41464a',
          backgroundColor: 'transparent',
          opacity: '0.6',
          cursor: 'not-allowed'
        }
      },
      formats: {
        weekdays: 'WW'
      }
    }
  },
  props: {
    selectedDate: {
      type: Date,
      required: true
    },
    min: {
      type: Date,
      required: true
    },
    max: {
      type: Date,
      required: true
    }
  },
  methods: {
    handleOpened () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    },
    onValueChange (e) {
      if (e.attributesMap.disabled) {
        return
      }
      this.$emit('onSelectedChange', e.date)
    },
    setCalendarSettings () {
      setupCalendar({
        firstDayOfWeek: 1,
        locale: this.lang
      })
    }
  },
  directives: {
    focus: {
      bind: function (el) {
        el.focus()
      }
    }
  },
  computed: {
    selectedReadableDate () {
      return moment(this.selectedDate).locale(this.$store.state.language).format('DD MMM YYYY')
    },
    lang () {
      return this.$store.state.language
    }
  },
  created () {
    this.setCalendarSettings()
  },
  watch: {
    selectedDate (newDate, prevDate) {
      if (!newDate) {
        this.selectedDate = prevDate
      }
      this.close()
    },
    lang () {
      this.setCalendarSettings()
    }
  }
}
</script>
