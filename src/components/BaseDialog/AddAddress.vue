<template>
    <div class="q-pa-lg column">
      <div class="text-right items-center cursor-pointer">
        <q-icon @click="closePopup" :name="'fas fa-times'"/>
        <span @click="closePopup" class="fs-14 q-ml-sm cursor-pointer">{{$t('global.close')}}</span>
      </div>
      <div class="q-gutter-y-lg">
        <div>
          <span>{{$t('wallet.address')}}</span>
          <q-input outlined
                   type="text"
                   v-model="address"
                   class="q-mt-md"
          />
        </div>
        <div>
          <span>{{$t('wallet.wallet_name')}}</span>
          <q-input outlined
                   type="text"
                   v-model="name"
                   class="q-mt-md"
          />
        </div>
        <q-btn class="full-width text-capitalize button-bg text-white"
               :label="$t('global.save_btn')"
               @click="saveAddress"
               :disable="!name || !address"
        />
      </div>
    </div>
</template>

<script>
import apiUrls from '@/services/api-urls'
export default {
  name: 'AddAddress',
  data () {
    return {
      name: '',
      address: ''
    }
  },
  methods: {
    closePopup () {
      this.name = ''
      this.address = ''
      this.$store.commit('ModalDialogService/closeDialog')
    },
    saveAddress () {
      this.axios.post(apiUrls.wallet_book, {
        address: this.address,
        name: this.name,
        currency: this.$route.params.currency === 'dsh' ? 'dash' : this.$route.params.currency
      })
        .then(() => {
          this.$root.$emit('updateAddressBook')
          this.$store.commit('ModalDialogService/closeDialog')
        })
    }
  }
}
</script>

<style scoped>

</style>
