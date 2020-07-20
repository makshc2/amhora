<template>
    <div class="col-6">
        <q-card
                class="column justify-center"
                style="width: 420px">
            <q-card-section class="text-center">
                <div class="fs-15 q-mb-sm q-mt-md">{{$t('login.one_time_pass')}}</div>
                <q-input filled
                         type="password"
                         autocomplete="new-password"
                         dense outlined field no-error-icon
                         color="black"
                         v-model="oneTimePassword"
                         :label="$t('global.password')"
                />
                <q-btn @click="enterOneTimePassword"
                       color="grey-9"
                       class="full-width q-mt-lg custom-border-radius-5 text-capitalize"
                       :label="$t('registration.enter_my_account')"
                       :disable="!oneTimePassword"
                />
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
    export default {
        name: "OneTimePassword",
        data() {
            return {
                oneTimePassword: ''
            }
        },
        methods: {
            enterOneTimePassword() {
                console.log(this.oneTimePassword)
            }
        }
    }
</script>

<style scoped>

</style>
