import { useState } from 'react'
import Table from '~/components/common/Table'
// import Modal from '~/components/common/Modal'

const headers = [
  {
    label: 'Pool',
    key: 'name',
  },
  {
    label: 'Total Contribution',
    key: '',
    access: ({ currency, totalContributions: val }) => `${val} ${currency}`,
  },
  {
    label: 'Unused Contribution',
    key: '',
    access: ({ currency, unusedContributions: val }) => `${val} ${currency}`,
  },
  {
    label: 'Outstanding Poolshare',
    key: 'outstandingPoolshare',
  },
  {
    label: 'Contributions open to',
    key: 'contributionsOpen',
    access: () => 'Only Me',
  },
  {
    label: 'My Unwithdrawn',
    key: '',
    access: ({ currency, myUnwithdrawn: val }) => `${val} ${currency}`,
  },
  {
    label: 'Deposite Rate',
    key: '',
    access: ({ currency, depositeRate: val }) =>
      `${val ? (1 / val).toFixed(2) : 0} ${currency}`,
  },
  {
    label: 'Withdrawal Rate',
    key: 'withdrawalRate',
  },
]

const actions = [
  {
    label: 'Offer New Token',
    slot: 'offer',
  },
  {
    label: 'Withdraw earnings',
    slot: 'withdraw',
    visible: ({ unusedContributions }) => unusedContributions > 0,
  },
  {
    label: 'Close Pool',
    slot: 'close',
  },
]

export default function MyPools({
  riskFree,
  riskFreePools,
  riskyPools,
  ...props
}) {
  const handleAction = (...args) => {
    console.log(args)
  }
  const data = (riskFree ? riskFreePools : riskyPools) || []

  return (
    <Table
      headers={headers}
      data={data}
      actions={actions}
      onAction={handleAction}
    />
  )
}
