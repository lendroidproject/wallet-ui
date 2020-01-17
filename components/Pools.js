import { useState } from 'react'
import styled from 'styled-components'
import Table from '~/components/common/Table'
import Modal from '~/components/common/Modal'

const Wrapper = styled.div`
  text-align: left;
  height: 100vh;
  max-height: 100vh;
  overflow: auto;
  width: 100%;
  padding: 15px;
`

const WithdrawalRate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  div {
    white-space: nowrap;

    &.mft {
      span {
        color: blue;
        cursor: pointer;
      }
    }
  }
`

const Fee = styled.div`
  p {
    white-space: nowrap;
  }
`

const actions = [
  {
    label: 'Contribute',
    slot: 'contribute',
  },
  {
    label: 'Withdraw Contribution',
    slot: 'withdraw',
  },
]

const formFields = {
  contribute: defaults => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        autoFocus: true,
      },
    ],
    defaults,
  }),
  withdraw: defaults => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        autoFocus: true,
      },
    ],
    defaults,
  }),
}

export default function Pools({
  supportTokens,
  library,
  riskFree,
  riskFreePools,
  riskyPools,
}) {
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
      case 'contribute': {
        const { amount } = form
        library.contracts
          .onContribute(poolId, amount, { riskFree: !riskFree })
          .then(() => {
            fetchPools()
            library.contracts.getBalances()
            setModal(null)
          })
          .catch(() => {
            if (callback) callback()
          })
        break
      }
      case 'withdraw': {
        const { amount } = form
        library.contracts
          .onWithdrawContribute(poolId, amount, { riskFree: !riskFree })
          .then(() => {
            fetchPools()
            library.contracts.getBalances()
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
      case 'contribute': {
        const { id: poolId, name, currency } = data
        const { balance = 0 } =
          supportTokens.find(({ token }) => token === `L_${currency}`) || {}
        console.log(
          supportTokens,
          currency,
          supportTokens.find(({ token }) => token === `L_${currency}`) || {}
        )
        setModal({
          slot,
          poolId,
          title: `Contribute to ${name}`,
          subTitle: `Purchase tokens for L${currency}?`,
          data: formFields.contribute({
            amount: balance,
          }),
        })
        break
      }
      case 'withdraw': {
        const {
          id: poolId,
          name,
          poolShareBalance,
          markets: { mfts },
        } = data
        const mftNames = mfts
          .map(({ name }) => name.replace(/_/gi, ''))
          .join(', ')
        setModal({
          slot,
          poolId,
          title: `Withdraw from ${name}`,
          subTitle: `Withdraw Poolshare tokens for ${mftNames}?`,
          data: formFields.withdraw({
            amount: poolShareBalance,
          }),
        })
        break
      }
      default:
        console.log(slot, data)
        break
    }
  }

  const headers = [
    {
      label: 'Pool',
      key: 'name',
    },
    {
      label: 'Poolshare Balance',
      key: 'poolShareBalance',
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
      render: ({
        markets: {
          mfts: [lToken, ...mfts],
        },
      }) => (
        <WithdrawalRate>
          <div>
            {lToken.rate.toFixed(2)} <span>{lToken.name}</span>
          </div>
          {mfts.map((mft, idx) => (
            <div className="mft" key={idx}>
              {mft.rate.toFixed(2)} {mft.name.replace(/_/gi, '')}
            </div>
          ))}
        </WithdrawalRate>
      ),
    },
    {
      label: 'Fee',
      key: '',
      access: ({ feePercentI, feePercentS }) => (
        <Fee>
          <p>{feePercentI} % (I)</p>
          {!!Number(feePercentS) && <p>{feePercentS} % (S)</p>}
        </Fee>
      ),
    },
    {
      label: 'Total Contribution',
      key: '',
      access: ({ currency, totalContributions: val }) => `${val.toFixed(4)} ${currency}`,
    },
    {
      label: 'Utilization',
      key: 'utilization',
      access: val => `${val.toFixed(2)} %`,
    },
    // {
    //   label: 'unusedContributions',
    //   key: '',
    //   access: ({ currency, unusedContributions: val }) => `${val} ${currency}`,
    // },
    // {
    //   label: 'outstandingPoolshare',
    //   key: 'outstandingPoolshare',
    // },
  ]

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
          title={modal.title || 'Input Fields'}
          subTitle={modal.subTitle}
          {...modal.data}
          onSubmit={handleModal}
          onClose={() => setModal(null)}
        />
      )}
    </Wrapper>
  )
}
