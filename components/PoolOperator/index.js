import { useState } from 'react'
import styled from 'styled-components'

import { RegisterPoolName } from './tabs'

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
    value: 'riskFree',
    label: 'My Risk-Free Pools',
    Content: () => <div>Coming soon...</div>,
  },
  {
    value: 'risky',
    label: 'My Risky Pools',
    Content: () => <div>Coming soon...</div>,
  },
  {
    value: 'newPool',
    label: 'New Pool',
    Content: () => <div>Coming soon...</div>,
  },
  {
    value: 'register',
    label: 'Register Pool Name',
    Content: RegisterPoolName,
  },
]

function PoolOperator({ library, ...props }) {
  const [active, setActive] = useState('register')

  return (
    <Wrapper>
      {library.contracts ? (
        tabs.map(({ value, label, Content }) => (
          <div key={value}>
            <button
              className={`accordion ${active === value ? 'active' : ''}`}
              onClick={() => setActive(value)}
            >
              {label}
            </button>
            <div className={`panel ${active === value ? 'active' : ''}`}>
              <Content library={library} {...props} />
            </div>
          </div>
        ))
      ) : (
        <div className="loading">Loading...</div>
      )}
    </Wrapper>
  )
}

export default PoolOperator
