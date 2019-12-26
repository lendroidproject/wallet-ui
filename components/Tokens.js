import { useState } from 'react'
import styled from 'styled-components'
import Table from '~/components/common/Table'

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
      key: 'underlying',
    },
    {
      label: 'Strike',
      key: 'strike',
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

function Tokens({ library, supportTokens }) {
  const [active, setActive] = useState('tokens')

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
                const amount = prompt('Please enter your amount', 1)
                if (amount) {
                  library.contracts.onWrap(token, amount).then(() => {
                    alert('Wrapped!')
                    library.contracts.getBalances()
                  })
                }
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
                const amount = prompt('Please enter your amount', 1)
                if (amount) {
                  library.contracts.onUnwrap(token, amount).then(() => {
                    alert('Unwrapped!')
                    library.contracts.getBalances()
                  })
                }
              }
            })
        }
        break
      }
      case 'split': {
        const token = data.token.replace('L_', '')
        const { contracts } = library.contracts
        if (contracts[token]) {
          const amount = prompt('Please enter your amount', 1)
          if (amount) {
            library.contracts.onSplit(token, amount).then(() => {
              alert('Splitted!')
              library.contracts.getBalances()
            })
          }
        }
        break
      }
      case 'fuse': {
        const token = data.token.split('_')[1]
        const { contracts } = library.contracts
        if (contracts[token]) {
          const amount = prompt('Please enter your amount', 1)
          if (amount) {
            library.contracts.onFuse(data.token, amount).then(() => {
              alert('Fused!')
              library.contracts.getBalances()
            })
          }
        }
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
              onAction={(slot, data) => handleAction(value, slot, data)}
            />
          </div>
        </div>
      ))}
    </Wrapper>
  )
}

export default Tokens
