import Coin from './Coin'
import { Wrapper } from './Wrapper'

export default ({ data, form, setForm }) => {
  const { token, balance } = data
  return (
    <Wrapper>
      <Coin {...data} />
      <div className="form">
        <div className="input-group">
          <label>Enter amount to unlock</label>
          <div className="input">
            <span>{token}</span>
            <input
              type="number"
              value={form.amount || 0}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              onFocus={() =>
                Number(form.amount || 0) === 0 &&
                setForm({ ...form, amount: balance })
              }
            />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
