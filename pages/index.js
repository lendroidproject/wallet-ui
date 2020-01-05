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
  Deployer: '0x0761Ffc71417313f3e16d4166209Dbc79FB49555',
  Test1: '0x78ed565D847e669899595911904f1c2cA576B09c',
  Test2: '0xc428b27f3CE99d4a07B4e18aF9900522245f4602',
  Governor: '0xdDaF3b098E51e149b2901B26ce0eA09C5e3C1301',
  EscapeHatchManager: '0xEb0c6Cd2B8606B680c7C5825b7675E161BD4E328',
  EscapeHatchTokenHolder: '0xca46C4873986E89B34fF2c9e8Fc0a264391c7aa3',
  LST: '0x2Fe7971817F4933a929b8C8F0E4296846205C7b5',
  DAI: '0xF21EeD3cd423Bb763C50681b7Ba95d49e829dA4a',
  WETH: '0x5Fc91dde3B555Bab7a7ED8e7824977fED8802304',
  PriceFeed: '0xCE68d84E66D5Ef9BEBaa3DD60FA4d96f94521c0d',
  CurrencyDao: '0xA4179c5748B6E339dd12afE68EE32d3f41F04ce0',
  InterestPoolDao: '0xA55a8e416E2A36f266dB6F77ae40c89Da8b0f3F4',
  UnderwriterPoolDao: '0x5C4a4cf290D10dcA6635AA6B0A645fBC5714D1Fe',
  MarketDao: '0xeE66D77cA635FbFb7c4Cd870414680053Ad9f22a',
  ShieldPayoutDao: '0x6425ebcc181d45b3616E9Fc74B2759Ad19f7B364',
  PoolNameRegistry: '0x732762B2855Fa49525F9e82dCee6bD0E5B02EB3C',
  PositionRegistry: '0x7249C9c0F2E4dbe30828E2a24A2aB3442EEE31ce',
  CurrencyPool: '0xa50d17c8A33eFC684c235B74b2f9E7F040Fefc5a',
  InterestPool: '0x5E0CD736fe9A5ac641fD3c4a402C87CCf50a5DeC',
  UnderwriterPool: '0x36e710413259167E4d0978ec34Ad83A268c5E077',
  PriceOracle: '0x71ed5b4683b8549a3d673552399084Fe8a94Cff3',
  CollateralAuctionCurve: '0xdAB116C52a6e719db7682c973Ec375A498157276',
  ERC20: '0xBEE4B46d601f2a3095449b22BD0383f2A9C41d69',
  LERC20: '0x106905261b30Ae9F1270F1A858E25458f8c5573D',
  ERC20PoolToken: '0x9E0E015cBDEA65a5F00C5c462Ca4b9e37f21682A',
  MultiFungibleToken: '0x2eb18aDF984fBDEbd8E52E2e4A976644A2b7cBff',
  ProtocolDao: '0xe4E16De0a99105e2032686DE07E79E7651c5254e',
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
