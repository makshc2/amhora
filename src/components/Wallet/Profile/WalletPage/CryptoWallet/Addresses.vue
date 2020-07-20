<template>
    <div class="row avenir-font-family">
        <div class="send-to-address col-7 q-gutter-y-lg">
            <div class="q-gutter-y-md">
                <span>{{$t('wallet.send_to_address')}}</span>
                <q-input outlined
                         v-model.trim="address"
                         :error="!!error"
                         :error-messages="error"
                         @input="error = ''"
                />
            </div>
            <div class="q-gutter-y-md">
                <span>{{$t('wallet.amount')}}</span>
                <div class="row justify-between items-center">
                    <q-input outlined
                             v-model="cryptoAmount"
                             type="number"
                             style="width: 47%"
                    >
                        <template v-slot:append>
                            <span class="fs-14">{{crypto.toUpperCase()}}</span>
                        </template>
                    </q-input>
                    <span class="text-grey-5">=</span>
                    <q-input outlined
                             v-model="fiatAmount"
                             type="number"
                             style="width: 47%"
                    >
                        <template v-slot:append>
                            <span class="fs-14">{{fiat}}</span>
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="q-gutter-y-md">
                <span>{{$t('wallet.transaction_fee')}}</span>
                <div class="row justify-between items-start">
                    <div class="col-7">
                        <q-tabs
                                v-model="transactionFee"
                                class="fee-tabs"
                        >
                            <q-tab name="minimum" class="text-capitalize" :label="$t('wallet.minimum')" />
                            <q-tab name="regular" class="text-capitalize" :label="$t('wallet.regular')" />
                            <q-tab name="priority" class="text-capitalize" :label="$t('wallet.priority')" />
                        </q-tabs>
                        <div class="row justify-between q-mt-md">
                            <span class="text-grey-5">{{$t('wallet.confirmation_time')}} {{timeFee}} {{$t('wallet.hours')}}</span>
                            <div class="row">
                                <div class="q-mr-md">={{feeCrypto}} {{crypto.toUpperCase()}}</div>
                                <div class="bg-grey-3 q-px-sm">{{fiatIcon}}{{feeFiat}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div @click="sendTransaction"
                             class="button-bg text-white cursor-pointer custom-border-radius-5 q-py-md row items-center"
                        >
                            <CollorCurrencySvgs
                                    style="height: 20px"
                                    class="q-mx-sm"
                                    :currency="currency.toUpperCase()"
                            />
                            <span class="text-uppercase">{{$t('global.send')}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <q-separator vertical class="q-mx-lg"></q-separator>
        <div class="col-4">
          <div class="button_wrapper row justify-between q-px-sm">
            <span class="fs-15">{{$t('wallet.saved_addresses')}}</span>
            <q-btn size="8px"
                   class="q-pa-none bg-grey-3"
                   icon="fas fa-plus"
                   @click="addAddressPopup"
            />
          </div>
                <q-input class="text-grey-5 q-px-sm q-mt-md"
                         v-model="search"
                         :placeholder="$t('global.search')"
                >
                    <template #append>
                        <q-icon size="14px" name="fas fa-search" />
                    </template>
                </q-input>
          <div class="wrapper-addresses-book scroll-y q-mt-lg" style="max-height: 300px">
            <div v-if="addressByTitle.length">
              <div v-for="(item, index) in addressByTitle"
                   :key="index"
                   class="items-wrapper row justify-between items-center cursor-pointer q-px-sm no-wrap"
              >
                <div class="column q-mb-md overflow-hidden" style="max-width: 280px">
                  <span>{{item.name}}</span>
                  <span class="text-grey-5">{{item.address}}</span>
                </div>
                <div class="row items-center">
                  <BaseCopyButton class="text-grey-6 q-mr-sm" :content="[item.address]"/>
                  <q-icon @click="deleteAddress(item.address, item.name)" class="text-grey-6" :name="'fas fa-times'" />
                </div>
              </div>
            </div>
            <div v-else class="row justify-center items-center" style="height: 200px">
              <span>{{$t('wallet.no_addresses')}}</span>
            </div>
          </div>
        </div>
        <q-separator class="q-my-lg"></q-separator>
    </div>
</template>

<script>
import apiUrls from '@/services/api-urls'
import fiatSignMixin from '@/mixins/fiatSignMixin'
import CollorCurrencySvgs from '../../../../commonUI/CollorCurrencySvgs'
import { mapGetters } from 'vuex'
import BaseCopyButton from '../../../../commonUI/BaseCopyButton'
export default {
  name: 'Addresses',
  components: {
    CollorCurrencySvgs,
    BaseCopyButton
  },
  data () {
    return {
      address: '',
      error: '',
      search: '',
      cryptoAmount: '',
      fiatAmount: '',
      transactionFee: 'minimum',
      timeFee: '3',
      feeCrypto: '0,00034',
      feeFiat: '40.03',
      addressesBook: []
    }
  },
  props: {
    currency: {
      type: String
    },
    walletId: {
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      fiat: 'fiat',
      crypto: 'crypto'
    }),
    addressByTitle () {
      return this.addressesBook.filter(item =>
        item.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1 ||
        item.address.indexOf(this.search) !== -1)
    }
  },
  mixins: [fiatSignMixin],
  methods: {
    getAddressBook () {
      this.axios.get(apiUrls.wallet_book + `/${this.walletId}`)
        .then((data) => {
          this.addressesBook = data.data
        })
    },
    addAddressPopup () {
      this.$store.commit('ModalDialogService/openModalDialog', {
        dialogName: 'AddAddress'
      })
    },
    deleteAddress (address, name) {
      this.axios.delete(apiUrls.wallet_book + `/${this.walletId}`, {
        data: {
          address,
          name
        }
      })
        .then(() => {
          this.getAddressBook()
        })
    },
    sendTransaction () {

    }
  },
  created () {
    this.$root.$on('updateAddressBook', () => {
      this.getAddressBook()
    })
    this.getAddressBook()
  }
}
</script>

<style lang="scss">
  .fee-tabs{
    .text-capitalize{
      width: 134px;
    }
  }
  .wrapper-addresses-book{
    .items-wrapper{
      &:hover{
        background-color: #f6f6f6;
      }
    }
  }
  .button_wrapper{
    .q-btn__wrapper{
      padding: 2px 8px;
    }
  }
    .fee-tabs{
        .q-tab{
            border: 1px solid #ededee;
        }
        .q-tab--active {
            background-color: #ededee;
        }
        .q-tab__indicator{
            opacity: 0;
        }
    }
</style>
