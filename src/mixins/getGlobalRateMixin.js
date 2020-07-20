export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    getGlobalRate () {
      this.loading = true
      this.$store.dispatch('GET_GLOBAL_RATE')
        .then(() => {
          this.loading = false
        })
        .catch(error => {
          this.loading = true
          console.error(error)
          this.$store.dispatch('LOG_ERR', {
            error: error,
            url: document.location.href
          })
          this.$router.push('/error')
        })
    }
  }
}
