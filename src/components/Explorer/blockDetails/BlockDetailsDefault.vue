<template>
  <div class="wrapper_crypto">
    <div class="transaction-main-info" v-if="blockInformation.currency === 'XMR'">
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.date') }}</span>
          <template v-if="blockInformation.record">
            {{ blockInformation.record.timestamp | formatDate }}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.height') }}</span>
          <template v-if="blockInformation.record">
            {{blockInformation.record.height}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.block_size') }}</span>
          <template v-if="blockInformation.record">
            {{blockInformation.record.blockSize}}
          </template>
        </div>
      </div>
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.block_reward') }}</span>
          <template v-if="blockInformation.record">
            {{blockInformation.record.reward}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.nonce') }}</span>
          <template v-if="blockInformation.record">
            {{blockInformation.record.nonce}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.fee') }}</span>
          <template v-if="blockInformation.record">
            {{blockInformation.record.fee}} {{blockInformation.currency}}
          </template>
        </div>
      </div>
      <div class="transaction-main-info__block transaction-main-info__block_3 ">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.transaction_tittle') }}</span>
          <template v-if="blockInformation.record">
            {{blockInformation.record.countTx}}
          </template>
        </div>
      </div>
    </div>
    <div class="transaction-main-info" v-else-if="blockInformation.currency === 'ETH'">
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.date') }}</span>
          <template v-if="blockInformation.record">
            {{ getTime(blockInformation.record.timestamp) }}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.total_output') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.totalAmount}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.transaction_tittle') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.txCount}}
          </template>
        </div>
      </div>
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.height') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.number}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.size') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.size}} bytes
          </template>
        </div>
        <div class="transaction-main-info__block-item mined-by">
          <span>{{ $t('explorer.mined_by') }}</span>
          <div>{{blockInformation.record.miner}}</div>

        </div>
        <div class="transaction-main-info__block-item">
          <span>{{ $t('explorer.gas_used') }}</span>
          {{blockInformation.record.gasUsed}} ({{blockInformation.record.gasUsedPercent}} %)
        </div>
      </div>
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item">
          <span>{{ $t('explorer.difficulty') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.difficulty}}
          </template>
        </div>
        <div class="transaction-main-info__block-item">
          <span>{{ $t('explorer.uncles_reward') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.uncleReward}}
          </template>
        </div>
        <div class="transaction-main-info__block-item">
          <span>{{ $t('explorer.block_reward') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.reward}}
          </template>
        </div>
        <div class="transaction-main-info__block-item">
          <span>{{ $t('explorer.gas_limit') }}</span>
          <template v-if="blockInformation">
            {{blockInformation.record.gasLimit}}
          </template>
        </div>
      </div>
    </div>
    <div class="transaction-main-info" v-else>
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.block_time') }}</span>
          <template v-if="blockInformation.blockTime">
            {{ blockInformation.blockTime | formatDate }}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.confirmations') }}</span>
          <template v-if="blockInformation.confirmations">
            {{blockInformation.confirmations}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.difficulty') }}</span>
          <template v-if="blockInformation.difficulty">
            {{blockInformation.difficulty}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.block_reward') }}</span>
          <template v-if="blockInformation.blockReward">
            {{blockInformation.blockReward}}
          </template>
        </div>
      </div>
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.nonce') }}</span>
          <template v-if="blockInformation.nonce">
            {{blockInformation.nonce}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.version') }}</span>
          <template v-if="blockInformation.version">
            {{blockInformation.version}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.tx_count') }}</span>
          <template v-if="blockInformation.transactionCount || blockInformation.record">
            {{blockInformation.record ? blockInformation.record.tx_count : blockInformation.transactionCount}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.size') }}</span>
          <template v-if="blockInformation.size">
            {{blockInformation.size}}
          </template>
        </div>
      </div>
      <div class="transaction-main-info__block">
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.average_transaction_volume') }}</span>
          <template v-if="blockInformation.averageTransactionVolume">
            {{blockInformation.averageTransactionVolume}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.mining_fees') }}</span>
          <template v-if="blockInformation.miningFees">
            {{blockInformation.miningFees}}
          </template>
        </div>
        <div class="transaction-main-info__block-item"><span>{{ $t('explorer.mining_fees') }}</span>
          <template v-if="blockInformation.miningFees">
            {{blockInformation.miningFees}}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: {
      blockInformation: {
        type: Object, required: true, default: () => {
        }
      }
    },
    methods: {
      getTime(time) {
        return moment.unix(time).format('MMMM DD, YYYY, HH:mm:se A')
      }
    }
  }
</script>

<style lang="scss">
  .wrapper_crypto {
    width: 100%;
  }

  .transaction-main-info__block_3 {
    /*border-left: 1px solid #97979740;*/
    border-right: 1px solid #97979740;
  }

  .mined-by {
    display: flex;
    justify-content: space-between;

  div {
    width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  }
</style>
