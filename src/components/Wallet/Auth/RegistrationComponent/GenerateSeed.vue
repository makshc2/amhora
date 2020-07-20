<template>
  <div class="col-6">
    <div v-if="!loader">
    <q-card
      class="column justify-center"
      style="width: 420px">
      <q-card-section class="text-center">
        <div class="fs-15 text-bold">
          {{$t('registration.title_seed')}}
        </div>
        <div class="q-mt-lg">
          {{$t('registration.second_title_seed')}}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex wrap justify-around q-pb-sm">
          <div v-for="(item,index) in seedPhrase" :key="index" class="wrapper-seed-word flex q-py-md">
            <div class="q-px-sm">{{index + 1}}.</div>
            <div>{{item}}</div>
          </div>
        </div>
      </q-card-section>
      <q-separator/>
      <q-btn>
        <BaseCopyButton class="full-width" color="grey-5 text-capitalize" text="global.copy" :content="seedPhrase"/>
      </q-btn>
    </q-card>
    <q-btn color="grey-9"
           class="full-width q-mt-md custom-border-radius-5 text-capitalize"
           :label="$t('registration.button_copied')"
           @click="toNextStep"
    />
    </div>
    <div v-if="loader" class="flex justify-center full-height">
      <MoonLoader
        color="#b0becb"
      />
    </div>
  </div>
</template>

<script>
import Mnemonic from 'bitcore-mnemonic'
import BaseCopyButton from '../../../commonUI/BaseCopyButton'
import MoonLoader from 'vue-spinner/src/MoonLoader'

export default {
  name: 'GenerateSeed',
  components: { BaseCopyButton, MoonLoader },
  data () {
    return {
      seedPhrase: [],
      loader: true
    }
  },
  methods: {
    generateMnemonic () {
      let mnemonic = new Mnemonic()
      this.seedPhrase = mnemonic.phrase.split(' ')
      setTimeout(() => {
        this.loader = false
      }, 500)
    },
    splitMnemonic () {
      let mnemonicToCheck = [...this.seedPhrase]
      let indexesForRemove = []
      let randomNum
      while (indexesForRemove.length < 4) { // refactor
        randomNum = Math.round(Math.random() * 11)
        !indexesForRemove.includes(randomNum) && indexesForRemove.push(randomNum)
      }
      for (let i = 0; i < indexesForRemove.length; i++) {
        mnemonicToCheck[indexesForRemove[i]] = ''
      }
      return mnemonicToCheck
    },
    toNextStep () {
      this.$emit('addSeed', {
        seed: this.seedPhrase,
        seedToCheck: this.splitMnemonic()
      })
    }
  },
  created () {
    this.generateMnemonic()
  }
}
</script>

<style scoped lang="scss">
  .wrapper-seed-word {
    width: 30%;
  }
</style>
