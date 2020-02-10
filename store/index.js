import { createStore } from 'redux'

const reducer = (state, action) => {
  switch (action.type) {
    case 'BALANCE_UPDATED':
      return { ...state, supportTokens: action.payload }
    case 'POOL_NAME_FETCHED':
      return { ...state, poolNames: action.payload }
    case 'RISK_FREE_POOL_FETCHED':
      return { ...state, riskFreePools: action.payload }
    case 'RISKY_POOL_FETCHED':
      return { ...state, riskyPools: action.payload }
    case 'POSITION_FETCHED':
      return { ...state, positions: action.payload }
    default:
      return state
  }
}

const defaults = {}

export default (initialState = defaults) => {
  return createStore(reducer, initialState)
}
