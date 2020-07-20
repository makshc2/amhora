<template>
  <div>
    <table class="table-sm" v-if="crypto === 'XMR'">
      <thead class="table-sm-header">
      <tr>
        <td class="padding_table">{{$t('block_explorer.height')}}</td>
        <td>{{$t('block_explorer.time')}}</td>
        <td>{{$t('block_explorer.tnx')}}</td>
        <td class="text-block-hash">{{$t('block_explorer.hash')}}</td>
        <td>{{$t('block_explorer.size')}} (kB)</td>
        <td class="padding_table-end">{{$t('block_explorer.difficulty')}}</td>
      </tr>
      </thead>
      <tbody class="table-sm-body">
      <tr
        v-for="(item, key, i) in data"
        :key="i"
      >
        <td class="padding_table">
          <router-link class="block-link" :to="{path: `/${crypto.toLowerCase()}/block/${item.height}`}">
            {{item.height}}
          </router-link>
        </td>
        <td>{{getTimeMonero(item.timestamp)}}</td>
        <td>{{item.transactionCount}}</td>
        <td>
          <div class="text-block-hash">
          {{item.blockHash}}
          </div>
        </td>
        <td>{{item.blockSize}}</td>
        <td class="padding_table-end">{{item.difficulty}}</td>
      </tr>
      </tbody>
    </table>
    <table class="table-sm" v-else-if="crypto === 'ETH'">
      <thead class="table-sm-header">
      <tr>
        <td>{{$t('block_explorer.height')}}</td>
        <td>{{$t('block_explorer.time')}}</td>
        <td>{{$t('block_explorer.tnx')}}</td>
        <td>{{$t('block_explorer.uncles')}}</td>
        <td>{{$t('block_explorer.mined_by')}}</td>
        <td>{{$t('block_explorer.gasused')}}</td>
        <td>{{$t('block_explorer.gaslimit')}}</td>
        <td>{{$t('block_explorer.avg_gas_price')}}</td>
        <td>{{$t('block_explorer.reward')}}</td>
      </tr>
      </thead>
      <tbody class="table-sm-body table-sm-body_eth" >
      <tr
        v-for="(item, key, i) in data"
        :key="i"
      >
        <td>
          <router-link class="block-link" :to="{path: `/${crypto.toLowerCase()}/block/${item.height}`}">
            {{item.height}}
          </router-link>
        </td>
        <td>{{item.timestamp | formatDate}}</td>
        <td>{{item.transactionCount}}</td>
        <td>{{item.unclesCount}}</td>
        <td>{{item.mined_by}}</td>
        <td>{{item.gasUsed}}
          <span class="percent">({{item.gasUsedPercent}}%)</span>
          <div class="wrapper_progress">
            <progress max="100" :value="item.gasUsedPercent">
            </progress>
          </div>
        </td>
        <td>{{item.gasLimit}}</td>
        <td>{{item.avgGasPrice}} Gwei</td>
        <td>{{item.reward}} Ether</td>
      </tr>
      </tbody>
    </table>
    <table class="table-sm" v-else>
      <thead class="table-sm-header btc-padding">
      <tr>
        <td class="padding_table">{{$t('block_explorer.height')}}</td>
        <td>{{$t('block_explorer.time')}}</td>
        <td>{{$t('block_explorer.transactions')}}</td>
        <td>{{$t('block_explorer.avg_fee_per_tx')}}</td>
        <td>{{$t('block_explorer.mined_by')}}</td>
        <td>{{$t('block_explorer.size')}} (kB)</td>
        <td class="padding_table-end">{{$t('block_explorer.stripped_size')}} (kB)</td>
      </tr>
      </thead>
      <tbody class="table-sm-body btc-padding">
      <tr
        v-for="(item, key, i) in data"
        :key="i"
      >
        <td class="padding_table">
          <router-link class="block-link" :to="{path: `/${crypto.toLowerCase()}/block/${item.height}`}">
            {{item.height}}
          </router-link>
        </td>
        <td>{{item.timestamp | formatDate}}</td>
        <td>{{item.transactionCount}}</td>
        <td>{{item.avgFeePerTx}}</td>
        <td>{{item.mined_by}}</td>
        <td>{{item.size}}</td>
        <td class="padding_table-end">{{item.strippedSize}}</td>
      </tr>
      </tbody>
    </table>
    <PaginationComponent
      :currentPage="page"
      :totalPages="pages"
      :selectPage="selectPage"
      :showedRecords="data.length"
      :recordsCount="recordsCount"
    />
  </div>
</template>
<script>
import PaginationComponent from '../../commonUI/Pagination'
import moment from 'moment'

export default {
  name: 'BlockExplorerTable',
  components: { PaginationComponent },
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
    }
  },
  methods: {
    selectPage (val) {
      this.$router.push({ query: { ...this.$route.query, page: val } })
    },
    getTime (time) {
      return moment.unix(time).format('HH:mm:se')
    },
    getTimeMonero (time) {
      return moment.unix(time).format('MMMM DD, YYYY, hh:mm:ss A')
    }
  }
}
</script>

<style lang="scss">
  .progress_bar {
    width: 100px;
    background: red;
  }

  .wrapper_progress {
    display: flex;
    flex-direction: column;
  }

  ::-webkit-progress-bar {
    background: #d1d1d1;
  }

  ::-webkit-progress-value {
    background: black;
  }

  ::-moz-progress-bar {
    background: black;
  }

  progress {
    display: block;
    color: black;
    margin-top: 2px;
    background: #d1d1d1;
    width: 100px;
    height: 2px;
    line-height: 21px;
    font-size: 15px;
    font-family: sans-serif;
    text-align: center;
  }

  .percent {
    font-size: 11px;
    color: grey;
  }

  .table-sm-body.table-sm-body_eth tr td {
    font-size: 13px;
  }

  .text-block-hash {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 350px;
  }
  .table-sm-body.btc-padding, .table-sm-header.btc-padding{
    .padding_table{
      padding-left: 20px;
    }
    .padding_table-end{
      padding-right: 20px;
    }
  }
</style>
