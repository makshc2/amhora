<template>
    <div class="full-width q-mt-lg">
        <div class="q-mb-lg row justify-between">
            <span class="fs-18">{{$t('wallet.recent')}}</span>
            <div class="wrapper_select row">
                <div class="address-tx-history-header__filter row q-mr-md">
                    <span class="address-tx-history-header__filter-text q-mr-md">{{$t('address_info.sort_by')}}</span>
                    <SmallSelect
                            :items="filterVariables"
                            :value="filter"
                            @onSelect="onFilterSelect"
                    />
                </div>
                <div class="address-tx-history-header__filter row">
                    <span class="address-tx-history-header__filter-text q-mr-md">{{$t('address_info.show')}}</span>
                    <SmallSelect
                            :items="showVariables"
                            :value="show"
                            @onSelect="onShowSelect"
                    />
                </div>
            </div>
        </div>
        <q-card v-for="(recent, index) in recentData"
                :key="index"
                class="row justify-between items-center q-mb-md"
                :class="recent.operation === 'Buy' ? 'bg-green-1':'bg-deep-orange-1'"
                style="height: 80px"
                bordered
                flat>
            <div class="row justify-start items-center">
                <q-card-section>
                    <div>
                        {{recent.date}}
                    </div>
                    <div class="text-grey-6">
                        {{recent.time}}
                    </div>
                </q-card-section>
                <q-card-section>
                    <div class="row items-center" v-if="recent.operation=== 'Buy'">
                        <CollorCurrencySvgs
                                class="crypto_icon q-mx-sm"
                                :currency="recent.currency"
                        />
                        <q-icon color="green" name="fas fa-long-arrow-alt-right"/>
                    </div>
                    <div v-else class="row items-center">
                        <q-icon color="red" name="fas fa-long-arrow-alt-left"/>
                        <CollorCurrencySvgs
                                class="crypto_icon q-mx-sm"
                                :currency="recent.currency"
                        />
                    </div>
                </q-card-section>
                <q-card-section>
                    <div class="text-grey-5">
                        <span class="q-mr-md">{{recent.operation === 'Buy' ? $t('wallet.received'):$t('wallet.sended')}}</span>
                        <span>{{$options.CRYPTO_NAMES[recent.currency]}}</span>
                    </div>
                    <div class="row items-center">
                    <span class="row items-center" v-if="recent.from">
                        {{recent.from}}
                        <q-separator class="q-mx-sm"
                                     style="height: 15px; width: 2px"
                                     color="blue-grey-3" vertical inset />
                    </span>
                        <span>{{recent.address}}</span>
                    </div>
                </q-card-section>
            </div>
            <q-card-section class="column">
                <span>{{recent.operation === "Buy" ? "+" : "-" }} {{fiatIcon}}{{recent.balanceFiat}}</span>
                <span class="text-grey-5">{{recent.balanceCrypto}} {{recent.currency}}</span>
            </q-card-section>
        </q-card>
        <q-btn class="full-width text-capitalize bg-grey-3"
               :label="$t('wallet.view_more')"
               @click="viewMore"
        />
    </div>
</template>

<script>
import CollorCurrencySvgs from '../../../commonUI/CollorCurrencySvgs'
import CRYPTO_NAMES from '../../../../constants/cryptoName'
import fiatSignMixin from '../../../../mixins/fiatSignMixin'
import { mapGetters } from 'vuex'
import SmallSelect from '../../../commonUI/SmallSelect'

export default {
  CRYPTO_NAMES,
  name: 'RecentActivities',
  components: {
    SmallSelect,
    CollorCurrencySvgs
  },
  data () {
    return {
      show: `transaction_history.${this.filterConf}`,
      showVariables: ['transaction_history.all', 'transaction_history.confirmed', 'transaction_history.unconfirmed'],
      filter: `transaction_history.${this.orderConf}`,
      filterVariables: ['transaction_history.asc', 'transaction_history.desc'],
      recentData: [
        {
          date: '07 Sep 16',
          time: '09:42',
          currency: 'BTC',
          operation: 'Buy',
          from: 'Milton Wong',
          address: '3CvhMhyPRfZSN95S3roohjeKqt3LUzgUWK',
          balanceFiat: '1260.26',
          balanceCrypto: '0.5239901'
        },
        {
          date: '12 Sep 16',
          time: '09:42',
          currency: 'XMR',
          operation: 'Sell',
          from: '',
          address: '3CvhMhyPRfZSN95S3roohjeKqt3LUzgUWK',
          balanceFiat: '1260.26',
          balanceCrypto: '0.5239901'
        },
        {
          date: '12 Sep 16',
          time: '09:42',
          currency: 'DSH',
          operation: 'Sell',
          from: '',
          address: '3CvhMhyPRfZSN95S3roohjeKqt3LUzgUWK',
          balanceFiat: '1260.26',
          balanceCrypto: '0.5239901'
        },
        {
          date: '12 Sep 16',
          time: '09:42',
          currency: 'LTC',
          operation: 'Buy',
          from: '',
          address: '3CvhMhyPRfZSN95S3roohjeKqt3LUzgUWK',
          balanceFiat: '1260.26',
          balanceCrypto: '0.5239901'
        }
      ]
    }
  },
  props: {
    filterConf: {
      type: String,
      default: 'all'
    },
    orderConf: {
      type: String,
      default: 'desc'
    }
  },
  mixins: [fiatSignMixin],
  computed: {
    ...mapGetters({
      rate: 'rate',
      fiat: 'fiat',
      currencyButtons: 'currencyButtons',
      crypto: 'crypto'
    })
  },
  methods: {
    onFilterSelect (val) {
      if (val) {
        this.filter = val
        switch (val) {
          case 'transaction_history.asc':
            this.$emit('setOrder', 'asc')
            break
          default:
            this.$emit('setOrder', 'desc')
        }
      }
    },
    onShowSelect (val) {
      if (val) {
        this.show = val
        switch (val) {
          case 'transaction_history.confirmed':
            this.$emit('setFilter', 'true')
            break
          case 'transaction_history.unconfirmed':
            this.$emit('setFilter', 'false')
            break
          default:
            this.$emit('setFilter', 'all')
        }
      }
    },
    viewMore () {
      console.log('view more')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
