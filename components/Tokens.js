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
  { value: 'tokens', label: 'Tokens' },
  { value: 'wrappedTokens', label: 'Wrapped Tokens' },
  { value: 'sufiTokens', label: 'SUFI Tokens' },
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
      key: 'token',
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
    },
    {
      label: 'Split',
      slot: 'split',
    },
    {
      label: 'Contribute',
      slot: 'contribute',
    },
  ],
}

function Tokens({ library, supportTokens }) {
  const [active, setActive] = useState('tokens')

  const handleAction = (value, slot, data) => {
    switch (slot) {
      case 'wrap': {
        const { token } = data
        const amount = prompt('Please enter your amount', 1)
        if (amount) {
          // library.contracts.onWrap(token, amount)
          console.log(library.address, token, amount, library.contracts, library)
          const {
            contracts: { [token]: Token, CurrencyDao },
            address,
          } = library.contracts
          CurrencyDao.methods.wrap(Token._address, amount).send({ from: address })
        }
        break
      }
      case 'unwrap': {
        const { token } = data
        const amount = prompt('Please enter your amount', 1)
        if (amount) {
          // library.contracts.onWrap(token, amount)
          console.log(library.address, token, amount, library.contracts, library)
          const {
            contracts: { [token]: Token, CurrencyDao },
            address,
          } = library.contracts
          CurrencyDao.methods
            .unwrap(Token._address, amount)
            .send({ from: address })
        }
        break
      }
      default:
        console.log(value, slot, data)
    }
  }

  return (
    <Wrapper>
      {tokens.map(({ value, label }) => (
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
              data={supportTokens}
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
