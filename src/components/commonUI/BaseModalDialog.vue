<template>
    <div>
<!--        <div :class="['top-wrapper', {'top-wrapper-appearing': isOpened}]">-->
        <q-dialog :key="scopedDialogName || dialogName"
                  :value="propsIsOpen || (isOpened && !propsIsOpen)"
                  @hide="closeDialog"
                  content-class="dialog-wrapper">
            <div class="overflow-visible">
                <q-card style="width: 560px; max-width: 80vw;">
<!--                    <q-btn class="close-dialog absolute"-->
<!--                           color="white"-->
<!--                           size="md"-->
<!--                           flat round dense-->
<!--                           v-close-popup>-->
<!--                        <q-icon size="18px"-->
<!--                                name="icon-close"-->
<!--                        />-->
<!--                    </q-btn>-->
                    <component
                            :is="scopedDialogName || propDialogName || dialogName"
                            @changeDialogComponent="changeDialogComponent"
                            :payload="scopedPayload || payload"
                    >
                        <template #header="{text}">
                            <q-card-section class="text-center q-py-lg">
                                <h4 class="text-secondary-text">{{$t(text)}}</h4>
                            </q-card-section >
                            <q-separator color="gray-5"/>
                        </template>
                    </component>
                    <slot></slot>
                </q-card>
            </div>
        </q-dialog>
    </div>
<!--    </div>-->
</template>

<script>
import { mapState } from 'vuex'
import MainInformerDialog from '../BaseDialog/MainInformerDialog'
import ConfirmPassword from '../BaseDialog/ConfirmPassword'
import On2FactorAuth from '../BaseDialog/On2FactorAuth'
import VerifyEmail from '../BaseDialog/VerifyEmail'
import SessionPassword from '../BaseDialog/SessionPassword'
import AddAddress from '../BaseDialog/AddAddress'
export default {
  name: 'BaseModalDialog',
  components: {
    MainInformerDialog,
    ConfirmPassword,
    On2FactorAuth,
    VerifyEmail,
    SessionPassword,
    AddAddress
  },
  props: {
    propDialogName: {
      default: '',
      type: String
    },
    propsIsOpen: {
      default: false,
      type: Boolean
    },
    propsPayload: {
      default: null,
      type: Object
    }
  },
  data () {
    return {
      scopedDialogName: '',
      scopedPayload: null
    }
  },
  computed: {
    ...mapState('ModalDialogService',
      ['isOpened', 'dialogName', 'payload'])
  },
  methods: {
    changeDialogComponent ({ name, payload }) {
      this.scopedDialogName = name
      this.scopedPayload = payload
    },
    closeDialog () {
      this.$root.$emit('closeDialog')
      this.scopedDialogName = ''
      this.scopedPayload = null
      if (this.isOpened) {
        return this.$store.commit('ModalDialogService/closeDialog')
      }
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped lang="scss">
    .top-wrapper {
        position: absolute;
        background: rgba(0,0,0,0.4);
        opacity: 0;
        transition: all 250ms linear;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;

    }
    .top-wrapper-appearing {
        opacity: 1;
        z-index: 999;
    }

    .dialog-wrapper {
        .close-dialog {
            right: 0;
            top: 0;
            transform: translate(75%, -75%);
        }
        .q-dialog__backdrop {
            background: unset;
        }
    }
</style>
