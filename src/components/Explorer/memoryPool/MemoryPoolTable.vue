<template>
    <div>
        <table class="table-sm" v-if="crypto === 'XMR'">
            <thead class="table-sm-header">
            <tr>
                <td>{{$t('memory_pool.time')}}</td>
                <td class="text-block-hash">{{$t('memory_pool.hash')}}</td>
                <td>{{$t('memory_pool.fees')}}</td>
                <td v-tooltip.bottom="{content: $t('memory_pool.memory_pool_tooltip')}">{{$t('memory_pool.in_out')}}
                </td>
                <td>{{$t('memory_pool.output')}}</td>
                <td>{{$t('memory_pool.size')}}</td>
            </tr>
            </thead>
            <tbody class="table-sm-body">
            <tr
                    v-for="(item, key, i) in data"
                    :key="i"
            >
                <td>{{getTime(item.timestamp)}}</td>
                <td>
                    <router-link class="block-link" :to="{path: `/${crypto.toLowerCase()}/transaction/${item.hash}`}">
                        {{item.hash}}
                    </router-link>
                </td>
                <td>{{item.fee || $t('xrp_text.na')}}</td>
                <td>{{item.vin.length}}/{{item.vout.length}}</td>
                <td>{{item.totalOutput || $t('xrp_text.na')}}</td>
                <td>{{(item.size.toFixed(2))}}</td>
            </tr>
            </tbody>
        </table>
        <table class="table-sm" v-else>
            <thead class="table-sm-header btc-padding">
            <tr>
                <td class="padding_table">{{$t('memory_pool.time')}}</td>
                <td>{{$t('memory_pool.hash')}}</td>
                <td class="output">{{$t('memory_pool.output')}} {{crypto}}</td>
                <td class="padding_table-end">{{$t('memory_pool.output')}} {{fiat}}</td>
            </tr>
            </thead>
            <tbody class="table-sm-body btc-padding">
            <template v-if="data.length">
                <tr v-for="(item, key, i) in data"
                    :key="i"
                >
                    <td class="padding_table">{{getTime(item.timestamp)}}</td>
                    <td class="transaction-title">
                        <router-link class="block-link"
                                     :to="{path: `/${crypto.toLowerCase()}/transaction/${item.hash}`}">
                            {{item.hash}}
                        </router-link>
                    </td>
                    <td v-if="item.totalOutput" class="output padding_table-end">{{(item.totalOutput).toFixed(8)}}</td>
                    <td v-else class="output padding_table-end">{{$t('xrp_text.na')}}</td>
                    <td v-if="item.totalOutput" class="padding_table-end">{{(item.totalOutput * updateFiat()).toFixed(2)
                        ||
                        $t('xrp_text.na')}}
                    </td>
                    <td v-else class="padding_table-end">{{$t('xrp_text.na')}}</td>
                </tr>
            </template>

            </tbody>
        </table>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'MemoryPoolTable',
  data () {
    return {
      parseCrypto: '',
      fiatRate: ''
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    page: {
      type: Number,
      default: 1
    },
    pages: {
      type: Number,
      default: 1
    },
    recordsCount: {
      type: Number,
      default: 0,
      required: false
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    fiat () {
      return this.$store.getters.fiat
    }
  },
  methods: {
    getTime (time) {
      return moment.unix(time).format('hh:mm:ss, A')
    },
    updateFiat () {
      if (this.$store.getters.rate[this.crypto]) {
        return (+this.$store.getters.rate[this.crypto].Value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .output {
        text-align: right;
        padding-right: 20px !important;
    }

    .table-sm-body.btc-padding, .table-sm-header.btc-padding {
        .padding_table {
            padding-left: 20px;
        }

        .padding_table-end {
            padding-right: 20px;
        }
    }
</style>
