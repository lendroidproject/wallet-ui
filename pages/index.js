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
  Test1: '0x5a68545e281738f4e9a47d5f130c8f0e081127e1',
  Test2: '0x9486de11e49cccc95f27df9c13f8707140930028',
  Governor: '0x2827e545cf1e08769047e51f8ecfbdc9e838ead6',
  EscapeHatchManager: '0xec635a831cbe1923e518570fe776c40d2cb195dd',
  EscapeHatchTokenHolder: '0xa8495ebbfb25b32509e50d36af915caf28e969e3',
  LST: '0xb2a9d0795525279aa4c10e957e48bb20e03c9d9a',
  Lend: '0x76e645b92b552823982fc4c765b174d864500805',
  Borrow: '0x4fc8ce2fb90bee1a8567516b139cd62f29300487',
  PriceFeed: '0xae78e3f3f7fcbf6f2b79c472859cad7e81829c3b',
  CurrencyDao: '0x8d0c2c27fc186cd6989006c86a5dbca0f5184275',
  InterestPoolDao: '0x80b7c094a954c3f47b08bc9de35c720f2e07e828',
  UnderwriterPoolDao: '0xeb9310013ca4ad9094ba521c93411972c1fb5fb1',
  MarketDao: '0xc9ba788ca89c00d1702570a81b349b22024ce36d',
  ShieldPayoutDao: '0x959aa10df0b9797a1a187db79ba8072ce996724e',
  PoolNameRegistry: '0x576028fdb2c23df91e51c291431a019f5bb08cfe',
  PositionRegistry: '0x7ae6552768f46d4bc1f6d979ee9300762168ebce',
  CurrencyPool: '0x0f965f73525aeb0f5e1027e1e4414c4721f32438',
  InterestPool: '0xb208c91d980df592f75103787332f78006be76fe',
  UnderwriterPool: '0x2a6807802723cb64a778911c5b010f83236e091d',
  PriceOracle: '0x0218c72a4764036212940da2104c9dfe9669b15a',
  CollateralAuctionCurve: '0x49e15ac148bd76fe3081387c2eac38e733093afd',
  ERC20: '0xa244ed72c056b1ba2f68e42a5ea18b268a93a50a',
  MultiFungibleToken: '0x3cfa9944f390fd6b95ac7c355852133f9d593153',
  ProtocolDao: '0xd89279bf82f8c64334421a4ab078a7204b6c0ad5',
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
