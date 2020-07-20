import Raven from 'raven-js'

export const SEND_LOGGS_TO_SENTRY = (error) => {
  if (error.error && error.error.code !== undefined) {
    const status = error.error.code === undefined ? 'Unknow' : error.error.code
    switch (status) {
      case 'invalid_address':
        Raven.setTagsContext({
          error_type: 'user error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Invalid address '), {
          logger: 'Amphora logger'
        })
        break
      case 'error_rpc':
        Raven.setTagsContext({
          error_type: 'server error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Server Error '), {
          logger: 'Amphora logger'
        })
        break
      case 'invalid_hash':
        Raven.setTagsContext({
          error_type: 'user error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Invalid hash '), {
          logger: 'Amphora logger'
        })

        break
      case 'not_found_hash':
        Raven.setTagsContext({
          error_type: 'context error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Not found hash '), {
          logger: 'Amphora logger'
        })

        break
      case 'invalid_tx_id':
        Raven.setTagsContext({
          error_type: 'context error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Invalid tx-id '), {
          logger: 'Amphora logger'
        })

        break
      case 'not_found_tx':
        Raven.setTagsContext({
          error_type: 'context error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Not found tx '), {
          logger: 'Amphora logger'
        })

        break
      case 'not_found_block':
        Raven.setTagsContext({
          error_type: 'context error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Not found block  '), {
          logger: 'Amphora logger'
        })

        break
      case 'invalid_block_hash':
        Raven.setTagsContext({
          error_type: 'user error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Invalid block hash '), {
          logger: 'Amphora logger'
        })

        break
      case 'invalid_block_index':
        Raven.setTagsContext({
          error_type: 'user error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Invalid block index '), {
          logger: 'Amphora logger'
        })

        break
      case 'Unknow':
        Raven.setTagsContext({
          error_type: 'Development error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Invalid block index '), {
          logger: 'Amphora logger'
        })
    }
  } else if (error.statusCode) {
    const status = error.statusCode
    switch (status) {
      case 404:
        Raven.setTagsContext({
          error_type: 'user error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Not found'), {
          logger: 'Amphora logger'
        })
        break
      case 400:
        Raven.setTagsContext({
          error_type: 'user error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Bad Request'), {
          logger: 'Amphora logger'
        })
        break
      case 302:
        Raven.setTagsContext({
          error_type: 'server error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Found'), {
          logger: 'Amphora logger'
        })
        break
      case 304:
        Raven.setTagsContext({
          error_type: 'server error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Not modified'), {
          logger: 'Amphora logger'
        })
        break
      case 403:
        Raven.setTagsContext({
          error_type: 'user error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Forbidden '), {
          logger: 'Amphora logger'
        })
        break
      case 500:
        Raven.setTagsContext({
          error_type: 'server error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Internal Server Error'), {
          logger: 'Amphora logger'
        })
        break
      case 502:
        Raven.setTagsContext({
          error_type: 'server error',
          id: Raven.lastEventId()
        })
        Raven.captureException(new Error('Bad Gatway'), {
          logger: 'Amphora logger'
        })
        break
    }
  }
}
