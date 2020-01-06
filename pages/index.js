import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Lendroid } from 'lendroid-protocol'
import styled from 'styled-components'

import Tokens from '~/components/Tokens'

const Wrapper = styled.div`
  display: flex;

  * {
    box-sizing: border-box;
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

const tokens = {
  Deployer: '0x9D4F40BC65fA6e540184329379cF6c4cF3A368FE',
  Test1: '0x608ceDcCf056C7468600c3e7ba423E08a97f8890',
  Test2: '0x49FC3f7dc35587b54925C55F02200b0458FfBEC4',
  Governor: '0x20c5e726B9A31EaB759aa76C570f15d48651c644',
  EscapeHatchManager: '0xCC8c71d9548Aae845e7805fFcfa98D7d51999bb0',
  EscapeHatchTokenHolder: '0x4E33Ae790526A230Ad2240FC82C60D5Ef0556773',
  LST: '0x6dC01D6aDdd3C8a8F0e9ca1824b23742520F8A6a',
  DAI: '0x53756d9DDD276C7F94251E5F2EbDa03b6f9775e7',
  WETH: '0x70b27314AacbA4bB9f5CeFbD0d959f0aB14A5cB9',
  PriceFeed: '0xa851dCE346DAA37629D6b7B40fDD0839Cd01aC20',
  CurrencyDao: '0xD3c2BB5dd4CC486B59582b35e4BDedc5434a6f42',
  InterestPoolDao: '0xba796D69AbE5f92964BCB7B891eAC7E060f8A7A9',
  UnderwriterPoolDao: '0x003E34da9E14e16dC2d666d915C516214c44A126',
  MarketDao: '0xa9E35bA85Aca06679c7e619b3E535ab3e1b8D532',
  ShieldPayoutDao: '0xf84547e8801d94d31d6b078b0DCC1f08C98d5aD4',
  PoolNameRegistry: '0x0a3C4f5cFd785d83D07CB6A8E3a2D1BC4887c0cE',
  PositionRegistry: '0x371feEE864Db605ca0D64df65D70637556E42779',
  CurrencyPool: '0xAc00896375959C3513951c9c9C1534E5ED4B100B',
  InterestPool: '0x3556F8A29b238280b29f3a3697FDBfb514e6d6aE',
  UnderwriterPool: '0x4B4328A41419DFf6aF58b38003Ef05DBc4b4bc8b',
  PriceOracle: '0x4cCb72b4f2d534a66814463B6FdE954f33683A8A',
  CollateralAuctionCurve: '0xFa25A2d464E4a8803eD87513e1467BbF90132924',
  ERC20: '0x706C778757938d3AAac48ed6300d620E31fE6A23',
  LERC20: '0xf7A168443f40CBa83d609a2b712950602ba98C3C',
  ERC20PoolToken: '0x38F76ceb0955517d6b71e5EEE02c282649a9c2C9',
  MultiFungibleToken: '0xbd437c874B1f668060B57359A3f66835c9Ac263f',
  ProtocolDao: '0x1db948Fa37C10979eb2Da66a8dbD691dD0E7536D',
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
