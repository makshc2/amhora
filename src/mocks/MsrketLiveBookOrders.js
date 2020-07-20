import moment from 'moment'

export default [
  {
    timestamp: moment().format('LTS'),
    type: 'ask',
    amount: 0.1
  },
  {
    timestamp: moment().format('LTS'),
    type: 'bid',
    amount: 0.15
  },
  {
    timestamp: moment().format('LTS'),
    type: 'ask',
    amount: 23
  },
  {
    timestamp: moment().format('LTS'),
    type: 'bid',
    amount: 7
  },
  {
    timestamp: moment().format('LTS'),
    type: 'ask',
    amount: 0.321
  },
  {
    timestamp: moment().format('LTS'),
    type: 'ask',
    amount: 0.74
  }
]
