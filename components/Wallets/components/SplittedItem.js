import moment from 'moment'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 10px;
  min-width: 180px;
  display: flex;

  background: #ffffff;
  border: 1px solid #ebebf1;
  box-shadow: 0px 0px 5px rgba(26, 26, 26, 0.08);
  border-radius: 4px;
  cursor: pointer;

  position: relative;

  .name {
    font-size: 12px;
    line-height: 18px;
    color: #6d6d6d;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }

  .icon {
    border-radius: 13px;
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-weight: bold;
    font-size: 10px;

    color: #f7931a;
    background: linear-gradient(139.6deg, #fdb662 -9.45%, #ffe9c8 100%);

    &.I {
      color: #2a5ada;
      background: linear-gradient(139.6deg, #6b94ff -9.45%, #c9d8ff 100%);
    }

    &.F {
      color: #188881;
      background: linear-gradient(139.6deg, #4ee2d9 -9.45%, #caf8db 100%);
    }

    &.U {
      color: #2775ca;
      background: linear-gradient(139.6deg, #4190e6 -9.45%, #dcedff 100%);
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .balance {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: #212121;

    display: flex;
    justify-content: space-between;

    span {
      font-size: 10px;
      line-height: 15px;
      color: rgba(73, 73, 73, 0.8);
      opacity: 0.5;
    }
  }
`

export default function({ token, balance, props: { expiries, ...props } }) {
  const [type, base, expiry, underlying, strike] = token.split('_')

  return (
    <Wrapper {...props}>
      <div className={`icon ${type}`}>{type}</div>
      <div className="info">
        <div className="name">{token.replace(/_/gi, '').replace(/-/gi, '')}</div>
        <div className="balance">
          {balance}
          <span>{expiry} - {moment.unix(expiries.match[expiry]).format('D MMM, YY')}</span>
        </div>
      </div>
    </Wrapper>
  )
}
