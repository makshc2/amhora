<template>
  <div ref="div" class="wrapper-drag flex items-center q-pa-md">
    <label class="full-width">
      <strong class="flex justify-between full-width" v-if="progress === 0">
        <div>
          {{ $t('global.file') }}
        </div>
        <div class="cursor-pointer custom-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
      </strong>
      <span v-else>{{ name }}</span>
        <input ref="input" type="file" id="file" name="files" :accept="accept" @change="onFileChange"/>
    </label>
    <svg class="delete-svg q-ml-md cursor-pointer absolute" v-if="progress === 100" @click="removeFile"
         xmlns="http://www.w3.org/2000/svg" width="24" height="24"
         viewBox="0 0 24 24">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
      <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>
    <pre>{{ error }}</pre>
    <q-slide-transition>
      <span v-show="errorFile"
            class="custom_error absolute  text-red">
        {{$t('validation_errors.invalid_file')}}
      </span>
    </q-slide-transition>
  </div>
</template>

<script>
export default {
  name: 'DragNDrop',
  data () {
    return {
      file: null,
      name: null,
      progress: 0,
      error: null,
      dragAndDropCapable: true,
      cryptoSeed: '',
      errorFile: false,
      formData: {},
      testFile: {}
    }
  },
  props: {
    label: {
      type: String,
      default: 'KeyCard'
    },
    accept: {
      type: String,
      default: '*'
    }
  },
  methods: {
    isDragAndDropCapable () {
      const { div } = this.$refs
      return (('draggable' in div) ||
          ('ondragstart' in div && 'ondrop' in div)) &&
          'FormData' in window &&
          'FileReader' in window
    },
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      this.createFile(files[0])
    },
    createFile (file) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = e => {
        console.log(reader.result)
      }
      const vm = this
      reader.onprogress = e => {
        if (e.lengthComputable) {
          vm.trackProgress(e.loaded, e.total)
        }
      }
      reader.onloadend = e => {
        const { error } = e.target
        if (error != null) {
          switch (error.code) {
            case error.ENCODING_ERR:
              vm.error = 'Encoding error!'
              break
            case error.NOT_FOUND_ERR:
              vm.error = 'File not found!'
              break
            case error.NOT_READABLE_ERR:
              vm.error = 'File could not be read!'
              break
            case error.SECURITY_ERR:
              vm.error = 'Security issue with file!'
              break
            default:
              vm.error = 'I have no idea what\'s wrong!'
          }
        }
        vm.trackProgress(e.loaded, e.total)
      }
      reader.onload = e => {
        this.errorFile = false
        const { result } = e.target
        vm.file = result
        vm.name = file.name
        let formatFile = file.name.slice(file.name.indexOf('.'))
        if (formatFile !== '.amh') {
          this.errorFile = true
        }
        this.cryptoSeed = vm.file
        this.$root.$emit('crypto-seed-phrase', this.cryptoSeed)
      }
    },
    trackProgress (loaded, total) {
      this.progress = parseInt(((loaded / total) * 100), 10)
    },
    startDrag () {
      const { div } = this.$refs
      this.dragAndDropCapable = this.isDragAndDropCapable()
      if (this.dragAndDropCapable) {
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(event => {
          document.body.addEventListener(event, e => {
            e.preventDefault()
            e.stopPropagation()
          })
        })
        div.addEventListener('drop', e => {
          this.onFileChange(e)
        })
      }
    },
    removeFile () {
      this.errorFile = false
      this.progress = 0
      this.file = ''
      this.name = null
      this.cryptoSeed = ''
      this.startDrag()
    }
  },
  mounted () {
    this.startDrag()
  }
}
</script>

<style scoped lang="scss">
  input[type="file"] {
    display: none;
  }

  strong,
  svg {
    vertical-align: middle;
  }

  .wrapper-drag {
    width: 380px;
    height: 100px;
    border: 1px dotted black;
    border-radius: 5px;

    &:hover {
      background-color: #efefef;
    }
  }

  .delete-svg {
    right: 20%;
  }

  .custom-button {
    border-radius: 5px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
  }

  .custom_error {
    left: 15%;
    top: 41%;
  }
</style>
