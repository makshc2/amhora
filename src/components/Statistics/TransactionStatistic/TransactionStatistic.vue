<template>
  <div>
    <template v-if="true">
      <div class="datepicker">
         <DayPagination
            v-if="statisticActiveDate"
            :selectedDate="statisticActiveDate"
            @onUpdateDate="updateDate"
            :dayAgo="new Date(Date.now() - 24 * 3600 * 1000)"
            :statistic="true"
        />
      </div>
      <div class="wrapper-counter">
        <div>
          <StatisticCoinLine
          v-for="(item,key,i) in transactionInfo"
          :currency="key"
          :key="i"
        >
        </StatisticCoinLine>
        </div>
        <template>
          <div v-if="$route.name === 'Statistics hashrate' || $route.name === 'Statistics difficulty'"
            class="line-wrapper">
            <div
              v-for="(txItem,txKey,i) in transactionHistory"
              class="line"
              :key="txItem"
              :style="{background: colorStyleHashrate[txKey] || '#0d0d0d', width: txItem ? '100%':'0'}"
            >
              <span class="info_counter">{{txItem}}</span>
            </div>
          </div>
          <div v-else
            class="line-wrapper">
            <div
              v-for="(txItem,txKey,i) in transactionHistory"
              class="line"
              :key="txItem"
              :style="{background: colorStyle[txKey] || '#0d0d0d', width: txItem ? setWidthProgressbar(+txItem):'0'}"
            >
              <span class="info_counter">{{txItem}}</span>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="loading">
        <MoonLoader color="#b0becb"/>
      </template>
      <template v-else>
        Error. Statistic not found
      </template>
    </template>
  </div>
</template>
<script>
import DayPagination from '../../commonUI/DayPagination'
import TransactionStatistic from '../../../mocks/TransactionStatistic'
import moment from 'moment'
import StatisticCoinLine from '../StatisticCoinLine'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import { GET_STATISTIC_HISTORY } from '@/services/requests'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TransactionStatistics',
  components: { MoonLoader, StatisticCoinLine, DayPagination },
  data () {
    return {
      transactionHistory: [],
      transactionInfo: [],
      colorStyleHashrate: [
        '-webkit-linear-gradient(45deg, #cf506110, #ffffff)',
        '-webkit-linear-gradient(45deg, #ed806312, #ffffff)',
        '-webkit-linear-gradient(45deg, #2573c210, #ffffff)',
        '-webkit-linear-gradient(45deg, #d5d5d570, #ffffff)',
        '-webkit-linear-gradient(45deg, #d5d5d520, #ffffff)',
        '-webkit-linear-gradient(45deg, #FF660080, #ffffff)'
      ],
      colorStyle: [
        '#cf506110',
        '#ed806312',
        '#2573c210',
        '#d5d5d570',
        '#d5d5d520',
        '#FF660080'
      ],
      date: moment(),
      activeComponent: ''
    }
  },
  methods: {
    ...mapMutations({
      SET_STATISTIC_NEW_DATE: 'SET_STATISTIC_NEW_DATE'
    }),
    async getStatisticHistory () {
      let res = (await GET_STATISTIC_HISTORY(Date.UTC(this.statisticActiveDate.getFullYear(),
        this.statisticActiveDate.getMonth(),
        this.statisticActiveDate.getDate()) / 1000))
      for (let item in res) {
        this.transactionHistory.push(JSON.parse(res[item])[this.activeComponent])
      }
    },
    updateDate (data) {
      this.transactionHistory = []
      this.SET_STATISTIC_NEW_DATE(data)
      this.getStatisticHistory()
    },
    setWidthProgressbar (data) {
      // if (this.$route.name === 'Statistics difficulty' || this.$route.name === 'Statistics hashrate') {
      //   return '0%'
      // }
      let sum = 0
      for (let i = 0; i < this.transactionHistory.length; i++) {
        if (this.transactionHistory[i]) {
          sum = +this.transactionHistory[i] + sum
        }
      }
      return (data / sum).toFixed(2) * 100 + '%'
    },
    setActiveComponent () {
      switch (this.$route.name) {
        case 'Statistics Transaction Value': this.activeComponent = 'sent'
          break
        case 'Statistics sent': this.activeComponent = 'sent'
          break
        case 'Statistics blocks': this.activeComponent = 'blocks'
          break
        case 'Statistics difficulty': this.activeComponent = 'difficulty'
          break
        case 'Statistics hashrate': this.activeComponent = 'hashrate'
          break
        case 'Statistics mining profitability': this.activeComponent = 'mined_profitability'
          break
        default: this.activeComponent = 'transactions'
          break
      }
    }
  },
  computed: {
    ...mapGetters({
      statisticActiveDate: 'statisticActiveDate'
    }),
    loading () {
      return this.$store.state.statistic.loading
    }
  },
  mounted () {
    this.setActiveComponent()
    // this.titleKey = this.$route.meta.titleKey || ''
    this.transactionInfo = TransactionStatistic
    this.getStatisticHistory()
  }
}
</script>

<style scoped>
  .wrapper-counter{
    display: flex;
    overflow: hidden;
  }
  .datepicker{
    margin-bottom: 50px;
  }
  .line-wrapper{
    width: 100%;
    height: 24px;
  }
  .line{
    height: 40px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .info_counter{
    padding-left: 10px;
  }
</style>
