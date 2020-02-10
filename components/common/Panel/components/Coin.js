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
  }

  .amount {
    font-weight: bold;
    font-size: 22px;
    line-height: 27px;
    color: #212121;
  }
`

export default ({ token, balance }) => {
  return (
    <Wrapper>
      <div className="name">
        <div className="icon">
          <img src={Coin} />
        </div>
        {token.replace(/_/, '')}
      </div>
      <div className="amount">{balance}</div>
    </Wrapper>
  )
}
