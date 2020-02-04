import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { ThemeProvider } from 'styled-components'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import configureStore from '~/store'

import { Lendroid } from 'lendroid-protocol'
import tokens from '~/assets/contracts.js'

import Layout from '~/layouts'

const theme = {
  primary: 'default',
}

class WalletApp extends App {
  library = null

  state = {
    lib: null,
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps }
  }

  componentDidMount() {
    const handleMessage = (event, params) => {
      const { store } = this.props
      console.log('Library: ', event, params)
      store.dispatch({
        type: event,
        payload: params && params.data,
      })
    }

    this.library = new Lendroid({
      type: 'metamask',
      tokens,
      onEvent: handleMessage,
    })
    this.setState({ lib: this.library }, () => this.handleProvider())
  }

  async handleProvider(type = 'metamask') {
    if (this.state.torusEmbed) {
      if (type === 'torus') {
        this.state.torusEmbed.showTorusButton()
      } else {
        this.state.torusEmbed.hideTorusButton()
      }
    }

    if (this.state[type]) {
      return this.library.enable(this.state[type], type)
    }

    switch (type) {
      case 'torus':
        const { default: Torus } = require('@toruslabs/torus-embed')
        const torus = new Torus()
        await torus.init()
        await torus.login()
        this.library.enable(torus.provider, type)
        this.setState({ torus: torus.provider, torusEmbed: torus })
        break
      case 'fortmatic':
        const Fortmatic = require('fortmatic')
        const customNodeOptions = {
          rpcUrl: 'http://localhost:8545', // your own node url
          // chainId: 1011, // chainId of your own node
        }
        const fm = new Fortmatic(process.env.FORTMATCI_API_KEY, customNodeOptions)
        web3 = new Web3(fm.getProvider())
        this.setState({ fortmatic: fm.getProvider() })
        break
      default:
        this.library.enable(window.ethereum, type)
        break
    }
  }

  render() {
    const {
      props: { Component, pageProps, store },
      state: { lib: library, type = 'metamask' },
    } = this

    return (
      <>
        <Head>
          <title>Wallet UI</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta charSet="utf-8" />
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KJNBZPW');`,
              }}
            />
          )}
          <link
            href="https://necolas.github.io/normalize.css/latest/normalize.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Overpass"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <Layout type={type}>
            <Provider store={store}>
              <Component
                {...pageProps}
                library={library}
                onProvider={this.handleProvider.bind(this)}
              />
            </Provider>
          </Layout>
        </ThemeProvider>
      </>
    )
  }
}

export default withRedux(configureStore)(WalletApp)
