import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import Logo from '~/components/assets/images/logo.svg'

import Wallet from '~/components/assets/images/icons/Wallet_Summary.svg'
import Lend from '~/components/assets/images/icons/Lend.svg'
import Underwrite from '~/components/assets/images/icons/Underwrite.svg'
import Borrow from '~/components/assets/images/icons/Borrow.svg'
import Operate from '~/components/assets/images/icons/Operate.svg'
import Auctions from '~/components/assets/images/icons/Auctions.svg'
import Transfer from '~/components/assets/images/icons/Transfer.svg'
import TransferIcon from '~/components/assets/images/icons/TransferIcon.svg'
import Settings from '~/components/assets/images/icons/Settings.svg'
import Alert from '~/components/assets/images/icons/Alert.svg'

import Metamask from '~/components/assets/images/wallets/metamask.png'
import Torus from '~/components/assets/images/wallets/torus.png'
import Fortmatic from '~/components/assets/images/wallets/fortmatic.png'

const Wrapper = styled.div`
  display: flex;

  * {
    box-sizing: border-box;
    font-family: Overpass;
    transition: all 0.2s;
  }

  .loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const SideBar = styled.div`
  .sidebar {
    height: 100vh;
    overflow: hidden;
    color: black;

    background: linear-gradient(180deg, #2d3b64 0%, #46bb9d 100%);
    box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.2);

    display: flex;
    flex-direction: column;
    width: 64px;

    margin: 0;
    list-style: none;
    padding: 0;

    li.item {
      a {
        color: transparent;
        cursor: pointer;
        padding: 10px;
        text-decoration: none;
        text-align: center;

        display: flex;
        flex-direction: column;
        align-items: center;

        font-size: 10px;
        line-height: 15px;
      }

      &:not(.active):hover a {
        color: white;
        background: rgba(83, 199, 191, 0.1);
      }

      &.active a {
        background: rgba(83, 199, 191, 0.5);
        color: white;
      }
    }

    hr {
      margin: 12px 8px;
      opacity: 0.2;
      border: 0;
      border-top: 1px solid #ffffff;
    }

    .logo {
      padding: 12px 14px;

      a {
        display: flex;
        align-items: center;
      }
    }

    .wallet-icon {
      width: 48px;
      height: 48px;
      padding: 10px;
      margin: 12px auto;
      cursor: pointer;

      background: rgba(13, 35, 60, 0.5);
      border-radius: 32px;

      img {
        width: 100%;
      }
    }

    .trasnfer-icon {
      position: relative;
      display: flex;

      .icon {
        position: absolute;
        left: 6px;
        top: 6px;
      }

      .notifier {
        position: absolute;
        right: -3px;
        top: -3px;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: #f7931a;
        border: 2px solid #3b8484;
      }
    }

    li.action {
      padding: 12px;
      text-align: center;

      img {
        cursor: pointer;
      }
    }

    &.open {
      width: 180px;
    }
  }
`

const Content = styled.div`
  width: 100%;
`

const tabs = [
  ['Summary', '/', Wallet],
  ['Lender', '/lender', Lend],
  ['Underwriter', '/underwriter', Underwrite],
  ['Borrower', '/borrower', Borrow],
  ['Pool Operator', '/pool-operator', Operate],
  ['Acuctions', '/1', Auctions],
]

const wallets = {
  metamask: Metamask,
  torus: Torus,
  fortmatic: Fortmatic,
}

export default function({ type, ...props }) {
  const router = useRouter()

  return (
    <Wrapper>
      <SideBar>
        <ul className="sidebar">
          <li className="logo">
            <Link href="/">
              <a>
                <img src={Logo} />
              </a>
            </Link>
          </li>
          <li className="wallet">
            <div className="wallet-icon">
              <img src={wallets[type]} />
            </div>
          </li>
          {tabs.map(([tab, url, icon], idx) => (
            <li
              key={idx}
              className={router.pathname === url ? 'item active' : 'item'}
            >
              <Link href={url}>
                <a>
                  <img src={icon} />
                  {tab}
                </a>
              </Link>
            </li>
          ))}
          <hr />
          <li className="item transfer">
            <Link href="/">
              <a>
                <div className="trasnfer-icon">
                  <img src={Transfer} />
                  <img src={TransferIcon} className="icon" />
                  <div className="notifier" />
                </div>
              </a>
            </Link>
          </li>
          <hr />
          <li className="action setting">
            <img src={Settings} />
          </li>
          <li className="action alert">
            <img src={Alert} />
          </li>
        </ul>
      </SideBar>
      <Content>
        <div {...props} />
      </Content>
    </Wrapper>
  )
}
