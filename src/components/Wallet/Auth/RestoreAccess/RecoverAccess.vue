<template>
  <div class="flex justify-end full-height">
    <div class="wrapper_login flex justify-center content-center q-mt-xl">
<!--      animation-->
        <component :is="recoverStep"
                   :seedPhrase="seedPhrase"
                   @recoverSeed="restoreSeedPhrase"

        />

    </div>
  </div>
</template>

<script>
import DragNDropFile from './DragNDropFile'
import RestoreSeedPage from './RestoreSeedPage'

export default {
  name: 'RecoverAccess',
  components: {
    DragNDropFile,
    RestoreSeedPage
  },
  data () {
    return {
      recoverStep: 'DragNDropFile',
      seedPhrase: []
    }
  },
  methods: {
    restoreSeedPhrase (seedPhrase) {
      this.recoverStep = 'RestoreSeedPage'
      this.seedPhrase = seedPhrase.phrase.split(' ')
    }
  }
}
</script>

<style scoped>

</style>
