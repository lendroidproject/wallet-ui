import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Lendroid } from 'lendroid-protocol'
import styled from 'styled-components'

import Tokens from '~/components/Tokens'

const Wrapper = styled.div`
  display: flex;
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

const tokens = {
  Deployer: '0xe7c7f82417ff6e75d06d7ece60013834fa2d91fe',
  Test1: '0x13ea8851b703109a036f0dff139ff01be9c4f516',
  Test2: '0x5803b599b202aa1d10b61aa78bf05e8386d12f06',
  Governor: '0xb5986f98d056cdeb729d5b770c41c7dc62e0f34d',
  EscapeHatchManager: '0x2a3ca5bf694c6486d5cb8115f3f8dae1c9c89be6',
  EscapeHatchTokenHolder: '0x1a1ab2265a689214ab75e7b868ef86dae646e177',
  LST: '0xdb3e0c26ab00db8eb58c9d44c8683012138d5d46',
  DAI: '0xca6edf83e6b76eba69c28a62e30c36dc447d3ff9',
  WETH: '0x531934985e3a7bfda3ebb8a1cddc99d57fa5587d',
  PriceFeed: '0xb6c178bd2f8529a1ddfc036f0e21fbedb7d0db19',
  CurrencyDao: '0x430f7a7d8376c432bf257db8e00deb0aed1ef9c0',
  InterestPoolDao: '0x0509ada35db0c8ff6c6fde1a469e950c91213b5e',
  UnderwriterPoolDao: '0x0e8a74b941a85599f71b23a46a320d8035ab0cd9',
  MarketDao: '0x11aa0d84227dbccf3032d1b4094e9740eaa82c19',
  ShieldPayoutDao: '0x17cfc647132f1d668e2f5d9b6951073438abbfc3',
  PoolNameRegistry: '0x39ad3405efde913a1590e872ee5f9b1a5ceb71d5',
  PositionRegistry: '0x99b3457e64b8de915d56f54702f923ce0089e949',
  CurrencyPool: '0xfa5798d82484644ae9b6c892c0df7a5ac8f8b932',
  InterestPool: '0x3d0525afbb24721362c146bdcd89d9d80d615647',
  UnderwriterPool: '0xf450289022cca45315ce1b68bff81f154814e95e',
  PriceOracle: '0x3297604abe02f4c2fdabd790c0cfbb4a2cdd7f22',
  CollateralAuctionCurve: '0xf0cb61fbb70bacca74c2778ddfda779bf69c2645',
  ERC20: '0xf297186dcb2218a2cfa750b2944c3db3d78cd9fe',
  MultiFungibleToken: '0xed253f7d3b0bbd4bf126e60f95bffc320fc8c43b',
  ProtocolDao: '0xdbf43d5b2dfac03b70b7d33bcd6e3538a1006a66',
}

function Home() {
  const [library, setLibrary] = useState(null)
  const [active, setActive] = useState(0)
  const [supportTokens, setSupportTokens] = useState([])

  const handleMessage = (event, params) => {
    switch (event) {
      case 'BALANCE_UPDATED':
        setSupportTokens(params.data)
        break
      default:
        console.log(event, params)
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
            {active === 0 && (
              <Tokens supportTokens={supportTokens} library={library} />
            )}
            {active > 0 && <p>Coming soon...</p>}
          </Content>
        </Wrapper>
      ) : (
        <div>Loading</div>
      )}
    </>
  )
}

export default Home
