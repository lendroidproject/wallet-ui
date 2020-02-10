import { connect } from 'react-redux'
import Wallets from '~/components/Wallets'

export default connect(state => state)(function(props) {
  const {
    type,
    library,
    panel,
    onPanel,
    supportTokens = [],
    poolNames = [],
    riskFreePools = [],
    riskyPools = [],
  } = props
  const pageProps = {
    type,
    library,
    panel,
    onPanel,
  }
  const supports = {
    supportTokens,
    poolNames,
    riskFreePools,
    riskyPools,
  }

  return library ? (
    <Wallets {...pageProps} {...supports} />
  ) : (
    <div
      className="loading"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Loading
    </div>
  )
})
