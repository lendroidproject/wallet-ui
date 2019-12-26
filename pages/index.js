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
  Deployer: '0x7c7ccfe5bed0d79ada9abca09dc9b5fe9e0cc202',
  Test1: '0x98c86198bf1a209f1280f127b381fc905a6b135f',
  Test2: '0x8458d5c8cd4d6790e946a6b11f0eed5b7d3de566',
  Governor: '0x09ad902cdaebb4d794af54679e51b917f39a7406',
  EscapeHatchManager: '0x618a19225cc4e9dc7f2b00a3cf24482e7a3b40c1',
  EscapeHatchTokenHolder: '0x218d58fc6b21b2b8fb5d7b961dcf4a0b5e81e1dc',
  LST: '0x839bc8f64e9b1c64b8b8066aafdc554cb58fad13',
  DAI: '0x64688777ac7d5762319ef0c6eb304d82dd9a419d',
  WETH: '0x76a8b4334d82f26333cde0d8fa90b56c6345471f',
  PriceFeed: '0xf4a93d28d9252031fc21b1b1ac4c23b86b9e1452',
  CurrencyDao: '0x02e37e6fe31ba9dc8fb5f60fa94420a5a784fab0',
  InterestPoolDao: '0xb5d12e5bb882d45003410aad95583d1caa27a995',
  UnderwriterPoolDao: '0x389dcc6e1ae889fb6f155e5aa30f3bb4371de23b',
  MarketDao: '0xf4f17de7cb5c2a686931f285ed3e9a4222a7ea0c',
  ShieldPayoutDao: '0x9f25a3bfa5e5ce7185a86e24065fbec827808227',
  PoolNameRegistry: '0xddb000f0f8bc0397d3d0607c3377ebe9e7ec6fe1',
  PositionRegistry: '0x5d12d60e8cf8721f14cf2cecb62c5356aaa4d900',
  CurrencyPool: '0x8228d4a2ac5d04f5f6093cdc6bc9205695a930a9',
  InterestPool: '0x0cea078c669a9d98c192d2a15d719964e904b921',
  UnderwriterPool: '0xec43e56f3b5056e0b44c721d79ea2319a6aa1996',
  PriceOracle: '0x7806cdfac999108be31296690ddd6fe661bfb803',
  CollateralAuctionCurve: '0x66e9e1ceed6cade113b3c700a7dc413dbcd11105',
  ERC20: '0x6a4b45b3d8ccac958eb9e13ceebf11a5b8303129',
  MultiFungibleToken: '0x464ae3697a1c1610e4bec3e3a2da82c1a76b1ad5',
  ProtocolDao: '0x547ff73dc02652605463d4490396d9332cfa7950',
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
