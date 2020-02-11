import styled from 'styled-components'
import setting from '~/components/assets/images/icons/setting.svg'
import offerTokens from '~/components/assets/images/icons/offer_tokens.svg'
import withdrawEarnings from '~/components/assets/images/icons/withdraw_earnings.svg'

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebebf1;
  box-sizing: border-box;
  box-shadow: 3px 3px 12px rgba(26, 26, 26, 0.08);
  border-radius: 4px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;

  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(18px);
  border-radius: 3px 3px 0px 0px;
  position: relative;
  overflow: hidden;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.3;

    background: linear-gradient(
      187.32deg,
      #53dbff 11.72%,
      #57de87 58.97%,
      #f6b844 85.98%
    );
  }
`

const Content = styled.div`
  padding: 16px 24px;

  table {
    width: 100%;
    table-layout: fixed;
  }

  td {
    font-size: 12px;
    color: #949494;

    &.main {
      font-size: 14px;
      font-weight: bold;
      color: #606060;
    }
  }
`

const Footer = styled.div`
  display: flex;
  border-top: 1px solid #ebebf1;

  .action {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    line-height: 21px;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      margin-right: 8px;
    }
  }

  .action:not(:first-child) {
    border-left: 1px solid #ebebf1;
  }
`

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

const Action = styled.div`
  width: 30px;
  height: 30px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(93, 195, 169, 0.3);
  border-radius: 10px;
`

export default ({ data, onAction, ...props }) => {
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
  console.log(data)
  return (
    <Wrapper {...props}>
      <Header>
        <div className="bg" />
        <PoolName>
          <div className="symbol">{data.name.substr(0, 3).toUpperCase()}</div>
          {data.name}
        </PoolName>
        <Action>
          <img src={setting} />
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
      </Footer>
    </Wrapper>
  )
}
