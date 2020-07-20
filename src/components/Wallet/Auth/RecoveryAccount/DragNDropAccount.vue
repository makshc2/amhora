<template>
    <div class="col-6">
        <q-card
                class="column justify-center"
                style="width: 420px">
            <q-card-section class="text-center">
                <div class="fs-15 text-bold q-mb-lg">{{$t('registration.upload_account')}}</div>
                <DragNDrop/>
               <span v-if="errorFile" class="text-red fs-14">{{$t('validation_errors.unexpected_error')}}</span>
                <q-btn @click="recoveryAccount"
                       color="grey-9"
                       class="full-width q-mt-md custom-border-radius-5 text-capitalize"
                       :label="$t('global.confirm')"
                />
                <q-btn color="white"
                       class="full-width q-mt-md custom-border-radius-5 text-black text-capitalize"
                       :label="$t('global.back')"
                       @click="$router.push({name: 'WelcomePage'})"
                />
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
import DragNDrop from '../../../commonUI/DragNDrop'
export default {
  name: 'DragNDropAccount',
  components: {
    DragNDrop
  },
  props: {
    errorFile: {
      type: Boolean
    }
  },
  data () {
    return {
      accountData: {}
    }
  },
  methods: {
    recoveryAccount () {
      this.$emit('addedAccountFile', this.accountData)
    }
  },
  created () {
    this.$root.$on('crypto-seed-phrase', (data) => {
      this.accountData = data
    })
  }
}
</script>

<style scoped>

</style>
