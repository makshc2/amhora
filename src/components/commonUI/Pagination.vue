<template>
  <div class="pagination-wrapper">
    <Paginate
      ref="paginate"
      v-show="totalPages !== 1 || currentPage > totalPages"
      :page-count="totalPages"
      :page-range="5"
      :margin-pages="2"

      :force-page="currentPage"
      :click-handler="selectPage"
      :container-class="'pagination'"
      break-view-text="..."
      :page-class="'page-item'"
      :prev-class="'controller-button_prev'"
      :next-class="'controller-button_next'"
      :hide-prev-next="false"
    >
    </Paginate>
    <div class="pagination-hint" v-if="showedRecords && recordsCount">
      showing {{showedRecords}} of {{recordsCount}}
    </div>
  </div>
</template>
<script>
import Paginate from 'vuejs-paginate'
export default {
  name: 'PaginationComponent',
  components: { Paginate },
  props: {
    totalPages: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1
    },
    selectPage: {
      type: Function,
      required: true
    },
    showedRecords: {
      type: Number,
      required: false
    },
    recordsCount: {
      type: Number,
      required: false
    }
  },
  watch: {
    currentPage () {
      this.$nextTick(() => {
        this.$refs.paginate.$data.innerValue = this.currentPage
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.paginate.$data.innerValue = this.currentPage
    })
  }
}
</script>

<style lang="scss">
  .pagination-wrapper{
    display: flex;
    width: 100%;
    align-items: center;
    margin-top: 25px;
    position: relative;

    .pagination-hint {
      position: absolute;
      left: 100px;
      bottom: 0;
      height: 100%;
      color: #41464a70;
      display: flex;
      align-items: center;
    }
  }
  .pagination {
    width: 100%;
    align-items: center;
    justify-content: center;
    li.page-item{
      height: auto;
      &:first-child{
        margin-left: auto;
      }
      &:last-child{
        margin-right: auto;
      }
    }
    li.page-item a{
      background-color: transparent;
      border: none;
      letter-spacing: 0.32px;
      font-size: 15px;
      font-weight: 800;
      color: #41464a50;
      padding: 5px;
      margin: 0 3px;

    }

    li.page-item.active a{
      color: #41464a;
    }

    li.controller-button_prev a,
    li.controller-button_next a{
      padding: 13px 26px;
      border-radius: 2px;
      background-color: #41464a;
      color: #ffffff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: none;
    }
    li.controller-button_prev{
      margin-right: auto;
      &.disabled{
        opacity: 0;
        display: inline-block;
      }
    }
    li.controller-button_next{
      margin-left: auto;
      &.disabled{
        opacity: 0;
        display: inline-block;
      }
    }

    .page-item {
      border: none;
      background-color: transparent;
      transition: background-color 0.4s;
      &:hover:not(.disabled){
        background-color: #f6f6f6;
        border-radius: 3px;
      }
      &.disabled{
        display: inline-block;
        opacity: 1;
      }
    }
    .break-view-link-class{
      background-color: #2e2637;
    }
  }

</style>
