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
  Deployer: '0xAf0F8eA24D029bc4e71D6E5Aa3ba3698ed78F25f',
  Test1: '0xFC261a5193859a844318dE6278eE7a36686Ceea1',
  Test2: '0x7e5bce5e3994ec56f4dd5BcF4B677B4CF95A21f1',
  Governor: '0xBE7789b9EE066083b8B771c28B64130e60f9Ea30',
  EscapeHatchManager: '0x334A11c6f50472D2078ec64F7b34F6bDc7627A14',
  EscapeHatchTokenHolder: '0x7537594342D4B1746A2584EBDCEa65669D5672f0',
  LST: '0x783F1739E72f5bdFdEe93184600876A31e1DAa84',
  DAI: '0x9843161b71d389E807568715A9f71a4482c74512',
  WETH: '0xcC7C006b5350543805F6368df1Eae61D0cC040ec',
  PriceFeed: '0xaD47D8054c0c12F03932DB26Db52C8A8a26fD654',
  CurrencyDao: '0xdaB9959D5859A16d5d0EFa3534415741B85945F6',
  InterestPoolDao: '0xAF855F5a8bc2E1145Be16E29DCea02814028b82b',
  UnderwriterPoolDao: '0x767Fc433248e8530341a26608ab32B3baD06b77b',
  MarketDao: '0x146025fcA6103B3f47819298A3bFB04f0207334d',
  ShieldPayoutDao: '0x4f0De92A7c81395e717af615E0962deAb21243A3',
  PoolNameRegistry: '0xB3e19125aE664A9441081F5e792386381e5509B7',
  PositionRegistry: '0x595d511AF6a362768aa1B30674AC947959975a7E',
  CurrencyPool: '0xddbf0ed052eA4916b01566CBE1c25727BE53591B',
  InterestPool: '0x78eE75D072AE948f426FF3A40BA17747C1F39c40',
  UnderwriterPool: '0xB2A60AaF1850b6c20D11348A71550b18F8aD088A',
  PriceOracle: '0x2b67F4f4Ac8973E2a228228B645cdccb77160Da5',
  CollateralAuctionCurve: '0xA61dEDD6b6B9599BA5c302A006968D2081DfC524',
  ERC20: '0xfF4B612A65561a09164d7eecde8e66517cEcD7ba',
  LERC20: '0xa033fcB19aeb07682aad2Ed8964cf2424A31b6D5',
  ERC20PoolToken: '0x6F402566228378Ad3D0692534996B9e064CF448d',
  MultiFungibleToken: '0x4314f40C2Ebb497980079fEFA5f5B88aA0B0E811',
  ProtocolDao: '0xAB07fd07E998bC99F2d1ada3fdD72E0158bc8f0A',
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
