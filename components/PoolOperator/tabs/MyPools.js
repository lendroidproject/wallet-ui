import { useState } from 'react'
import styled from 'styled-components'
import Table from '~/components/common/Table'
import Modal from '~/components/common/Modal'

const Wrapper = styled.div`
  text-align: left;
`

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
    // visible: ({ unusedContributions }) => unusedContributions > 0,
  },
  {
    label: 'Close Pool',
    slot: 'close',
  },
]

const formFields = {
  offer: (defaults, options = {}) => ({
    fields: [
      {
        key: 'expiry',
        label: 'Expiry',
        required: ({ expiry }) => !!expiry,
        type: 'select',
        autoFocus: true,
        options: options.expiries,
        noNoneValue: true,
        valueKey: 'name',
        labelValue: ({ name, date }) => `${name} (${date})`,
      },
      ...(options.riskFree
        ? []
        : [
            {
              key: 'underlying',
              label: 'Underlying',
              required: ({ underlying, strike }) =>
                (underlying && Number(strike)) ||
                (!underlying && !Number(strike)),
              type: 'select',
              options: options.underlying,
            },
            {
              key: 'strike',
              label: 'Strike Price',
              required: ({ underlying, strike }) =>
                (underlying && Number(strike)) ||
                (!underlying && !Number(strike)),
              type: 'number',
            },
          ]),
      {
        key: 'iCostPerDay',
        label: 'I Cost per day',
        type: 'number',
      },
      ...(options.riskFree
        ? []
        : [
            {
              key: 'sCostPerDay',
              label: 'S Cost per day',
              type: 'number',
            },
          ]),
    ],
    defaults,
  }),
}

export default function MyPools({
  library,
  riskFree,
  riskFreePools,
  riskyPools,
}) {
  const { balanceTokens, expiries } = library.contracts
  const currencies = balanceTokens.filter(t => t !== 'LST')
  const data = (riskFree ? riskFreePools : riskyPools) || []
  const [modal, setModal] = useState(null)

  const fetchPools = () => {
    if (riskFree) {
      library.contracts.fetchRiskFreePools()
    } else {
      library.contracts.getRiskyPools()
    }
  }

  const handleModal = (form, callback) => {
    const { poolId, slot } = modal
    switch (slot) {
      case 'offer': {
        const { expiry, underlying, strike, ...info } = form
        library.contracts
          .onOfferNewToken(poolId, {
            expiry,
            underlying,
            strike: Number(strike),
            ...info,
          })
          .then(() => {
            fetchPools()
            setModal(null)
          })
          .catch(() => {
            if (callback) callback()
          })
        break
      }
      default:
        console.log(modal, form)
        break
    }
  }

  const handleAction = async (slot, data) => {
    switch (slot) {
      case 'offer': {
        const { id: poolId } = data
        setModal({
          slot,
          poolId,
          data: formFields.offer(
            {
              expiry: expiries[0].timestamp,
              strike: '0',
              iCostPerDay: 0.025,
              sCostPerDay: 0.05,
            },
            {
              underlying: currencies,
              expiries,
              riskFree,
            }
          ),
        })
        break
      }
      case 'withdraw': {
        const { id: poolId } = data
        library.contracts.onWithdrawEarnings(poolId, riskFree).then(() => {
          fetchPools()
        })
        break
      }
      case 'close': {
        const { id: poolId } = data
        library.contracts.onClosePool(poolId, riskFree).then(() => {
          fetchPools()
        })
        break
      }
      default:
        console.log(slot, data)
        break
    }
  }

  return (
    <Wrapper>
      <Table
        headers={headers}
        data={data}
        actions={actions}
        onAction={handleAction}
      />
      {!!modal && (
        <Modal
          title="Input Fields"
          {...modal.data}
          onSubmit={handleModal}
          onClose={() => setModal(null)}
        />
      )}
    </Wrapper>
  )
}
