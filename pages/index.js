import { connect } from 'react-redux'
import Wallets from '~/components/Wallets'

export default connect(state => state)(function(props) {
  const {
    type,
    library,
    onProvider,
    supportTokens = [],
    poolNames = [],
    riskFreePools = [],
    riskyPools = [],
  } = props
  const supports = {
    supportTokens,
    poolNames,
    riskFreePools,
    riskyPools,
  }

  return library ? (
    <Wallets type={type} library={library} {...supports} />
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
