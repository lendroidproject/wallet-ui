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
  Test1: '0xd91a462a9a1dd952528932f1393a31922c87c977',
  Test2: '0x8b4a892b9a542786f73963138b49c084d5ae7fd4',
  Governor: '0x23bba24818ed052029aa2b04cedc41cfd296f8e8',
  EscapeHatchManager: '0xc0b832c575ed949c8a6f1832528162df4a69861b',
  EscapeHatchTokenHolder: '0xdb9cb98cd7a1c34e2fc2f8c2656c77d2825ff250',
  LST: '0xc64df952f2fc8bd8d7869168afd820c9ac9eb91f',
  Lend: '0x086d7b81ff9ed246cb01894d4e38fd6bfc5a6c6d',
  Borrow: '0x4b393cb3b0f9794602ef68854d4de4bb27a98ddf',
  PriceFeed: '0x6002568fef49eb2693fa07a6f155ca1c756d91ff',
  CurrencyDao: '0x8a5bbf63bea271148ced1b070cf4941bdd956b23',
  InterestPoolDao: '0x000673aae2eb294ea29c38a2b9a4a7bb5e217e9e',
  UnderwriterPoolDao: '0x089b7aabc5bda6455b226850faf8e0f64592b548',
  MarketDao: '0x5501d5116079d61b1828dd07786e65c02a899f47',
  ShieldPayoutDao: '0xba8bce7c56f80385d400586c6a3147f4d4e17680',
  PoolNameRegistry: '0x60d21a7a00c0288f4318f27dae3b456992f0cd7d',
  PositionRegistry: '0xd4e01c1930f661cbe7997cff57001f9b8d7748f8',
  CurrencyPool: '0x35571ab6ed9502b3b8076eea697d4fc0e726fd6a',
  InterestPool: '0xf2126bbed3ef95b9d8bfc58f7c373558c0b4552b',
  UnderwriterPool: '0x0bab7cbead9d0b90d914a1e5d13c9039de325928',
  PriceOracle: '0x66567da99d3ca9454e72584bf0cf16479569a1d7',
  CollateralAuctionCurve: '0xaeba0300add26ff3e0bb5e9617a29ea50653d274',
  ERC20: '0x90250e874b1ad721b56dd2b8b0ea9fe0504ed3ba',
  MultiFungibleToken: '0x4d4554b5361b55d37d3c5f5f8da0620c8039a1ca',
  ProtocolDao: '0xe1c692d8f8911cdfd3400d46bc7974a8ffdd3456',
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
