import { useState } from 'react'
import styled from 'styled-components'

import { MyLoans, NewLoan } from './tabs'

const Wrapper = styled.div`
  .accordion {
    color: #444;
    padding: 24px 28px 16px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;

    font-weight: bold;
    font-size: 16px;
    line-height: 25px;
    color: #12161e;

    display: flex;
    align-items: center;

    span {
      font-size: 12px;
      line-height: 18px;
      color: #808080;
      text-transform: capitalize;
      font-weight: normal;
    }

    .icon {
      background: #ffffff;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }
  }

  .panel {
    padding: 0 28px;
  }
`

const tabs = [
  {
    value: 'loans',
    label: 'My Loans',
    Content: MyLoans,
  },
  {
    value: 'newLoan',
    label: 'New Loan',
    Content: NewLoan,
  },
]

export default function({ library, ...props }) {
  const [active, setActive] = useState('newLoan')

  return (
    <Wrapper>
      {library.contracts ? (
        tabs.map(({ value, label, Content }) => (
          <div key={value}>
            <div
              className={`accordion ${active === value ? 'active' : ''}`}
              onClick={() => setActive(value)}
            >
              {label}
            </div>
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
