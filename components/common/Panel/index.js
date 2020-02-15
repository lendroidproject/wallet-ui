import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Button from '~/components/common/Button'

import Actions from './components/Actions'
import Unlock from './components/Unlock'
import Wrap from './components/Wrap'
import Unwrap from './components/Unwrap'
import Split from './components/Split'
import Fuse from './components/Fuse'
import Transfer from './components/Transfer'

import info from '~/components/assets/images/icons/actions/info.svg'

const Wrapper = styled.div`
  width: 300px;
  flex: 0 0 300px;
  padding: 30px 20px 20px;
  height: 100vh;
  max-height: 100vh;
  overflow: auto;

  background: #ffffff;
  box-shadow: 2px 0px 12px rgba(26, 26, 26, 0.08);

  padding-bottom: 57px;
  position: relative;

  > button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: calc(100% - 40px);
  }
`

const ActiveTitle = styled.h2`
  letter-spacing: 0.02em;
  color: #12161e;
  font-size: 20px;
  line-height: 1;
  margin: 32px 0;

  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;

  img {
    margin-left: 11px;
  }
`

const getActions = ({ value, data }) => {
  switch (value) {
    case 'tokens':
      return Number(data.allowance) > 0
        ? ['unlock', 'wrap', 'transfer']
        : ['unlock', 'transfer']
    case 'wrappedTokens':
      return ['unwrap', 'split', 'transfer']
    case 'sufiTokens':
      return ['fuse', 'transfer']
    default:
      return []
  }
}

export default connect(state => state)(props => {
  const { library, value, token, onAction, supportTokens = [] } = props
  const { expiries } = library.contracts || {}
  const data = supportTokens.find(({ token: t }) => t === token)
  const originTokens = supportTokens
    .filter(({ token }) => !token.includes('_'))
    .map(({ token }) => token)
  const actions = getActions({ value, data })
  const [active, setActive] = useState('')
  const [form, setForm] = useState({})

  if (!active || !actions.includes(active)) {
    if (actions.length > 0) {
      setActive(actions[0])
    }
    return <Wrapper />
  }

  const actionProps = {
    active,
    actions,
    onAction: val => {
      setForm({})
      setActive(val)
    },
  }

  const contentProps = {
    data,
    form,
    setForm,
  }

  const handleProceed = () => {
    onAction(form, active, data, () => setForm({}))
  }

  return (
    <Wrapper>
      <Actions {...actionProps} base={value === 'tokens'} />
      <ActiveTitle>
        {active} <img src={info} />
      </ActiveTitle>
      {active === 'unlock' && <Unlock {...contentProps} />}
      {active === 'wrap' && (
        <Wrap {...contentProps} supports={{ supportTokens }} />
      )}
      {active === 'unwrap' && (
        <Unwrap {...contentProps} supports={{ supportTokens }} />
      )}
      {active === 'split' && (
        <Split
          {...contentProps}
          supports={{ supportTokens, expiries, originTokens }}
        />
      )}
      {active === 'fuse' && (
        <Fuse
          {...contentProps}
          supports={{ supportTokens, expiries, originTokens }}
        />
      )}
      {active === 'transfer' && <Transfer {...contentProps} />}
      <Button type="button" onClick={handleProceed}>
        Proceed
      </Button>
    </Wrapper>
  )
})
