import { useState, useEffect } from 'react'
import Coin from './Coin'
import { Wrapper } from './Wrapper'

import check from '~/components/assets/images/icons/check.svg'

export default ({ data, form, setForm }) => {
  const { token: origin, balance } = data
  const token = origin.replace(/(_|-)/g, '')
  const [touch, onTouch] = useState({})

  const errors = {
    to: touch.to && !/^0x[a-fA-F0-9]{40}$/.test(form.to),
  }

  useEffect(() => {
    if (touch.to && form.to === undefined) {
      onTouch({})
    }
  }, [form])

  return (
    <Wrapper>
      <Coin {...data} />
      <div className="form">
        <div className="input-group">
          <label>Enter amount to Transfer</label>
          <div className="input">
            <span>{token.replace()}</span>
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
        <div className={`input-group ${errors.to ? 'error' : ''}`}>
          <div className="input">
            <span>Address</span>
            <input
              type="text"
              value={form.to || ''}
              onChange={e => setForm({ ...form, to: e.target.value })}
              onBlur={() => onTouch({ ...touch, to: true })}
            />
            <div className="badge">
              {!errors.to && touch.to && <img src={check} />}
            </div>
          </div>
          {errors.to && (
            <div className="info">! Please enter the Valid Address</div>
          )}
        </div>
      </div>
    </Wrapper>
  )
}
