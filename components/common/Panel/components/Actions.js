import styled from 'styled-components'

import unlock from '~/components/assets/images/icons/actions/unlock.svg'
import repeat from '~/components/assets/images/icons/actions/repeat.svg'
import transfer from '~/components/assets/images/icons/actions/transfer.svg'
import split from '~/components/assets/images/icons/actions/split.svg'
import fuse from '~/components/assets/images/icons/actions/fuse.svg'
import trash from '~/components/assets/images/icons/actions/trash.svg'
import send from '~/components/assets/images/icons/actions/send.svg'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: -9px;
`

const Action = styled.button`
  background: #ffffff;
  border: 1px solid rgba(18, 38, 94, 0.5);
  border-radius: 5px;

  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  margin: 9px;

  &:disabled {
    border: 1px solid rgba(96, 96, 96, 0.15);

    img {
      filter: grayscale(1);
      opacity: 0.5;
    }
  }

  &.active {
    background: #204e6f;

    img {
      filter: brightness(0) invert(1);
    }
  }
`

const defaultActions = base => [
  {
    value: 'unlock',
    icon: unlock,
  },
  {
    value: base ? 'wrap' : 'unwrap',
    icon: repeat,
  },
  {
    value: 'transfer',
    icon: transfer,
  },
  {
    value: 'split',
    icon: split,
  },
  {
    value: 'fuse',
    icon: fuse,
  },
  {
    value: 'trash',
    icon: trash,
  },
  {
    value: 'send',
    icon: send,
  },
]

export default ({ active, actions, onAction, base }) => (
  <Wrapper>
    {defaultActions(base).map(({ value, icon }) => (
      <Action
        className={active === value ? 'active' : ''}
        disabled={!actions.includes(value)}
        onClick={() => onAction(value)}
        key={value}
        alt={value}
      >
        <img src={icon} />
      </Action>
    ))}
  </Wrapper>
)
