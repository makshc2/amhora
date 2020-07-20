<template>
  <div class="search">
    <div class="search-field">
      <label for="search-input" class="search-label">
        <input
          id='search-input'
          class="square-input margin-input-search search-input"
          :class="{'input-error': showError}"
          :placeholder="$t('explorer.search_placeholder')"
          v-model.trim="search"
          type="text"
          pattern="[^а-яА-ЯёЁ]{0,}"
          @keyup.enter="contentDefinition"
          @focus="showError = false"
        >
        <span v-show='showError' class="ask ask_erorr-search"
              v-tooltip.hover="$t('explorer.sorry')">!</span>
        <button
          class="search-input-clean"
          @click="cleanSearch"
          v-if="search"
        >
          <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg>
        </button>
      </label>
    </div>
    <button class="search-button" @click="contentDefinition">
      <img src="@/assets/resources//icons/loup.svg" alt="">{{$t('explorer.search')}}
    </button>
  </div>
</template>
<script>
import { GET_TRANSACTION, GET_ADDRESS_INFORMATION, GET_BLOCK, GET_MEMPOOL } from '../../services/requests'
import { parseCryptoForRequests } from '../../mocks/route-crypto-parser'
// let WAValidator = require('wallet-address-validator')
import bchaddrjs from 'bchaddrjs'
import { address as liteCoinP2SH } from 'litecoin-p2sh-converter'

export default {
  name: 'Search',
  components: {},
  data () {
    return {
      search: null,
      forError: null,
      russianLetters: false,
      showError: false,
      transformedSearchHash: null
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    searchParams () {
      return { crypto: parseCryptoForRequests[this.crypto], hash: this.transformedSearchHash || this.search || this.search === ' ' }
    }
  },
  methods: {
    contentDefinition () {
      const redirectUrls = ['transaction', 'address', 'block','mempool']
      const expectedResults = this.crypto === 'ETH' ? ['hash', 'address', 'number'] : ['hash', 'address', 'height', 'hash']
      const resultsErrors = [false, false, false, false]

      /** check if search is BCH and isCashAddress, transform to legacy */
      if (this.crypto === 'BCH') {
        try {
          if (bchaddrjs.isCashAddress(this.search)) {
            this.transformedSearchHash = bchaddrjs.toLegacyAddress(this.search)
          }
        } catch (e) {
        }
      }
      /** check if search is LTC and first latter is M, transform to  legacy */
      if (this.crypto === 'LTC' && this.search[0] === 'M') {
        const versionsForLTC = { 5: 50, 50: 5, 196: 58, 58: 196 }
        try {
          const decoded = liteCoinP2SH.fromBase58Check(this.search)
          this.transformedSearchHash = liteCoinP2SH.toBase58Check(decoded.hash, versionsForLTC[decoded.version])
        } catch (e) {
          this.showError = true
          return
        }
      }

      const requests = [
        GET_TRANSACTION(this.searchParams),
        GET_ADDRESS_INFORMATION(this.searchParams),
        GET_BLOCK(this.searchParams),
        GET_MEMPOOL(this.searchParams),
      ]

      requests.forEach((promise, index) => {
        promise
          .then(resp => {
          this.$router.push({ path: `/${this.crypto.toLowerCase()}/${redirectUrls[index]}/${resp[expectedResults[index]] || 0}` })
        }).catch(() => {
          /** set error true for request and check if every request errored return 404 */
          resultsErrors[index] = true
          if (resultsErrors.every(res => res)) {
            this.showError = true
          }
        })
      })
    },
    cleanSearch () {
      this.search = ''
    }
  }
}
</script>
<style scoped lang="scss">
  .search-field{
    width: 100%;
  }
  .search-label{
    position: relative;
    height: 50px;
    width: 100%;
    margin-bottom: 10px;
    display: inline-block;
  }
  .search-input{
    border: 1px solid #97979720;
    transition: border .8s;
    width: 100%;
    height: 100%;
    background-color: transparent;
    padding-right: 80px;
    color:#4a4a4a;
    border-radius: 5px;
    &:focus{
      background-color: transparent;
      border: 1px solid #97979720;
    }
    &:invalid{
      border: 1px solid #FF000020;
    }
    &::placeholder{
      color: #41464a40;
      letter-spacing: 0.21px;
    }
  }
  .search {
    width: 100%;
    display: flex;
    margin-bottom: 28px;
    z-index: 0;
    position: relative;
  }

  .search-input-clean{
    height: 50px;
    width: 50px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    svg {
      height: 14px;
      width: 14px;
      fill: #4a4a4a;
    }
  }
  .input-error{
    background-color: #ffffdf !important;
    -webkit-box-shadow: 0 0 0 1000px #ffffdf inset !important;

  }
  .width-search {
    width: 12%;
    min-width: 81px;
    height: 35px;
  }
  .ask_erorr-search{
    z-index: 99999;
    position: absolute;
    right: 41px;
    top: 14px;
  }
  .search-button{
    z-index: -99999;
  }
  input {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
  }
</style>
