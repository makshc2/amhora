<template>
  <div class="col-6">
    <q-card
            class="column justify-center"
            style="width: 420px">
      <q-card-section class="text-center">
        <div class="fs-15 text-bold">
          {{$t('registration.enter_seed_phrase')}}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex wrap justify-around q-pb-sm">
          <form class="flex wrap" ref="mnemonicForm">
            <q-input filled
                     type="text"
                     v-for="(item,i) in seedToCheck"
                     :key="i"
                     :bg-color="!!item ? 'white' : ''"
                     :disable="!!item"
                     v-model="dataInput[i]"
                     required
                     class="wrapper-seed-word flex q-py-sm q-mx-auto fs-14"
            >
              <template v-slot:prepend>
                <div class="fs-14">
                  {{i+1}}.
                </div>
              </template>
            </q-input>
          </form>
          <q-slide-transition v-show="invalidMnemonic">
            <div class="q-mt-lg text-red fs-15">
              Invalid Seed Phrase
            </div>
          </q-slide-transition>
        </div>
        <q-btn color="grey-9"
               class="full-width q-mt-md custom-border-radius-5 text-capitalize"
               :label="$t('global.verify')"
               @click="checkMnemonicPhrase()"
        />
        <q-btn color="white"
               class="full-width q-mt-md custom-border-radius-5 text-black text-capitalize"
               :label="$t('global.back')"
               @click="$emit('back')"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'CheckSeed',
  data () {
    return {
      invalidMnemonic: false,
      dataInput: this.seedToCheck.slice()
    }
  },
  props: {
    seedPhrase: {
      type: Array
    },
    seedToCheck: {
      type: Array
    }
  },
  methods: {
    checkMnemonicPhrase () {
      let form = this.$refs.mnemonicForm
      let checkForm = []
      for (let i = 0; i < form.elements.length; i++) {
        checkForm.push(form.elements[i].value)
      }
      if (JSON.stringify(checkForm) === JSON.stringify(this.seedPhrase)) {
        this.$emit('checkSeed')
      } else {
        this.invalidMnemonic = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper-seed-word {
    width: 30%;
  }
</style>
