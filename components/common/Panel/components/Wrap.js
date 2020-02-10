import Coin from './Coin'
import Equals from './Equals'
import { Wrapper } from './Wrapper'

export default ({ data, supports, form, setForm }) => {
  const { supportTokens } = supports
  const { token, balance } = data
  const lToken = supportTokens.find(({ token: t }) => t === `L_${token}`)
  if (!lToken) return null;

  return (
    <Wrapper>
      <Coin {...data} />
      <div className="form">
        <div className="input-group">
          <label>Enter amount to wrap</label>
          <div className="input">
            <span>{token}</span>
            <input
              type="number"
              value={form.amount || 0}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="info">
            Balance {token}: {balance}
          </div>
        </div>
        <Equals />
        <div className="input-group">
          <div className="input">
            <span>L{token}</span>
            <input type="number" value={form.amount || 0} readOnly />
          </div>
          <div className="info">
            Balance L{token}: {Number(lToken.balance) + Number(form.amount || 0)}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
