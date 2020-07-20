<template>
  <div class="transaction-main-info block-details-bitcoin-family">
    <div class="transaction-main-info__block">
      <div class="transaction-main-info__block-item"><span>{{ $t('explorer.height') }}</span>
          {{ blockInformation.height }}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('block_explorer.weight') }}</span>
          {{blockInformation.weight}}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('explorer.size') }}</span>
        {{blockInformation.size}}
      </div>
    </div>

    <div class="transaction-main-info__block">

      <div class="transaction-main-info__block-item"><span>{{ $t('explorer.tx_count') }}</span>
          {{blockInformation.transactionCount}}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('block_explorer.avg_fee_per_tx') }}</span>
          {{blockInformation.avgFeePerTx}}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('explorer.total_output') }}</span>
          {{blockInformation.outputTotal}}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('block_explorer.tx_fees') }}</span>
          {{blockInformation.totalTxFee}}
      </div>
    </div>
    <div class="transaction-main-info__block">
      <div class="transaction-main-info__block-item"><span>{{ $t('explorer.block_reward') }}</span>
          {{blockInformation.reward}}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('explorer.difficulty') }}</span>
        {{blockInformation.difficulty}}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('block_explorer.mined_by') }}</span>
          {{blockInformation.minerAddress}}
      </div>
      <div class="transaction-main-info__block-item"><span>{{ $t('block_explorer.time') }}</span>
          {{blockInformation.timestamp | formatDate}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    blockInformation: { type: Object, required: true, default: () => {} }
  }
}
</script>
