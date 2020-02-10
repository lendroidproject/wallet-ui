import styled from 'styled-components'
import Coin from '~/components/assets/images/coins/eth.png'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 2px solid #2f8260;
  box-shadow: 3px 3px 10px rgba(25, 60, 2, 0.3);
  border-radius: 4px;
  padding: 8px 14px;

  &.split {
    border-color: #0234ba;
  }

  margin-bottom: 32px;

  .name {
    font-size: 12px;
    line-height: 18px;
    color: #6d6d6d;
    display: flex;
    align-items: center;

    .lock {
      position: absolute;
      right: 12px;
      top: 12px;
    }
  }

  .icon {
    background: #ffffff;
    border: 1px solid #8c8c8c;
    box-sizing: border-box;
    border-radius: 13px;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    padding: 5px;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    &.split {
      width: 20px;
      height: 20px;
      border: 0;
    }

    &.S {
      color: #f7931a;
      background: linear-gradient(139.6deg, #fdb662 -9.45%, #ffe9c8 100%);
    }

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

  .amount {
    font-weight: bold;
    font-size: 22px;
    color: #212121;
    line-height: 1;
    position: relative;
    top: 2px;
  }
`

export default ({ token, balance, split }) => {
  return (
    <Wrapper className={split ? 'split' : ''}>
      <div className="name">
        <div className={`icon ${split ? `split ${split}` : ''}`}>
          {split || <img src={Coin} />}
        </div>
        {token.replace(/_/gi, '').replace(/-/gi, '')}
      </div>
      <div className="amount">{balance}</div>
    </Wrapper>
  )
}
