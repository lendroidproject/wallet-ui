import { useState, useEffect } from 'react'
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

const MFT = styled.span`
  cursor: pointer;
  color: black;
  display: block;
  white-space: nowrap;
`

export default ({ data, onAction, onMFTAction, ...props }) => {
  const [showSetting, setShowSetting] = useState(false)
  const {
    currency,
    totalContributions,
    unusedContributions,
    outstandingPoolshare,
    // contributionsOpen,
    myUnwithdrawn,
    depositeRate,
    markets: {
      mfts: [lToken, ...mfts],
    },
  } = data

  const handleAction = slot => {
    setShowSetting(false)
    onAction(slot, data)
  }

  useEffect(() => {
    const handleClose = e => {
      if (
        e.target &&
        typeof e.target.className === 'string' &&
        e.target.className.includes('trigger')
      ) {
        return
      }
      setShowSetting(false)
    }
    document.body.addEventListener('click', handleClose)
    return () => document.body.removeEventListener('click', handleClose)
  })

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
            <div className="actions trigger">
              <div className="action disabled trigger">
                <img src={edit} /> Edit
              </div>
              <div
                className="action trigger"
                onClick={() => handleAction('close')}
              >
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
                <span>
                  {lToken.rate.toFixed(2)} {lToken.name.replace(/_/gi, '')}
                </span>
                {mfts.map((mft, idx) => (
                  <MFT key={idx} onClick={() => onMFTAction(mft)}>
                    {mft.rate.toFixed(2)} {mft.name.replace(/_/gi, '')}
                  </MFT>
                ))}
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
