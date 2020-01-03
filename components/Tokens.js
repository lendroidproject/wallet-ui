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

    &.active {
      display: block;
    }
  }
`

const tokens = [
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
      access: val => new Date(val.split('_')[2] * 1000).getFullYear(),
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
      key: 'token',
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
    },
    {
      label: 'Wrap',
      slot: 'wrap',
      visible: ({ balance }) => balance > 0,
    },
  ],
  wrappedTokens: [
    {
      label: 'Transfer',
      slot: 'transfer',
    },
    {
      label: 'Unwrap',
      slot: 'unwrap',
      visible: ({ balance }) => balance > 0,
    },
    {
      label: 'Split',
      slot: 'split',
      visible: ({ balance }) => balance > 0,
    },
    {
      label: 'Contribute',
      slot: 'contribute',
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
      visible: ({ balance }) => balance > 0,
    },
    {
      label: 'Exercise',
      slot: 'excercise',
      visible: ({ underlying }) => !!underlying,
    },
  ],
}

const enumSlots = {
  wrap: 1,
  unwrap: 1,
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
      },
      {
        key: 'expiry',
        label: 'Expiry',
        required: ({ expiry }) => !!expiry,
        type: 'datetime-local',
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
  3: defaults => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        type: 'number',
      },
      {
        key: 'expiry',
        label: 'Expiry',
        type: 'datetime-local',
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

function toDateTime(date) {
  return new Date(date).toISOString().split('.')[0]
}

function getEOY() {
  return new Date(`${new Date().getFullYear()}-12-31`).toISOString().split('.')[0]
}

function Tokens({ library, supportTokens }) {
  const [active, setActive] = useState('tokens')
  const [modal, setModal] = useState(null)
  const originTokens = supportTokens
    .filter(({ token }) => !token.includes('_'))
    .map(({ token }) => token)
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
            expiry: Math.round(new Date(expiry).getTime() / 1000),
            underlying,
            strike: Number(strike),
          })
          .then(() => {
            library.contracts.getBalances()
            setModal(null)
          })
        break
      }
      case 'fuse': {
        const { amount, expiry, underlying, strike } = form
        library.contracts
          .onFuse(token, {
            amount,
            expiry: Math.round(new Date(expiry).getTime() / 1000),
            underlying,
            strike: Number(strike),
          })
          .then(() => {
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
                  .approve(contracts.CurrencyDao._address, web3Utils.toWei(1000))
                  .send({ from: address })
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
              expiry: getEOY(),
              strike: '0',
            },
            {
              underlying: originTokens.filter(t => t !== token),
            }
          ),
        })
        break
      }
      case 'fuse': {
        setModal({
          slot,
          token: data.token,
          data: formFields[enumSlots[slot]]({
            amount: data.balance,
            expiry: toDateTime(data.token.split('_')[2] * 1000),
            underlying: data.token.split('_')[3].replace('-', ''),
            strike: data.token.split('_')[4].replace('-', ''),
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
      {tokens.map(({ value, label, filter }) => (
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
              data={filter ? supportTokens.filter(filter) : supportTokens}
              actions={actions[value] || []}
              onAction={(slot, data) =>
                handleAction(
                  value,
                  slot,
                  data,
                  filter ? supportTokens.filter(filter) : supportTokens
                )
              }
            />
          </div>
        </div>
      ))}
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

export default Tokens
