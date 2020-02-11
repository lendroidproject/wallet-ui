import styled from 'styled-components'

import Coin from '~/components/assets/images/coins/eth.png'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 11px 24px;
  min-width: 180px;
  box-sizing: border-box;
  box-shadow: 1px 1px 6px rgba(26, 26, 26, 0.05);
  cursor: pointer;

  position: relative;

  &.selected {
    border-color: #d9a547 !important;
  }

  .bg {
    position: absolute;
    left: -3px;
    right: -3px;
    top: -3px;
    bottom: -3px;
    z-index: -1;
    opacity: 0.6;
    border-radius: 4px;
    background: linear-gradient(
      205.54deg,
      #53dbff 11.72%,
      #57de87 58.97%,
      #686868 85.98%
    );
  }

  .name {
    font-size: 12px;
    line-height: 18px;
    color: #6d6d6d;
    margin-bottom: 11px;
    display: flex;
    align-items: center;
  }

  .icon {
    background: #ffffff;
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
  }

  .balance {
    font-weight: bold;
    font-size: 22px;
    line-height: 27px;
    color: #212121;
  }
`

export default function({ token, balance, props }) {
  return (
    <Wrapper {...props}>
      <div className="bg" />
      <div className="name">
        <div className="icon">
          <img src={Coin} />
        </div>
        {token.replace(/_/, '')}
      </div>
      <div className="balance">{balance}</div>
    </Wrapper>
  )
}
