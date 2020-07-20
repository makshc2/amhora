<template>
  <div class="block-explorer-page">
    <vue-headful
        :title="title"
        :description="description"
      />
    <breadcrumbs></breadcrumbs>
    <div class="block-explorer-pag__table container">
      <div class="button-container">
        <button
          class="button-refresh"
          @click="refreshMempool()"
        >
          <span class="refresh_svg-wrapper">
            <svg class='svg_refresh' enable-background="new 0 0 32 32" height="20px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="20px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g>
              <path d="M25.444,4.291c0,0-1.325,1.293-2.243,2.201C18.514,3.068,11.909,3.456,7.676,7.689   c-2.47,2.47-3.623,5.747-3.484,8.983h4C8.051,14.46,8.81,12.205,10.5,10.514c2.663-2.663,6.735-3.043,9.812-1.162   c-1.042,1.032-2.245,2.238-2.245,2.238c-0.841,1.009,0.104,1.592,0.584,1.577l5.624-0.001c0.297,0,0.539,0.001,0.539,0.001   s0.245,0,0.543,0h1.092c0.298,0,0.54-0.243,0.54-0.541V4.895C27.023,4.188,26.247,3.502,25.444,4.291z" fill="#b3b5b7"/>
              <path d="M6.555,27.709c0,0,1.326-1.293,2.243-2.201c4.688,3.424,11.292,3.036,15.526-1.197   c2.47-2.471,3.622-5.747,3.484-8.983h-4.001c0.142,2.211-0.617,4.467-2.308,6.159c-2.663,2.662-6.735,3.043-9.812,1.161   c1.042-1.032,2.245-2.238,2.245-2.238c0.841-1.01-0.104-1.592-0.584-1.577l-5.624,0.002c-0.297,0-0.54-0.002-0.54-0.002   s-0.245,0-0.543,0H5.551c-0.298,0-0.54,0.242-0.541,0.541v7.732C4.977,27.812,5.753,28.498,6.555,27.709z" fill="#b3b5b7"/>
              </g>
          </svg>
          </span>
          <span>{{$t('memory_pool.refresh')}}</span>
        </button>
        <button
          class="button-load-more"
          :disabled="checkTotalPages"
          @click="getLoadMoreTransactions"
        >
          <span class="counter-mempool">
           {{$t('memory_pool.load_more')}} ({{counterTransaction}})
          </span>
        </button>
          <moon-loader
            class="empty-data__loader empty-data__loader_mempool"
            v-if="preloaded"
            color="#b0becb"
            size="50px"
          />
      </div>
      <template v-if="blocks.length">
        <MemoryPoolTable
          :data="blocks"
          :recordsCount="records"
        />
      </template>
      <template v-else>
        <div class="empty-data__wrapper">
          <moon-loader
            class="empty-data__loader"
            v-if="loading"
            color="#b0becb"
            size="50px"
          />
          <div class="empty-data__text" v-else>
            {{$t('error_msg.Mempool')}}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import MemoryPoolTable from './MemoryPoolTable'
import Breadcrumbs from '../../commonUI/Breadcrumbs'
import { GET_MEMORY_POOL, GET_MEMPOOL_ALLTRANSACTION_COUNT } from '@/services/requests'
import { parseCryptoForRequests } from '../../../mocks/route-crypto-parser'
import MoonLoader from 'vue-spinner/src/MoonLoader'

export default {
  name: 'MemoryPool',
  components: {
    MemoryPoolTable,
    Breadcrumbs,
    MoonLoader
  },
  data () {
    return {
      blocks: [],
      records: 0,
      page: 1,
      pages: 1,
      counterTransaction: '',
      totalPages: '',
      loading: false,
      preloaded: false,
      checkTotalPages: false
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    title () {
      return `${this.crypto.toUpperCase()} Mempool`
    },
    description () {
      return `Sample ${this.crypto.toUpperCase()} Mempool`
    }
  },

  methods: {
    getMemPool () {
      this.loading = true
      this.$router.push({ query: { ...this.$route.query, page: this.page } })
      GET_MEMORY_POOL(parseCryptoForRequests[this.crypto], this.$route.query)
        .then(request => {
          this.totalPages = request.total
          this.blocks = request.records
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    refreshMempool () {
      this.preloaded = true
      this.page = 1
      this.$router.push({ query: { ...this.$route.query, page: 1 } })
      this.checkTotalPages = false
      GET_MEMORY_POOL(parseCryptoForRequests[this.crypto], this.$route.query)
        .then(request => {
          this.getAllTransactionCount ()
          this.blocks = request.records
          this.totalPages = request.total
          this.totalPages < this.page ? this.checkTotalPages = true : ''
          this.preloaded = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    getLoadMoreTransactions () {
      this.preloaded = true
      this.page = this.page + 1
      this.$router.push({ query: { ...this.$route.query, page: this.page } })
      GET_MEMORY_POOL((parseCryptoForRequests[this.crypto]), this.$route.query)
        .then(res => {
          this.getAllTransactionCount()
            this.blocks.push(...res.records)
            this.totalPages = res.total
            this.preloaded = false
        })
        .catch(err => {
          this.preloaded = false
        })
    },
    getAllTransactionCount () {
      GET_MEMPOOL_ALLTRANSACTION_COUNT ((parseCryptoForRequests[this.crypto]))
        .then(res => {
          this.counterTransaction = res.count
        })
    }
  },

  mounted () {
    this.getMemPool ()
    this.getAllTransactionCount ()
  }
}
</script>
