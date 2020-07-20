<template>
  <div class="middle-part">
    <Breadcrumbs />
    <div class="content-middle">
      <div class="error_content container">
        <h2 class="err-title">
          {{$t(error.msg) || $t('error_msg.page_not_found')}}
        </h2>
        <template v-if="errorId">
          <h3 class="err-secondary-text">{{$t('error_msg.err_id')}}</h3>
          <div class="err-id-wrapper" >
            <span>{{errorId}}</span>
            <button
              type="button"
              v-clipboard="errorId || ''"
              class="copy-button">
              <svg @click="copyInfo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="17" viewBox="0 0 15 17"><defs><path id="cbkqa" d="M987.71 256h9.286v11.607"/><path id="cbkqb" d="M984 271.32v-11.61h9.29v11.61z"/></defs><g><g transform="translate(-983 -255)"><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqa"/></g><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqb"/></g></g></g></svg>
              <q-tooltip no-parent-event
                         anchor="top middle"
                         self="bottom middle"
                         v-model="showing">
                Copied
              </q-tooltip>
            </button>
          </div>
        </template>
        <span class="hint">
          {{$t('error_msg.contact_our_support')}}
        </span>
        <router-link class="support-link" :to="'#'">
          {{$t('error_msg.support')}}
          <img src="@/assets/resources/icons/arrow-r.svg" alt="arrow">
        </router-link>
      </div>
      <div class="border-top-wrapper">
        <div class="container">
          <h3 class="err-secondary-text">{{$t('error_msg.we_are_in_social')}}</h3>
          <div class="links-wrapper">
            <a
              class="social-links"
              href="https://telegram.org/"
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="17" viewBox="0 0 19 17"><defs><path id="iqt5a" d="M382.232 558.399l-7.877 7.55a.472.472 0 0 0-.14.293l-.304 2.922c-.01.095-.132.108-.159.016l-1.248-4.358a.478.478 0 0 1 .182-.526l9.302-6.253c.214-.144.433.175.244.356zm2.139-3.333l-16.977 7.17c-.55.232-.516 1.087.05 1.268l4.314 1.381 1.61 5.536c.168.579.844.754 1.235.32l2.23-2.467 4.377 3.481c.536.426 1.298.11 1.434-.595l2.899-15.018c.142-.736-.526-1.349-1.172-1.076z"/></defs><g><g transform="translate(-367 -555)"><use fill="#41464a" xlink:href="#iqt5a"/></g></g></svg>
              Telegram
            </a>
            <a
              class="social-links"
              href="https://twitter.com/"
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="15" viewBox="0 0 18 15"><defs><path id="qjlma" d="M557.145 557.003V557h.852l.312.062c.207.04.396.094.565.16.17.065.333.141.492.229.158.087.302.176.43.267.129.09.243.185.345.285.1.102.257.128.47.079.214-.05.443-.118.689-.205a9.24 9.24 0 0 0 .73-.295c.24-.11.386-.179.438-.208a6.21 6.21 0 0 0 .082-.05l.004-.004.016-.009.016-.008.017-.008.016-.008.003-.005.005-.003.005-.004.004-.005.016-.004.016-.004-.003.025-.005.024-.008.025-.008.025-.008.016-.009.016-.008.025a.569.569 0 0 0-.016.065 2.75 2.75 0 0 1-.156.328 4.1 4.1 0 0 1-.369.582 2.86 2.86 0 0 1-.396.446 3.772 3.772 0 0 0-.235.213.703.703 0 0 1-.139.115l-.082.054-.016.008-.017.008-.003.005-.005.003-.005.004-.003.005-.016.008-.017.008-.003.005-.005.003-.005.003-.003.005-.004.005-.004.004-.005.003-.004.005h.082l.46-.099c.305-.065.597-.144.876-.237l.443-.148.049-.016.024-.008.017-.008.016-.009.017-.008.016-.008.033-.005.032-.003v.033l-.008.003-.008.005-.003.005-.005.003-.005.003-.003.005-.004.005-.004.003-.005.004-.004.004-.003.005-.005.004-.008.016-.008.016-.005.004a71.12 71.12 0 0 1-.208.278c-.137.184-.21.277-.222.279-.01.003-.026.02-.045.05-.02.03-.135.152-.348.365a8.248 8.248 0 0 1-.626.568.776.776 0 0 0-.311.617c-.004.242-.016.516-.038.822-.022.306-.063.637-.123.992s-.153.757-.279 1.205a10.952 10.952 0 0 1-1.024 2.458 11.07 11.07 0 0 1-1.04 1.524c-.17.208-.384.442-.643.702l-.426.426a10.84 10.84 0 0 1-.322.269c-.188.156-.39.312-.606.469a7.016 7.016 0 0 1-.593.388c-.18.104-.398.222-.653.356a7.76 7.76 0 0 1-.823.373c-.295.115-.606.222-.934.32a8.533 8.533 0 0 1-.95.23 13.51 13.51 0 0 1-1.041.139l-.582.057v.008h-1.065v-.008l-.14-.008a7.438 7.438 0 0 1-.23-.016 27.29 27.29 0 0 1-.68-.09 9.817 9.817 0 0 1-.925-.164 12.286 12.286 0 0 1-1-.312 9.727 9.727 0 0 1-1.136-.464c-.314-.155-.51-.253-.59-.295a4.188 4.188 0 0 1-.266-.15l-.147-.09-.003-.006-.005-.003-.005-.003-.003-.005-.017-.008-.016-.008-.003-.005-.005-.004-.005-.003-.004-.005-.003-.005-.005-.003H545v-.033l.016.003.017.005.074.009c.049.005.183.013.401.024a7.396 7.396 0 0 0 2.36-.27c.35-.093.671-.204.964-.331.292-.13.5-.225.623-.289.122-.062.309-.178.56-.347l.377-.254.004-.005.005-.004.004-.003.004-.005.003-.005.005-.003.005-.003.003-.005.016-.005.017-.003.003-.017.005-.016.005-.003.003-.005-.13-.008-.255-.017a2.464 2.464 0 0 1-.385-.074 3.699 3.699 0 0 1-.566-.196 4.36 4.36 0 0 1-.59-.312c-.19-.12-.329-.22-.414-.3a7.19 7.19 0 0 1-.328-.334 3.316 3.316 0 0 1-.348-.447 4.02 4.02 0 0 1-.281-.53l-.136-.298-.009-.025-.008-.024-.005-.017-.003-.016.025.003.024.005.18.025c.12.016.31.022.566.016.257-.005.434-.016.533-.033.098-.016.158-.027.18-.032l.033-.009.04-.008.042-.008.003-.005.005-.003.005-.004.003-.004-.033-.009-.033-.008-.032-.008-.033-.008-.033-.008a3.004 3.004 0 0 1-.115-.033 6.288 6.288 0 0 1-.442-.18 3.384 3.384 0 0 1-.574-.304 3.96 3.96 0 0 1-.406-.323 4.64 4.64 0 0 1-.422-.455 3.279 3.279 0 0 1-.41-.648c-.12-.245-.21-.48-.27-.704-.06-.223-.1-.45-.118-.68l-.03-.345.017.004.017.004.016.009.016.008.017.008.016.008.254.115c.17.076.38.142.631.197.251.054.402.084.45.09l.075.008h.147l-.003-.005-.005-.003-.005-.004-.003-.004-.004-.005-.004-.004-.005-.003-.004-.005-.016-.008-.016-.008-.004-.005-.005-.003-.005-.004-.003-.005-.016-.008-.017-.008-.003-.005a2.15 2.15 0 0 1-.423-.372 9.656 9.656 0 0 1-.295-.344 2.658 2.658 0 0 1-.262-.385 4.667 4.667 0 0 1-.243-.522 3.7 3.7 0 0 1-.265-1.265c-.006-.207 0-.385.016-.533.017-.147.05-.314.099-.5.049-.185.12-.382.213-.59l.139-.31.008-.025.008-.025.005-.003.004-.005.003-.005.005-.003.005.003.003.005.003.005.005.003.005.003.003.005.004.005.005.003.008.017.008.016.005.003.003.005.221.246c.148.164.323.347.525.55.202.201.314.306.336.314a.24.24 0 0 1 .082.075c.033.04.142.137.328.29.185.153.429.331.729.533s.634.402 1 .598c.366.197.76.375 1.18.533.42.158.716.262.885.311.17.05.459.112.869.189.41.076.718.126.926.147.207.022.35.035.426.038l.115.003-.004-.024-.005-.025-.032-.205a3.851 3.851 0 0 1-.033-.573c0-.246.019-.473.057-.68a4.03 4.03 0 0 1 .172-.631 3.37 3.37 0 0 1 .225-.513c.074-.128.171-.274.292-.438.12-.164.275-.333.467-.508.19-.175.41-.33.655-.467.246-.137.473-.24.68-.312a3.17 3.17 0 0 1 .525-.139c.142-.022.213-.034.213-.038z"/></defs><g><g transform="translate(-545 -557)"><use fill="#41464a" xlink:href="#qjlma"/></g></g></svg>
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Raven from 'raven-js'
import Breadcrumbs from './commonUI/Breadcrumbs'

export default {
  name: 'Error',
  components: { Breadcrumbs },
  data () {
    return {
      showing: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    errorId () {
      return Raven.lastEventId()
    },
    currency () {
      return this.$store.getters.crypto
    }
  },

  methods: {
    copyInfo () {
      this.showing = true
      setTimeout(() => {
        this.showing = false
      }, 1000)
    },
    setCryptoCurrency (crypto) {
      this.$store.commit('SET_CRYPTO', crypto)
    }
  },

  watch: {
    currency: function () {
      this.setCryptoCurrency(this.currency.toUpperCase())
    }
  },
  mounted: function () {
  },
  created: function () {
    this.setCryptoCurrency(this.currency.toUpperCase())
  }
}
</script>
<style scoped lang="scss">
  .middle-part{
    padding-top: 40px;
  }
  .err-title{
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -0.49px;
    margin-bottom: 40px;
  }
  .err-secondary-text{
    font-size: 13px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0.17px;
  }
  .err-id-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    border-radius: 2px;
    background-color: #f6f6f6;
    width: 50%;
    padding: 0 18px;
    color: #41464a;
    font-size: 16px;
    font-weight: 500;
  }
  .err-secondary-text{
    margin-bottom: 10px;
  }
  .hint{
    margin-top: 18px;
    margin-bottom: 18px;
    color: #41464a40;
    font-size: 13px;
    font-weight: 500;
  }
  .border-top-wrapper{
    margin-top: 60px;
    padding-top: 40px;
  }
  .support-link{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    min-width: 119px;
    height: 50px;
    border-radius: 2px;
    background-color: #4e4e4e;
    color: #fff;
    font-size: 14px;
    font-weight: 800;

    img{
      margin-left: 27px;
    }
  }

  .social-links{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 149px;
    height: 50px;
    border-radius: 2px;
    background-color: #f6f6f6;
    color: #41464a;
    font-size: 15px;
    font-weight: 800;
    line-height: 17px;
    letter-spacing: 0.2px;
    margin-right: 20px;
    svg{
      margin-right: 15px;
    }
  }

  .links-wrapper{
    display: flex;
    margin-top: 20px;
  }
  .error_content{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .down a{
    font-weight: 500;
    color: #000000;
    font-size: 15px;
    text-decoration: underline !important;

  }

</style>
