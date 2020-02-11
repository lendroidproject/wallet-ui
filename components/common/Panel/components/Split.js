import Coin from './Coin'
import Equals from './Equals'
import { Wrapper } from './Wrapper'

export default ({ data, supports, form, setForm }) => {
  const { supportTokens, expiries, originTokens } = supports
  const { token: originToken, balance } = data
  const token = originToken.replace(/_/, '')
  const base = originToken.replace('L_', '')
  const baseExt = `${base}_${form.expiry}_${form.type ? form.underlying : '-'}_${
    form.type ? form.strike : '-'
  }`
  const fToken = supportTokens.find(({ token: t }) => t === `F_${baseExt}`)
  const iToken = supportTokens.find(({ token: t }) => t === `I_${baseExt}`)
  const sToken = supportTokens.find(({ token: t }) => t === `S_${baseExt}`)
  const uToken = supportTokens.find(({ token: t }) => t === `U_${baseExt}`)

  return (
    <Wrapper>
      <Coin {...data} />
      <div className="form">
        <div className="input-group">
          <label>Split as</label>
          <div className="radios">
            <div
              className={`radio ${form.type ? '' : 'active'}`}
              onClick={() => setForm({ ...form, type: false })}
            >
              <div className="check" />F{base} + I{base}
            </div>
            <div
              className={`radio ${form.type ? 'active' : ''}`}
              onClick={() => setForm({ ...form, type: true })}
            >
              <div className="check" />F{base} + S{base} + U{base}
            </div>
          </div>
        </div>
        <div className="input-group">
          <label>Enter amount to split</label>
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
            <span>F{base}</span>
            <input type="number" value={form.amount || 0} readOnly />
          </div>
          <div className="info">
            Balance F{base}:{' '}
            {Number(fToken ? fToken.balance : 0) + Number(form.amount || 0)}
          </div>
        </div>
        {!form.type ? (
          <div className="input-group">
            <div className="input">
              <span>I{base}</span>
              <input type="number" value={form.amount || 0} readOnly />
            </div>
            <div className="info">
              Balance I{base}:{' '}
              {Number(iToken ? iToken.balance : 0) + Number(form.amount || 0)}
            </div>
          </div>
        ) : (
          <>
            <div className="input-group">
              <div className="input">
                <span>S{base}</span>
                <input type="number" value={form.amount || 0} readOnly />
              </div>
              <div className="info">
                Balance S{base}:{' '}
                {Number(sToken ? sToken.balance : 0) + Number(form.amount || 0)}
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <span>U{base}</span>
                <input type="number" value={form.amount || 0} readOnly />
              </div>
              <div className="info">
                Balance U{base}:{' '}
                {Number(uToken ? uToken.balance : 0) + Number(form.amount || 0)}
              </div>
            </div>
            <div className="input-group">
              <div className="input select">
                <span>Underlying</span>
                <select
                  value={form.underlying}
                  onChange={e => setForm({ ...form, underlying: e.target.value })}
                >
                  <option defaultValue>Choose Underlying</option>
                  {originTokens
                    .filter(t => t !== base && t !== 'LST')
                    .map(t => (
                      <option value={t} key={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <span>Strike</span>
                <input
                  type="number"
                  value={form.strike || 0}
                  onChange={e => setForm({ ...form, strike: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
        <div className="input-group">
          <div className="input select">
            <span>Expiry</span>
            <select
              value={form.expiry}
              onChange={e => setForm({ ...form, expiry: e.target.value })}
            >
              <option defaultValue>Choose Expiry</option>
              {expiries.map(({ name }) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
