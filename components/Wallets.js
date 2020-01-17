import { useState } from 'react'
import styled from 'styled-components'
import Table from '~/components/common/Table'
import Modal from '~/components/common/Modal'

const Wrapper = styled.div`
  height: 100vh;
  max-height: 100vh;
  overflow: auto;
  width: 100%;

  .accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
  }

  .active,
  .accordion:hover {
    background-color: #ccc;
  }

  .panel {
    display: none;
    background-color: white;
    overflow: hidden;
    padding: 15px;
    text-align: center;

    &.active {
      display: block;
    }
  }
`

const tabs = [
  {
    value: 'tokens',
    label: 'Tokens',
    filter: ({ token }) => !token.includes('_'),
  },
  {
    value: 'wrappedTokens',
    label: 'Wrapped Tokens',
    filter: ({ token }) => token.includes('L_'),
  },
  {
    value: 'sufiTokens',
    label: 'SUFI Tokens',
    filter: ({ token, balance }) =>
      (token.includes('S_') ||
        token.includes('F_') ||
        token.includes('U_') ||
        token.includes('I_')) &&
      balance >= 0,
    sort: ({ token: t1 }, { token: t2 }) =>
      Number(t1.split('_')[2]) - Number(t2.split('_')[2]),
  },
  { value: 'poolshareTokens', label: 'Poolshare Tokens' },
]

const headers = {
  tokens: [
    {
      label: 'Name',
      key: 'token',
      style: { textAlign: 'left' },
    },
    {
      label: 'Balance',
      key: 'balance',
      precision: 3,
    },
  ],
  wrappedTokens: [
    {
      label: 'Name',
      key: '',
      access: ({ name, token: val }) => name || val.split('_')[1],
      style: { textAlign: 'left' },
    },
    {
      label: 'Balance',
      key: 'balance',
      precision: 3,
    },
  ],
  sufiTokens: [
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
  ],
  poolshareTokens: [
    {
      label: 'Name',
      key: 'symbol',
      style: { textAlign: 'left' },
    },
    {
      label: 'Balance',
      key: 'balance',
      precision: 3,
    },
  ],
}

const actions = {
  tokens: [
    {
      label: 'Transfer',
      slot: 'transfer',
      visible: ({ balance, allowance }) => Number(balance) && Number(allowance),
    },
    {
      label: 'Wrap',
      slot: 'wrap',
      visible: ({ balance, allowance }) => Number(balance) && Number(allowance),
    },
    {
      label: 'Unlock',
      slot: 'wrap',
      visible: ({ allowance }) => !Number(allowance),
    },
  ],
  wrappedTokens: [
    {
      label: 'Transfer',
      slot: 'transfer',
      visible: ({ balance }) => Number(balance),
    },
    {
      label: 'Unwrap',
      slot: 'unwrap',
      visible: ({ balance }) => Number(balance),
    },
    {
      label: 'Split',
      slot: 'split',
      visible: ({ balance }) => Number(balance),
    },
    {
      label: 'Contribute',
      slot: 'contribute',
      visible: ({ balance }) => Number(balance),
    },
  ],
  sufiTokens: [
    {
      label: 'Transfer',
      slot: 'transfer',
    },
    {
      label: 'Borrow',
      slot: 'borrow',
    },
    {
      label: 'Fuse',
      slot: 'fuse',
      visible: ({ balance }) => Number(balance),
    },
    {
      label: 'Exercise',
      slot: 'excercise',
      visible: ({ underlying }) => !!underlying,
    },
  ],
  poolshareTokens: [
    {
      label: 'Transfer',
      slot: 'transfer',
    },
    {
      label: 'Withdraw',
      slot: 'withdraw',
    },
  ],
}

const enumSlots = {
  wrap: 1,
  unwrap: 1,
  withdraw: 1,
  split: 2,
  fuse: 3,
}

const formFields = {
  1: defaults => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        type: 'number',
        autoFocus: true,
      },
    ],
    defaults,
  }),
  2: (defaults, options = {}) => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        type: 'number',
        autoFocus: true,
      },
      {
        key: 'expiry',
        label: 'Expiry',
        required: ({ expiry }) => !!expiry,
        type: 'select',
        options: options.expiries,
        noNoneValue: true,
        valueKey: 'name',
        labelValue: ({ name, date }) => `${name} (${date})`,
      },
      {
        key: 'underlying',
        label: 'Underlying',
        required: ({ underlying, strike }) =>
          (underlying && Number(strike)) || (!underlying && !Number(strike)),
        type: 'select',
        options: options.underlying,
      },
      {
        key: 'strike',
        label: 'Strike Price',
        required: ({ underlying, strike }) =>
          (underlying && Number(strike)) || (!underlying && !Number(strike)),
        type: 'number',
      },
    ],
    defaults,
  }),
  3: (defaults, options) => ({
    fields: [
      {
        key: 'token',
        label: 'Fuse Token',
        type: 'select',
        options: options.tokens,
        noNoneValue: true,
        labelValue: ({ token }) =>
          token
            .replace('S_', '')
            .replace('F_', '')
            .replace(/_-/gi, ''),
        onUpdate: ({ token, balance }, { form, setForm }) => {
          setForm({
            ...form,
            amount: balance,
            expiry: token.split('_')[2],
            underlying: token.split('_')[3].replace('-', ''),
            strike: token.split('_')[4].replace('-', '0'),
          })
        },
        hidden: options.tokens.length <= 1,
      },
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        type: 'number',
        autoFocus: true,
      },
      {
        key: 'expiry',
        label: 'Expiry',
        type: 'text',
        disabled: true,
      },
      {
        key: 'underlying',
        label: 'Underlying',
        type: 'text',
        disabled: true,
      },
      {
        key: 'strike',
        label: 'Strike Price',
        type: 'number',
        disabled: true,
      },
    ],
    defaults,
  }),
}

function Wallets({
  library,
  supportTokens,
  riskFreePools = [],
  riskyPools = [],
}) {
  const { expiries } = library.contracts || {}
  const [active, setActive] = useState('tokens')
  const [modal, setModal] = useState(null)
  const originTokens = supportTokens
    .filter(({ token }) => !token.includes('_'))
    .map(({ token }) => token)
  const poolShareTokens = [
    ...riskFreePools.map(({ id, poolShareToken }) => ({
      riskFree: true,
      id,
      ...poolShareToken,
    })),
    ...riskyPools.map(({ id, poolShareToken }) => ({
      riskFree: false,
      id,
      ...poolShareToken,
    })),
  ]

  const handleModal = form => {
    const { token, slot } = modal
    switch (slot) {
      case 'wrap': {
        const { amount } = form
        library.contracts.onWrap(token, amount).then(() => {
          library.contracts.getBalances()
          setModal(null)
        })
        break
      }
      case 'unwrap': {
        const { amount } = form
        library.contracts.onUnwrap(token, amount).then(() => {
          library.contracts.getBalances()
          setModal(null)
        })
        break
      }
      case 'split': {
        const { amount, expiry, underlying, strike } = form
        library.contracts
          .onSplit(token, {
            amount,
            expiry,
            underlying,
            strike: Number(strike),
          })
          .then(() => {
            library.contracts.getBalances(true)
            setModal(null)
          })
        break
      }
      case 'fuse': {
        const { amount, expiry, underlying, strike } = form
        library.contracts
          .onFuse(token, {
            amount,
            expiry,
            underlying,
            strike: Number(strike),
          })
          .then(() => {
            library.contracts.getBalances()
            setModal(null)
          })
        break
      }
      case 'withdraw': {
        const { poolId, riskFree } = modal
        const { amount } = form
        library.contracts
          .onWithdrawContribute(poolId, amount, { riskFree: !riskFree })
          .then(() => {
            if (riskFree) {
              library.contracts.fetchRiskFreePools()
            } else {
              library.contracts.getRiskyPools()
            }
            library.contracts.getBalances()
            setModal(null)
          })
        break
      }
      default:
        console.log(modal, form)
        break
    }
  }

  const handleAction = async (value, slot, data) => {
    switch (slot) {
      case 'wrap': {
        const { token } = data
        const { contracts, address, web3Utils } = library.contracts
        if (contracts[token]) {
          contracts[token].methods
            .allowance(address, contracts.CurrencyDao._address)
            .call()
            .then(value => {
              if (Number(value) === 0) {
                contracts[token].methods
                  .approve(
                    contracts.CurrencyDao._address,
                    web3Utils.toWei(data.balance)
                  )
                  .send({ from: address })
                  .then(() => library.contracts.getBalances())
              } else {
                setModal({
                  slot,
                  token,
                  data: formFields[enumSlots[slot]]({ amount: data.balance }),
                })
              }
            })
        }
        break
      }
      case 'unwrap': {
        const token = data.token.replace('L_', '')
        const { contracts, address, web3Utils } = library.contracts
        if (contracts[token]) {
          contracts[token].methods
            .allowance(address, contracts.CurrencyDao._address)
            .call()
            .then(value => {
              if (Number(value) === 0) {
                contracts[token].methods
                  .approve(contracts.CurrencyDao._address, web3Utils.toWei(1000))
                  .send({ from: address })
                  .then(() => library.contracts.getBalances())
              } else {
                setModal({
                  slot,
                  token,
                  data: formFields[enumSlots[slot]]({ amount: data.balance }),
                })
              }
            })
        }
        break
      }
      case 'split': {
        const token = data.token.replace('L_', '')
        setModal({
          slot,
          token,
          data: formFields[enumSlots[slot]](
            {
              amount: data.balance,
              expiry: expiries[0].timestamp,
              strike: '0',
            },
            {
              underlying: originTokens.filter(t => t !== token && t !== 'LST'),
              expiries,
            }
          ),
        })
        break
      }
      case 'fuse': {
        const tokens = supportTokens.filter(
          ({ token, balance }) =>
            (token.includes(
              `S_${data.token.split('_')[1]}_${data.token.split('_')[2]}`
            ) ||
              token.includes(
                `F_${data.token.split('_')[1]}_${data.token.split('_')[2]}`
              )) &&
            Number(balance) > 0
        )
        let defaultData = data
        if (!data.token.split('_')[3].replace('-', '')) {
          defaultData = tokens[0]
        }
        setModal({
          slot,
          token: data.token,
          data: formFields[enumSlots[slot]](
            {
              amount: defaultData.balance,
              expiry: defaultData.token.split('_')[2],
              underlying: defaultData.token.split('_')[3].replace('-', ''),
              strike: defaultData.token.split('_')[4].replace('-', ''),
            },
            {
              tokens,
            }
          ),
        })
        break
      }
      case 'withdraw': {
        const { id: poolId, name, poolShareBalance, riskFree } = data
        setModal({
          slot,
          poolId,
          riskFree,
          title: `Withdraw from ${name}`,
          data: formFields[enumSlots.withdraw]({
            amount: poolShareBalance,
          }),
        })
        break
      }
      default:
        console.log(value, slot, data)
    }
  }

  return (
    <Wrapper>
      {tabs.map(({ value, label, filter, sort }) => {
        const data = value === 'poolshareTokens' ? poolShareTokens : supportTokens
        return (
          <div key={value}>
            <button
              className={`accordion ${active === value ? 'active' : ''}`}
              onClick={() => setActive(value)}
            >
              {label}
            </button>
            <div className={`panel ${active === value ? 'active' : ''}`}>
              <Table
                headers={headers[value] || []}
                data={filter ? data.filter(filter) : data}
                sort={sort}
                actions={actions[value] || []}
                onAction={(slot, data) => handleAction(value, slot, data)}
              />
            </div>
          </div>
        )
      })}
      {!!modal && (
        <Modal
          title={modal.title || 'Input Fields'}
          {...modal.data}
          onSubmit={handleModal}
          onClose={() => setModal(null)}
        />
      )}
    </Wrapper>
  )
}

export default Wallets
