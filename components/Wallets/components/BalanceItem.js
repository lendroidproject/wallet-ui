import styled from 'styled-components'

import Coin from '~/components/assets/images/coins/eth.png'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 11px 24px;
  min-width: 180px;

  background: #ffffff;
  border: 1px solid #ebebf1;
  box-sizing: border-box;
  box-shadow: 1px 1px 6px rgba(26, 26, 26, 0.05);
  border-radius: 4px;
  cursor: pointer;

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
  }

  .balance {
    font-weight: bold;
    font-size: 22px;
    line-height: 27px;
    color: #212121;
  }
`

export default function({ token, balance, allowance, props }) {
  return (
    <Wrapper {...props}>
      <div className="name">
        <div className="icon">
          <img src={Coin} />
        </div>
        {token}
      </div>
      <div className="balance">{balance}</div>
    </Wrapper>
  )
}
