import { useState } from 'react'
import styled from 'styled-components'
import Card, { Header, Content, Footer, Action } from '~/components/common/Card'

import setting from '~/components/assets/images/icons/setting.svg'
import edit from '~/components/assets/images/icons/edit.svg'
import trash from '~/components/assets/images/icons/trash.svg'
import offerTokens from '~/components/assets/images/icons/offer_tokens.svg'
import withdrawEarnings from '~/components/assets/images/icons/withdraw_earnings.svg'

const PoolName = styled.div`
  display: flex;
  align-items: center;

  font-weight: bold;
  font-size: 16px;
  text-transform: capitalize;
  color: #212121;

  .symbol {
    background: #ffffff;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
    border-radius: 10px;

    width: 30px;
    height: 30px;

    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 7px;

    font-size: 10px;
    color: #12265e;
  }
`

export default ({ data, onAction, ...props }) => {
  const [showSetting, setShowSetting] = useState(false)
  const {
    currency,
    totalContributions,
    unusedContributions,
    outstandingPoolshare,
    // contributionsOpen,
    myUnwithdrawn,
    depositeRate,
    markets: { mfts },
  } = data

  const handleAction = slot => {
    setShowSetting(false)
    onAction(slot, data)
  }

  return (
    <Card {...props}>
      <Header>
        <div className="bg" />
        <PoolName>
          <div className="symbol">{data.name.substr(0, 3).toUpperCase()}</div>
          {data.name}
        </PoolName>
        <Action>
          <img src={setting} onClick={() => setShowSetting(!showSetting)} />
          {showSetting && (
            <div className="actions">
              <div className="action disabled">
                <img src={edit} /> Edit
              </div>
              <div className="action" onClick={() => handleAction('close')}>
                <img src={trash} /> Delete
              </div>
            </div>
          )}
        </Action>
      </Header>
      <Content>
        <table>
          <tbody>
            <tr>
              <td>Total Contribution</td>
              <td className="main">
                {totalContributions.toFixed(4)} {currency}
              </td>
            </tr>
            <tr>
              <td>Unused Contribution</td>
              <td className="main">
                {unusedContributions.toFixed(4)} {currency}
              </td>
            </tr>
            <tr>
              <td>Outstanding Pool Share</td>
              <td className="main">
                {outstandingPoolshare} {currency}
              </td>
            </tr>
            <tr>
              <td>My Unwithdrawn</td>
              <td className="main">
                {myUnwithdrawn} {currency}
              </td>
            </tr>
            <tr>
              <td>Deposite Rate</td>
              <td className="main">
                {depositeRate ? (1 / depositeRate).toFixed(2) : 0}
              </td>
            </tr>
            <tr>
              <td>Withdrawal Rate</td>
              <td className="main">
                {mfts
                  .map(
                    ({ name, rate }) =>
                      `${rate.toFixed(2)} ${name.replace(/_/gi, '')}`
                  )
                  .join(', ')}
              </td>
            </tr>
          </tbody>
        </table>
      </Content>
      <Footer>
        <div
          className="action"
          style={{
            color: '#F7931A',
          }}
          onClick={() => onAction('offer', data)}
        >
          <img src={offerTokens} />
          Offer Tokens
        </div>
        {Number(myUnwithdrawn) > 0 && (
          <div
            className="action"
            style={{
              color: '#46BB9D',
            }}
            onClick={() => onAction('offer', data)}
          >
            <img src={withdrawEarnings} />
            Withdraw Earnings
          </div>
        )}
      </Footer>
    </Card>
  )
}
