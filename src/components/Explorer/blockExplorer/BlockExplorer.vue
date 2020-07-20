<template>
  <div class="block-explorer-page">
    <vue-headful
      :title="title"
      :description="description"
    />
    <breadcrumbs></breadcrumbs>
    <div class="block-explorer-page__main container">
      <DayPagination
        v-if="selectedDate"
        :selectedDate="selectedDate"
        @onUpdateDate="updateDate"/>
    </div>
    <div class="block-explorer-pag__table container">
      <template v-if="blocks.length">
        <BlockExplorerTable
          :data="blocks"
          :pages="pages"
          :page="page"
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
            {{$t('error_msg.blocks_not_found')}}
            <span
              class="ask"
              v-tooltip.bottom="{
                 content: $t('block_explorer.info_error_tooltip')
              }">
                !
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import BlockExplorerTable from './BlockExplorerTable'
import Breadcrumbs from '../../commonUI/Breadcrumbs'
import DayPagination from '../../commonUI/DayPagination'
import { GET_BLOCKS_HISTORY } from '../../../services/requests'
import moment from 'moment'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import { parseCryptoForRequests } from '../../../mocks/route-crypto-parser'
export default {
  name: 'BlockExplorer',
  components: { MoonLoader, DayPagination, Breadcrumbs, BlockExplorerTable },
  data () {
    return {
      blocks: [],
      time: ' ',
      page: 1,
      pages: 1,
      records: 0,
      loading: false,
      selectedDate: null
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    title () {
      return `${this.crypto.toUpperCase()} Block Explorer`
    },
    description () {
      return 'sample block explorer'
    }
  },
  methods: {
    updateDate (date) {
      this.selectedDate = date
      this.$router.push({ query: { ...this.$route.query, timestamp:
            Date.UTC(date.getFullYear(),
              date.getMonth(),
              date.getDate()) / 1000, page: 1 } })
    },
    getDate () {
      this.selectedDate = this.$route.query.timestamp ? new Date(this.$route.query.timestamp * 1000) : this.updateDate(new Date())
    },
    getBlocks () {
      this.loading = true
      GET_BLOCKS_HISTORY(parseCryptoForRequests[this.crypto], this.$route.query)
        .then(request => {
          this.page = request.page
          this.pages = request.total
          this.blocks = request.records
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    }
  },
  watch: {
    '$route.query' (newValue, oldValue) {
      if (newValue.timestamp !== oldValue.timestamp) {
        this.getDate()
      }
      this.getBlocks()
    }
  },
  mounted () {
    this.getDate()
    this.getBlocks()
  }
}
</script>
<style lang="scss">
  .block-explorer-pag__table{
    margin-top: 28px;
  }
  .empty-data__wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    min-height: 300px;
    align-items: flex-start;
    .empty-data__loader,
    .empty-data__text{
      margin: auto;
    }
  }
</style>
