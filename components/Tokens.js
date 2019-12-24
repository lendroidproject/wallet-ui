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
    padding: 0 18px;
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
  { value: 'wrapped-tokens', label: 'Wrapped Tokens' },
  { value: 'sufi-tokens', label: 'SUFI Tokens' },
  { value: 'poolshare-tokens', label: 'Poolshare Tokens' },
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
}

function Tokens() {
  const [active, setActive] = useState('tokens')

  const handleAction = (value, slot, data) => {
    console.log(value, slot, data)
  }

  return (
    <Wrapper>
      {tokens.map(({ value, label }) => (
        <>
          <button
            className={`accordion ${active === value ? 'active' : ''}`}
            onClick={() => setActive(value)}
          >
            {label}
          </button>
          <div className={`panel ${active === value ? 'active' : ''}`}>
            <Table
              headers={headers[value] || []}
              data={[]}
              actions={actions[value] || []}
              onAction={(slot, data) => handleAction(value, slot, data)}
            />
          </div>
        </>
      ))}
    </Wrapper>
  )
}

export default Tokens
