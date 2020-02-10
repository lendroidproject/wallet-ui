import Coin from './Coin'
import Equals from './Equals'
import { Wrapper } from './Wrapper'

export default ({ data, supports, form, setForm }) => {
  const { supportTokens } = supports
  const { token: originToken, balance } = data
  const [type, base, expiry, underlying, strike] = originToken.split('_')
  const lToken = supportTokens.find(({ token: t }) => t === `L_${base}`)

  return (
    <Wrapper>
      <Coin {...data} split={type} />
      <div className="form">
        <div className="input-group">
          <label>Fuse with</label>
          <div className="radios">
            <div className={`radio ${underlying !== '-' ? '' : 'active'}`}>
              <div className="check" />F{base}
            </div>
            <div className={`radio ${underlying !== '-' ? 'active' : ''}`}>
              <div className="check" />S{base} + U{base}
            </div>
          </div>
        </div>
        <div className="input-group">
          <label>Enter amount to fuse</label>
          <div className="input">
            <span>
              {type}
              {base}
            </span>
            <input
              type="number"
              value={form.amount || 0}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="info">
            Balance {type}
            {base}: {balance}
          </div>
        </div>
        <Equals />
        <div className="input-group">
          <div className="input">
            <span>L{base}</span>
            <input type="number" value={form.amount || 0} readOnly />
          </div>
          <div className="info">
            Balance L{base}:{' '}
            {Number(lToken ? lToken.balance : 0) + Number(form.amount || 0)}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
