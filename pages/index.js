import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Lendroid } from 'lendroid-protocol'
import styled from 'styled-components'

import Wallets from '~/components/Wallets'
import PoolOperator from '~/components/PoolOperator'

import tokens from '~/assets/contracts.js'

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

function Home() {
  const [library, setLibrary] = useState(null)
  const [active, setActive] = useState(0)
  const [supportTokens, setSupportTokens] = useState([])
  const [poolNames, setPoolNames] = useState([])
  const [riskFreePools, setRiskFreePools] = useState([])
  const [riskyPools, setRiskyPools] = useState([])
  const supports = {
    supportTokens,
    poolNames,
    riskFreePools,
    riskyPools,
  }

  const handleMessage = (event, params) => {
    switch (event) {
      case 'BALANCE_UPDATED':
        setSupportTokens(params.data)
        break
      case 'POOL_NAME_FETCHED':
        setPoolNames(params.data)
        break
      case 'RISK_FREE_POOL_FETCHED':
        console.log(event, params)
        setRiskFreePools(params.data)
        break
      case 'RISKY_POOL_FETCHED':
        console.log(event, params)
        setRiskyPools(params.data)
        break
      default:
        console.log(event, params)
        break
    }
  }

  useEffect(() => {
    const init = async () => {
      const lib = new Lendroid({ tokens, onEvent: handleMessage })
      setLibrary(lib)
      await lib.enable(window.ethereum)
    }
    init()
  }, [])

  return (
    <>
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        <style jsx global>{`
          body {
            margin: 0;
          }
        `}</style>
      </div>
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
            {active === 4 && <PoolOperator library={library} {...supports} />}
            {[1, 2, 3].includes(active) && <p>Coming soon...</p>}
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

export default Home
