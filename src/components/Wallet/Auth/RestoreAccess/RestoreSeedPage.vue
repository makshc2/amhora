<template>
  <div class="col-6">
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
        <BaseCopyButton color="grey-5 text-capitalize" text="global.copy" :content="seedPhrase"/>
      </q-btn>
    </q-card>
    <q-btn color="grey-9"
           class="full-width q-mt-md custom-border-radius-5 text-capitalize"
           :label="$t('registration.go_login')"
           @click="$router.push({name: 'WelcomePage'})"
    />
  </div>
</template>

<script>
import BaseCopyButton from '../../../commonUI/BaseCopyButton'
export default {
  name: 'RestoreSeedPage',
  components: {
    BaseCopyButton
  },
  props: {
    seedPhrase: {
      type: Array
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
  .wrapper-seed-word {
    width: 30%;
  }
</style>
