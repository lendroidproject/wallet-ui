import styled from 'styled-components'

import Metamask from '~/components/assets/images/wallets/metamask.png'
import Fortmatic from '~/components/assets/images/wallets/fortmatic.png'

const Network = styled.div`
  position: relative;
`

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background: #ffffff;
  mix-blend-mode: normal;
  opacity: 0.8;
  z-index: 1;
`

const List = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  z-index: 2;
  right: 0;
  top: 20px;
  width: 300px;
  padding: 3px;

  background: #ffffff;
  border: 1px solid #ebebf1;
  box-sizing: border-box;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.25);

  .item {
    display: flex;
    cursor: pointer;
    padding: 12px 8px;

    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: #000000;
    text-transform: capitalize;

    &.active {
      background: #e3e3e3;
    }

    img {
      height: 24px;
      margin-right: 12px;
    }
  }
`

const networks = [
  {
    value: 'metamask',
    image: Metamask,
  },
  {
    value: 'fortmatic',
    image: Fortmatic,
  },
]

export default ({ active, onSelect, onClose }) => (
  <>
    <Overlay onClick={onClose} />
    <Network>
      <List>
        {networks.map(({ value, image }) => (
          <div
            key={value}
            className={`item ${active === value ? 'active' : ''}`}
            onClick={
              active === value
                ? null
                : () => {
                    onSelect(value)
                    onClose()
                  }
            }
          >
            <img src={image} />
            {value}
          </div>
        ))}
      </List>
    </Network>
  </>
)
