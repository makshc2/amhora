<template>
    <div class="full-width">
        <div class="title fs-18 q-mb-lg">{{$t('settings.preferences')}}</div>
        <div class="select row q-gutter-x-xl">
            <div class="col-3">
                <ValidationProvider
                        tag="div"
                        name="email"
                        ref="email"
                        class="relative-position"
                        rules="email"
                        v-slot="{ errors, reset, invalid, validated}">
                    <q-input
                            @focus="reset"
                            v-model="email"
                            :label="$t('global.email')"
                            :error="invalid && validated"
                            :error-message="errors[0]"
                            outlined
                            no-error-icon
                            color="dark"
                            :disable="isChange"
                    >
                    </q-input>
                    <div class="row q-mt-sm" style="width: 300px">
                        <q-btn v-show='!isChange' class="fs-14 no-padding q-mr-lg text-grey-8 text-capitalize cursor-pointer"
                               @click="savePreferences(), isChange = true"
                               outline
                               :disable="invalid && validated || email === oldEmail"
                               :label="$t('settings.save')"
                        />
                        <q-btn v-show="isChange" class="fs-14 no-padding q-mr-lg text-grey-8 text-capitalize cursor-pointer"
                               @click="isChange = false"
                               outline
                               :label="$t('settings.change')"
                        />
                        <q-btn v-if="!emailConfirmed && isChange && email"
                               class="fs-14 text-capitalize cursor-pointer"
                               @click="verifyEmail"
                               color="green"
                               :label="$t('global.confirm_email')"
                        />
                    </div>
                </ValidationProvider>
            </div>
            <div class="col-3">
                <q-select
                        outlined
                        v-model="fiat"
                        :options="currencyOptions"
                        :label="$t('settings.preferable_currency')"
                        color="dark"
                        @input="selectFiat"
                />
            </div>
            <div class="col-3">
                <q-select outlined
                          v-model="lang"
                          :options="langOptions"
                          :label="$t('settings.language')"
                          @input="selectLang"
                          color="dark"
                >
                    <template v-slot:prepend>
                        <img class="flag" :src="require(`@/assets/resources/img/${lang.img}`)"/>
                    </template>
                </q-select>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import apiUrls from '@/services/api-urls'

export default {
  name: 'Preferences',
  props: {
    emailConfirmed: {
      type: Boolean
    },
    oldEmail: {
      type: String
    }
  },
  data () {
    return {
      email: '',
      language: '',
      fiat: '',
      isChange: true,
      currencyOptions: [
        'USD', 'GBP', 'EUR'
      ],
      lang: {
        name: 'ENG',
        label: 'English',
        fullName: 'English',
        img: 'LanguageEN.png',
        value: 'en',
        moment: 'en-gb'
      },
      langOptions: [
        {
          name: 'ENG',
          label: 'English',
          fullName: 'English',
          img: 'LanguageEN.png',
          value: 'en',
          moment: 'en-gb'
        },
        {
          name: 'RU',
          label: 'Russian',
          fullName: 'Russian',
          img: 'LanguageRU.png',
          value: 'ru',
          moment: 'ru'
        }
      ]
    }
  },
  methods: {
    selectLang () {
      this.axios.post(apiUrls.profile_lang, {
        language: this.lang.value
      })
        .then(() => {
          this.$i18n.set(this.lang.value)
          moment.locale(this.lang.value)
          this.$store.commit('SET_LANGUAGE', this.lang.value)
        })
    },
    checkUserInfo () {
      this.axios.get(apiUrls.profile)
        .then(data => {
          this.email = data.data.email
          this.language = data.data.language
          this.fiat = data.data.fiat.toUpperCase()
          if (this.language === 'en') {
            this.lang = this.langOptions[0]
          } else {
            this.lang = this.langOptions[1]
          }
        })
    },
    savePreferences () {
      if (this.email !== this.oldEmail) {
        this.axios.post(apiUrls.profile_email, {
          email: this.email
        })
          .then(() => {
            this.$q.notify({
              position: 'top',
              message: this.$t('global.saved_email'),
              color: 'green',
              textColor: 'white'
            })
            this.$emit('updateProfile')
          })
          .catch((e) => {
            return this.$refs.email.setErrors([this.$t('validation_errors.wrong_email')])
          })
      } else {
        return this.$refs.email.setErrors([this.$t('validation_errors.wrong_email')])
      }
    },
    verifyEmail () {
      this.$store.commit('ModalDialogService/openModalDialog', {
        dialogName: 'VerifyEmail'
      })
    },
    selectFiat () {
      this.axios.post(apiUrls.set_fiat, {
        fiat: this.fiat.toLowerCase()
      })
        .then(() => {
          this.$store.commit('CHANGE_FIAT', this.fiat.toUpperCase())
        })
    }
  },
  mounted () {
    this.checkUserInfo()
  }
}
</script>

<style scoped>

</style>
