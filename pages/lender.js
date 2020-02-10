import { connect } from 'react-redux'
import Loans from '~/components/Loans'

export default connect(state => state)(function(props) {
  const {
    library,
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
    <Loans riskFree library={library} {...supports} />
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
