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
  Deployer: '0x8D70E2fb944514536D46E643698251E67E3B2ea1',
  Test1: '0xd41EeE40A87f2a175A826eD900E5149291747794',
  Test2: '0xCA6e6D852a1a3f9dE03E4d44E0A70f6112e376E3',
  Governor: '0x8E0932B23e78b69bFb704dd7f356277870C39f2b',
  EscapeHatchManager: '0xCfa0e720525c9ff45A743825A5bD8ECcaAB597aC',
  EscapeHatchTokenHolder: '0x3d4bb543a8424aa32d6efD971f5a6FA638b47d79',
  LST: '0x5FdB56909f9C4405B4629CD3719Eaa157dE9A0aF',
  DAI: '0x12AFBBcb7C6DbCc045FD9E904e93fc1CfA822695',
  WETH: '0xb9CaD2d47b3C1bcDe720543680D0989a173a1f8C',
  PriceFeed: '0xdD028CB21ac73092CED7e788ef5fd6400da2F279',
  CurrencyDao: '0x4f0781eb3Ed160618067a0a8071B955A0629f442',
  InterestPoolDao: '0xE70242c4D1533F51125f817e09D74e6E147D5A14',
  UnderwriterPoolDao: '0x3584dAE1431Cb1A2287620C913721CF9549012AB',
  MarketDao: '0xa271557e5B2c4c0D0786E4d1C2B47746B75141f8',
  ShieldPayoutDao: '0xa0c0b8Dd46999E11Da53cfcBd5576AeE5AA69876',
  PoolNameRegistry: '0x91d8027341EBfFBFd233F0186d125EceFc01221f',
  PositionRegistry: '0x41d40093197e5d95cd8FdFD56755B8114C683ce3',
  CurrencyPool: '0x5Fda3770CD84423efbea6984f1Dfe3eDA2C2c9FA',
  InterestPool: '0x282C713Db28119F85FbDBe02F472E948C079E6bD',
  UnderwriterPool: '0x4119C38196e7C9EB5858e4E414f824beBd0Fd8B2',
  PriceOracle: '0x37be32fAe6a2C020319313B4C4179b804930B568',
  CollateralAuctionCurve: '0xab325cFC5794846211ab8fa9cc52AE3e640B5B8C',
  ERC20: '0xaC0575CDb722aBb6a9eCa1A39821446779D30DeB',
  MultiFungibleToken: '0x3e8eae6BccFCF3ccAfe63Abd0ADCDfBc5b7e9B86',
  ProtocolDao: '0x2DcE5e472479f2AA47d40668bf90C567C6BEa006',
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
