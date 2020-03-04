import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { ThemeProvider } from 'styled-components'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import configureStore from '~/store'

import { Lendroid } from 'lendroid-2-js'
import tokens from '~/assets/contracts.js'

import Layout from '~/layouts'

const theme = {
  primary: 'default',
}

class WalletApp extends App {
  library = null

  state = {
    lib: null,
    address: '',
    panel: null,
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
      if (this.library.address !== this.state.address) {
        this.setState({ address: this.library.address })
      }
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
    if (this.state[type]) {
      this.setState({ type })
      return this.library.enable(this.state[type], type)
    }

    switch (type) {
      case 'fortmatic':
        const Fortmatic = require('fortmatic')
        const fm = new Fortmatic(process.env.FORTMATIC_API_KEY)
        this.library.enable(fm.getProvider(), type)
        this.setState({ fortmatic: fm.getProvider(), type })
        break
      default:
        this.setState({ type })
        this.library.enable(window.ethereum, type)
        break
    }
  }

  render() {
    const {
      props: { Component, pageProps, store },
      state: { lib: library, type = 'metamask', address, panel },
    } = this

    const handlePanel = data =>
      this.setState({
        panel: data,
      })

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
          <style>
            {`
              body {
                display: flex;
                line-height: 1.5;
              }

              #__next {
                width: 100%;
              }
            `}
          </style>
        </Head>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Layout
              type={type}
              library={library}
              address={address}
              onProvider={this.handleProvider.bind(this)}
              panel={panel}
              onPanel={handlePanel}
            >
              <Component
                {...pageProps}
                type={type}
                library={library}
                panel={panel}
                onPanel={handlePanel}
              />
            </Layout>
          </Provider>
        </ThemeProvider>
      </>
    )
  }
}

export default withRedux(configureStore)(WalletApp)
