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
  Test1: '0x6b4e3a0cf95a0c5cd9f193e7b18c423d0f78dac1',
  Test2: '0xd7766fbfd21b7af75616387fa96988eb218df1ee',
  Governor: '0xbc0af88ce80f98f5feaad6313f23227fa299972b',
  EscapeHatchManager: '0xfd07178ea1a15c16a3295c2a0d2e382f4396f808',
  EscapeHatchTokenHolder: '0xf7311178169c40f8fb788e67c7dffd82508b9014',
  LST: '0xa8fad3881ee8b8076b417f0d8f451f68d9f9d366',
  Lend: '0x99e7867d3e7815fed45c4094e9066e293d9791be',
  Borrow: '0x1cdd163536dafe155f3b45e038b6021f16cce702',
  PriceFeed: '0x9608a95a69ee421631305874199823020085015e',
  CurrencyDao: '0xcd6fb679ea822926ba8635332b883a08852793e5',
  InterestPoolDao: '0x894f084c5fcbcf689879d30947c1dfa053d0db7c',
  UnderwriterPoolDao: '0xc3857667d08180f0a25a5468a20986a0a4ae299e',
  MarketDao: '0x67eec171de3fa7dc9bb3d20a38660a73677b6602',
  ShieldPayoutDao: '0x454c8fb53fe2378ca4a4f85ae0e9f04ca2c74ec9',
  PoolNameRegistry: '0x6a51dd2cb1672358f9dbfa10e6e96716f0e906a4',
  PositionRegistry: '0x8b801df51ac1bf2a7c3ecaeb3f203abd8592fb2b',
  CurrencyPool: '0x996b8ad0b545ec5164f4a6893c0cca38b662f982',
  InterestPool: '0xc7b3e7160212734fcf51389c4b27b4b9b1391386',
  UnderwriterPool: '0x3bbeeea9711760797436fec7558fd39bcca6b041',
  PriceOracle: '0x2cd21a4b1ef250331931678d5ad4ce99fb6c6d72',
  CollateralAuctionCurve: '0xb5561fa7d144d1995fc1f9d352c1176f5c20d8fc',
  ERC20: '0x51a911ed5ff95c3e145747569d92ed3966d1678b',
  MultiFungibleToken: '0x0034ba52849c5ff14d70fdd13f457fdb94dab44b',
  ProtocolDao: '0x425e5acfcccf5863d9d8a6554496f2a69b7ec2a0',
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
