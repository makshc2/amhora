<template>
  <div>
    <div class="content-center">
        <div class="transaction-main-info market-currency-info">
          <div class="transaction-main-info__block">
            <div class="transaction-main-info__block-item">
              <span>{{COINS_NAMES[crypto]}} {{$t('market_coin_info.price')}}</span>
            </div>
            <div class="transaction-main-info__block-item">
              <div class="block-item__price">{{fiatIcon}} {{lastPrice && lastPrice.toFixed(2)}}</div>
              <div
                :class="[
                'block-item__percent',
                 {'block-item__percent_grow': percentage > 0},
                 {'block-item__percent_foll': percentage < 0}
                 ]"
              >
                <div class="make-inline" v-show="percentage !== 0">
                  <div class="make-inline" v-show="percentage > 0">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="21" viewBox="0 0 12 21"><defs><path id="yy55a" d="M465 536l5-5 5 5"/><path id="yy55b" d="M470 532v17.263"/></defs><g><g transform="translate(-464 -529)"><g><use fill="#fff" fill-opacity="0" stroke="#09b66d" stroke-miterlimit="50" stroke-width="2" xlink:href="#yy55a"/></g><g><use fill="#fff" fill-opacity="0" stroke="#09b66d" stroke-miterlimit="50" stroke-width="2" xlink:href="#yy55b"/></g></g></g></svg>
                  </div>
                  <div class="make-inline" v-show="percentage < 0">
                    <svg xmlns="http://www.w3.org/2000/svg" transform="rotate(180)" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="21" viewBox="0 0 12 21"><defs><path id="yy55a" d="M465 536l5-5 5 5"/><path id="yy55b" d="M470 532v17.263"/></defs><g><g transform="translate(-464 -529)"><g><use fill="#fff" fill-opacity="0" stroke="#dd4e41" stroke-miterlimit="50" stroke-width="2" xlink:href="#yy55a"/></g><g><use fill="#fff" fill-opacity="0" stroke="#dd4e41" stroke-miterlimit="50" stroke-width="2" xlink:href="#yy55b"/></g></g></g></svg>
                  </div>
                  {{percentage.toFixed(2)}} %
                </div>
                <div class="make-inline" v-show="percentage === 0">NA</div>
              </div>
            </div>
          </div>
          <div class="transaction-main-info__block">
            <div class="transaction-main-info__block-item"><span>{{$t(range)}} {{$t('market_coin_info.average_price')}}</span>
              <div>{{fiatIcon}} {{averagePrice && averagePrice.toFixed(2)}}</div>
            </div>
            <div class="transaction-main-info__block-item"><span>{{$t(range)}} {{$t('market_coin_info.low_height')}}</span>
              <div>{{fiatIcon}} {{chartData.low && chartData.low.toFixed(2) || ''}} / {{fiatIcon}} {{chartData.height && chartData.height.toFixed(2) || ''}}</div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import getGlobalRateMixin from '../../mixins/getGlobalRateMixin'
import fiatSignMixin from '../../mixins/fiatSignMixin'
import { COINS_NAMES } from '../../constants/coinsMap'

export default {
  name: 'MarketCoinInfo',
  mixins: [getGlobalRateMixin, fiatSignMixin],
  data () {
    return {
      loaderClass: 'loader_address',
      loaderColor: '#b0becb',
      signLackof: 'NA',
      tableData: [],
      periodInfo: '',
      loading: false,
      low: 0,
      height: 0,
      volume: 'No data',
      COINS_NAMES
    }
  },
  props: {
    range: {
      type: String,
      default: ''
    },
    chartData: {
      type: Object,
      default: () => {}
    },
    percentage: {
      type: Number,
      default: 0
    },
    lastPrice: {
      type: Number,
      default: 0
    },
    averagePrice: Number
  },
  computed: {
    infoForMarket () {
      return this.$store.getters.infoForMarket
    },
    ratePrice () {
      return this.$store.getters.rate[this.crypto]
    },
    crypto () {
      return this.$store.getters.crypto.toUpperCase()
    },
    fiat () {
      return this.$store.getters.fiat
    }
  }
}
</script>
<style scoped lang="scss">
  .transaction-main-info.market-currency-info{
    justify-content: flex-start;
    .transaction-main-info__block{
      width: 33%;
      padding-bottom: 10px;
      &:first-child {
        border-right: 1px solid #97979740;
      }
      &:last-child {
        align-self: flex-end;
        border-right: unset;
        border-left: none;
      }
    }
  }
  .block-item__percent {
    display: inline-block;

    font-size: 26px;
    font-weight: 500;
    letter-spacing: -0.46px;

    &.block-item__percent_grow{
    color: #09b66d;
    }
    &.block-item__percent_foll{
    color: #dd4e41;
    }
    & .make-inline {
      display: inline;
    }
  }
  .block-item__price{
    color: #41464a;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.32px;
  }
</style>
