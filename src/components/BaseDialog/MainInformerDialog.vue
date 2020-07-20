<template>
    <div class="q-pb-lg">
        <div class="row justify-center q-py-lg">
            <div class="fs-25 text-bold">{{$t(payload.header)}}</div>
        </div>
        <q-separator color="gray-5"/>
        <div class="row justify-center q-py-lg">
            <q-icon v-if="payload.icon"
                    size="6rem"
                    :name="payload.icon"
                    color="warning"
            />
            <div class="q-gutter-x-md" v-else>
                <q-icon
                        v-for="(icon, i) in payload.icons" :key="i"
                        size="6rem"
                        :name="icon"
                        color="secondary"
                />
            </div>
        </div>
        <div class="text-center q-pa-lg fs-15">
            <span>{{$t(payload.info, payload.dynamicText)}}</span>
        </div>
        <div class="text-center">
            <q-btn :label="$t(payload.btn)"
                   color="dark"
                   class="q-mt-lg q-px-xl custom-border-radius-5"
                   @click="doAction"
            />
        </div>
    </div>
</template>

<script>
export default {
  name: 'MainInformerDialog',
  props: {
    payload: {
      type: Object
    }
  },
  methods: {
    doAction () {
      if (this.payload.action) {
        return this.payload.action.call(this)
      }
      return this.$store.commit('ModalDialogService/closeDialog')
    }
  }
}
</script>
