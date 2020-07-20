<template>
  <div class="market-status">
    <h3 class="right-panel-title">{{$t('personal_information.market_status')}}
      <span
        class="ask ask_tooltip"
        v-tooltip.bottom="{
          content: $t('static_navigation.charger_tooltip')
        }"
      >
        !
      </span>
    </h3>
    <div class="markets">
      <div class="market"
           v-for="item in buttons"
           :key="item.name"
      >
        <div class="market-name">
          <span :class="['markets-status-indicator', item.color]"></span>
          {{item.name}}
          <div class="h-tooltip vue-tooltips tooltip-white vue-tooltip-hidden">
            <div class="tooltip tooltip-content">{{$t('static_navigation.USDT')}}</div>
          </div>
        </div>
        <span>{{$t(`personal_information.status_map_${item.color}`)}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Charger',
  data () {
    return {
      markets: ['okcoin', 'coinbase', 'bitfinex', 'bitstamp'],
      intervalId: 0,
      buttons: {
        bitstamp: {
          name: 'Bitstamp',
          value: 'bitstamp',
          color: 'green'
        },
        bitfinex: {
          name: 'Bitfinex',
          value: 'bitfinex',
          color: 'green'
        },
        coinbase: {
          name: 'Coinbase',
          value: 'coinbase',
          color: 'green'
        },
        okcoin: {
          name: 'OKCoin',
          value: 'okcoin',
          color: 'green'
        },
        gemini: {
          name: 'Gemini',
          value: 'gemini',
          color: 'green'
        },
        cex: {
          name: 'CEX',
          value: 'cex',
          color: 'green'
        },
        kraken: {
          name: 'Kraken',
          value: 'kraken',
          color: 'green'
        },
        binance: {
          name: 'Binance**',
          value: 'binance',
          color: 'green'
        }
      }
    }
  },
  methods: {
    handleChangeStatus (res) {
      try {
        let eventChannel = JSON.parse(event.data).result.channel
        let market = eventChannel.slice(eventChannel.lastIndexOf('_') + 1)
        if (res.data.status === 0) {
          this.buttons[market].color = 'green'
        }
        if (res.data.status === 1) {
          this.buttons[market].color = 'yellow'
        }
        if (res.data.status === 2) {
          this.buttons[market].color = 'red'
        }
      }
      catch (e) {}
    },
    connectStatusCentrifuge () {
      let connection = this.$store.getters['getCentrifugeConnection']
      connection.subscribe('exchangers_status_bitfinex', this.handleChangeStatus)
      connection.subscribe('exchangers_status_bitstamp', this.handleChangeStatus)
      connection.subscribe('exchangers_status_coinbase', this.handleChangeStatus)
      connection.subscribe('exchangers_status_okcoin', this.handleChangeStatus)
      connection.subscribe('exchangers_status_gemini', this.handleChangeStatus)
      connection.subscribe('exchangers_status_cex', this.handleChangeStatus)
      connection.subscribe('exchangers_status_kraken', this.handleChangeStatus)
      connection.subscribe('exchangers_status_binance', this.handleChangeStatus)
    }
  },
  created () {
    this.connectStatusCentrifuge()
  }
}
</script>
<style scoped lang="scss">
  .market-status{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .tooltip{
    display: none;
  }
  span.ask_tooltip{

  }
  .markets{
    display: flex;
    flex-direction: column;
    .market{
      display: flex;
      justify-content: space-between;
      align-content: center;
      margin: 12px 0;
      color: #41464a;
      font-family: "Avenir Next Cyr Medium", sans-serif;
      font-size: 15px;
      &:last-child {
        &:hover{
          .tooltip{
            display: flex;
            position: absolute;
            text-align: center;
            margin-top: -10px;
            margin-left: 5px;
            padding: 2px 10px;
            background-color:#fff;
            color: #41464a;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 2px 14px rgba(0, 0, 0, 0.09);
            border-radius: 2px;
          }
        }
      }
      .market-name{
        display: flex;
        align-items: center;
      }
    }
  }

  .markets-status-indicator{
    height: 6px;
    width: 6px;
    border-radius: 100px;
    display: inline-block;
    background-color: transparent;
    margin-right: 12px;
    &.yellow {
      background-color: #ffdc7c;
    }
    &.green{
      background-color: #09b66d;
    }
    &.red{
      background-color: #dd4e41;
    }
  }
</style>
