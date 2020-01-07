import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Lendroid } from 'lendroid-protocol'
import styled from 'styled-components'

import Tokens from '~/components/Tokens'

import tokens from '~/assets/contracts.js'

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
