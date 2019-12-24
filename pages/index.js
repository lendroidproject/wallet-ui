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
  LST: '0xa72d0651c868a85e222eed05028264c86653a7f6',
  Lend: '0xf041c1129470e92aa5483c975e60ff1ef78f69e2',
  Borrow: '0x48c52951efbcbc7957d9166bb9efb2df47fbcb25',
  PriceFeed: '0x9bd26b71935295c4b0ada1f0c5046f61f7432746',
  CurrencyDao: '0xfb224550e8b54629beec81331eb226b9081236ab',
  InterestPoolDao: '0x14c865a62d176d52640feaa98c9060a64f9ea1b3',
  UnderwriterPoolDao: '0x6943ae6cd2bbae64d7588d93119159df6eabbba2',
  MarketDao: '0xe0d5cbfbcb7f233856168b9ec526892bb5deb4fb',
  ShieldPayoutDao: '0xb271b0c01fac4ca33aa77fc042f3bcbf2b762e32',
  PoolNameRegistry: '0xe88c99cb4fa0b3fba49421f26fc61adb996a323a',
  PositionRegistry: '0xa3ffc0d55b10daeacfa578effea5a61f765f6c0a',
  CurrencyPool: '0xb3c340ed6ff6c71debb8eeb8990fe88a74626dac',
  InterestPool: '0xf2ac6a4195b604ce4f4a6ac4376134dbdd00d3b0',
  UnderwriterPool: '0x61860c478c2a908d07c147a5a5bcf7e4167a6201',
  PriceOracle: '0xb911e70a123fbb3b0acf3389cec9c02178e9fc7d',
  CollateralAuctionCurve: '0x4f2cc8c2a133f535c2a8973a87a1464bf7237e39',
  ERC20: '0x1b83332c613c386f5490b56546893a37e34b3819',
  MultiFungibleToken: '0x0c7a111876ececef2e80c8a0dfd75b1603f73f59',
  ProtocolDao: '0xf79179ea141270a3a2ffe553b6993d0a489b461f',
}

function Home() {
  const [library, setLibrary] = useState(null)
  const [active, setActive] = useState(0)

  const handleMessage = (event, params) => {
    console.log(event, params)
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
            {active === 0 && <Tokens />}
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
