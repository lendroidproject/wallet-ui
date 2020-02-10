import Coin from './Coin'
import Equals from './Equals'
import { Wrapper } from './Wrapper'

export default ({ data, supports, form, setForm }) => {
  const { supportTokens } = supports
  const { token: originToken, balance } = data
  const token = originToken.replace(/_/, '');
  const base = originToken.replace('L_', '')
  const baseToken = supportTokens.find(({ token: t }) => t === base)
  if (!baseToken) return null

  return (
    <Wrapper>
      <Coin {...data} />
      <div className="form">
        <div className="input-group">
          <label>Enter amount to unwrap</label>
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
            <span>{base}</span>
            <input type="number" value={form.amount || 0} readOnly />
          </div>
          <div className="info">
            Balance {base}: {Number(baseToken.balance) + Number(form.amount || 0)}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
