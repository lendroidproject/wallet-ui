import styled from 'styled-components'
import Card, { Header, Content, Footer, Action } from '~/components/common/Card'

import setting from '~/components/assets/images/icons/setting.svg'
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

export default ({ data, onAction, expiries, ...props }) => {
  const {
    id,
    name: origin,
    currency,
    underlying,
    expiry,
    currencyValue,
    underlyingValue,
    repaid,
    status,
  } = data
  const name = origin || `Loan ${id + 1}`

  return (
    <Card {...props}>
      <Header>
        <div className="bg" />
        <PoolName>
          <div className="symbol">{name.substr(0, 3).toUpperCase()}</div>
          {name}
        </PoolName>
        <Action>
          <img src={setting} />
        </Action>
      </Header>
      <Content>
        <table>
          <tbody>
            <tr>
              <td>Currency</td>
              <td className="main">
                {currencyValue} {currency}
              </td>
            </tr>
            <tr>
              <td>Underlying</td>
              <td className="main">
                {underlyingValue} {underlying}
              </td>
            </tr>
            <tr>
              <td>Due Date</td>
              <td className="main">
                {moment.unix(expiries.match[expiry]).format('D MMM, YY')}
              </td>
            </tr>
            {status !== 'closed' && (
              <tr>
                <td>Repaid</td>
                <td className="main">{repaid}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Content>
      <Footer>
        {status === 'active' && (
          <div
            className="action"
            style={{
              color: '#F7931A',
            }}
            onClick={() => onAction('repay', data)}
          >
            <img src={offerTokens} />
            Repay
          </div>
        )}
        {status.includes('liquid') && (
          <div
            className="action"
            style={{
              color: '#46BB9D',
            }}
            onClick={() => onAction('offer', data)}
          >
            <img src={withdrawEarnings} />
            Withdraw Collateral
          </div>
        )}
      </Footer>
    </Card>
  )
}
