import { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Wallets from '~/components/Wallets'
import PoolOperator from '~/components/PoolOperator'
import Pools from '~/components/Pools'
import Loans from '~/components/Loans'

const Wrapper = styled.div`
  display: flex;

  * {
    box-sizing: border-box;
  }

  .loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const SideBar = styled.div`
  width: 320px;
  flex: 0 0 320px;
  height: 100vh;
  background: lightgrey;
  color: black;

  > div {
    cursor: pointer;
    padding: 10px;
  }

  .active {
    background: black;
    color: white;
  }
`

const Content = styled.div`
  width: 100%;
`

const tabs = [
  'Wallet Summary',
  'Lender',
  'Underwriter',
  'Borrower',
  'Pool Operator',
]

function Home(props) {
  const {
    library,
    onProvider,
    supportTokens = [],
    poolNames = [],
    riskFreePools = [],
    riskyPools = [],
  } = props
  const [active, setActive] = useState(0)
  const supports = {
    supportTokens,
    poolNames,
    riskFreePools,
    riskyPools,
  }

  return (
    <>
      {library ? (
        <Wrapper>
          <SideBar>
            {tabs.map((tab, idx) => (
              <div
                key={idx}
                onClick={() => setActive(idx)}
                className={active === idx ? 'active' : ''}
              >
                {tab}
              </div>
            ))}
          </SideBar>
          <Content>
            {active === 0 && <Wallets library={library} {...supports} />}
            {active === 1 && <Pools riskFree library={library} {...supports} />}
            {active === 2 && <Pools library={library} {...supports} />}
            {active === 3 && <Loans library={library} {...supports} />}
            {active === 4 && <PoolOperator library={library} {...supports} />}
          </Content>
        </Wrapper>
      ) : (
        <div
          className="loading"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Loading
        </div>
      )}
    </>
  )
}

export default connect(state => state)(Home)
