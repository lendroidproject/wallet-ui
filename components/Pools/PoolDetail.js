import { useState } from 'react'
import styled from 'styled-components'
import Accordion from '~/components/common/Accordion'
import Modal from '~/components/common/Modal'
import { Actions } from '~/components/common/Form'
import Button from '~/components/common/Button'
import { getDisplayData } from '~/components/common/Table'
import List from '~/components/common/List'

import search from '~/components/assets/images/icons/search.svg'
import withdraw from '~/components/assets/images/icons/withdraw.svg'
import SUFITokens from '~/components/assets/images/icons/SUFI_Tokens.svg'

import { Item } from './PoolList'
import SplittedItem from '../Wallets/components/SplittedItem'

const Detail = styled(Item)`
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(18px);
  position: relative;
  padding: 12px 0;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.3;

    background: linear-gradient(
      187.32deg,
      #53dbff 11.72%,
      #57de87 58.97%,
      #f6b844 85.98%
    );
  }

  .field {
    width: 100%;
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: #212121;
    padding: 0px 20px;

    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }

    p {
      font-weight: normal;
      font-size: 12px;
      color: #7a7a7a;
      margin-top: 0;
    }
  }
`

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

const sufiTokens = [
  {
    label: 'T',
    key: 'token',
    access: val => val.split('_')[0],
    style: { textAlign: 'left' },
  },
  {
    label: 'Name',
    key: 'token',
    access: val => val.split('_')[1],
    style: { textAlign: 'left' },
  },
  {
    label: 'Expiry',
    key: 'token',
    access: val => val.split('_')[2],
  },
  {
    label: 'Underlying',
    key: 'token',
    access: val => val.split('_')[3],
  },
  {
    label: 'Strike',
    key: 'strike',
    key: 'token',
    access: val => val.split('_')[4],
  },
  {
    label: 'Balance',
    key: 'balance',
    precision: 3,
  },
]

export default function({
  id,
  supportTokens,
  library,
  riskFree,
  riskFreePools,
  riskyPools,
}) {
  const [modal, setModal] = useState(null)
  const { expiries } = library.contracts || {}

  const fetchPools = () => {
    if (riskFree) {
      library.contracts.getRiskFreePools()
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
          .onContribute(poolId, amount, { riskFree })
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
      label: 'Available Pool Share Tokens',
      key: 'poolShareBalance',
    },
    {
      label: 'Deposite Rate',
      key: '',
      access: ({ currency, depositeRate: val }) =>
        `${val ? (1 / val).toFixed(2) : 0} ${currency}`,
    },
    {
      label: 'Fee',
      key: '',
      access: ({ feePercentI, feePercentS }) => (
        <>
          {feePercentI} % (I)
          {!!Number(feePercentS) && <span>, {feePercentS} % (S)</span>}
        </>
      ),
    },
    {
      label: 'Total Contribution',
      key: '',
      access: ({ currency, totalContributions: val }) =>
        `${val.toFixed(4)} ${currency}`,
    },
    {
      label: 'Utilization',
      key: 'utilization',
      access: val => `${(val * 100).toFixed(2)} %`,
    },
  ]

  const origin = (riskFree ? riskFreePools : riskyPools) || []
  const data = origin.find(({ id: poolId }) => poolId === id)
  if (!data) return <div className="loading">Loading...</div>
  console.log(supportTokens, data)

  return (
    <Accordion>
      <div className={`accordion with-actions`}>
        <div className="label">
          <div className="icon">{data.name.substr(0, 3)}</div>
          {data.name}
        </div>
      </div>
      <div className={`panel`}>
        <Detail>
          <div className="bg" />
          {headers.map((h, hIndex) => (
            <div
              className={`field ${h.main ? 'main' : ''}`}
              key={hIndex}
              style={h.style}
            >
              <p>{h.label}</p>
              {getDisplayData(data, h)}
            </div>
          ))}
        </Detail>
      </div>
      <div className={`accordion`}>
        <div className="icon">
          <img src={SUFITokens} />
        </div>
        SUFI Tokens
      </div>
      <div className={`panel`}>
        <List
          headers={sufiTokens}
          data={data.markets.mfts
            .map(({ name, offered }) => ({ token: name, balance: offered }))
            .filter(
              ({ token, balance }) =>
                (token.includes('S_') ||
                  token.includes('F_') ||
                  token.includes('U_') ||
                  token.includes('I_')) &&
                balance >= 0
            )}
          render={SplittedItem}
          itemProps={{ expiries }}
        />
        <Actions>
          <Button type="button" onClick={() => handleAction('contribute', data)}>
            <img src={search} />
            Contribute
          </Button>
          <Button
            type="button"
            className="secondary border"
            onClick={() => handleAction('withdraw', data)}
          >
            <img src={withdraw} />
            Withdraw
          </Button>
        </Actions>
      </div>
      {!!modal && (
        <Modal
          title={modal.title || 'Input Fields'}
          subTitle={modal.subTitle}
          {...modal.data}
          onSubmit={handleModal}
          onClose={() => setModal(null)}
        />
      )}
    </Accordion>
  )
}
