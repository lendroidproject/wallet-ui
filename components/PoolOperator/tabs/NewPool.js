import { useState } from 'react'
import styled from 'styled-components'

import Form, { Row, Actions } from '~/components/common/Form'
import Button from '~/components/common/Button'
import SuggestedInput from '~/components/common/SuggestedInput'
import { PopupBox, Success } from '~/components/common/Popup'

const Wrapper = styled.div`
  width: 100%;
`

const Popup = styled.div``

export default function({ onClose, library, poolNames }) {
  const { balanceTokens } = library.contracts
  const currencies = balanceTokens.filter(t => t !== 'LST')

  const defaults = {
    riskFree: 1,
    poolName: '',
    symbol: '',
    feePercentI: 1,
    feePercentS: 1,
    currency: currencies[0],
    onlyMe: 1,
    exchangeRate: 50,
    expiryLimit: 90,
  }

  const [form, setForm] = useState(defaults)
  const [success, setSuccess] = useState(false)

  const handleForm = (key, val) => {
    const newForm = { ...form, [key]: val }
    setForm(newForm)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    library.contracts
      .onCreatePool(form)
      .then(() => {
        setSuccess(true)
        if (riskFree) {
          library.contracts.getRiskFreePools()
        } else {
          library.contracts.getRiskyPools()
        }
      })
      .finally(() => setForm(defaults))
  }

  const { riskFree } = form

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Row>
          <div className="input-group">
            <div className="input">
              <span>Pool Name</span>
              <SuggestedInput
                value={form.poolName}
                onChange={e => handleForm('poolName', e.target.value)}
                suggests={poolNames.filter(n => n.toLowerCase().includes(form.poolName.toLowerCase()))}
                onSuggest={val => handleForm('poolName', val)}
              />
            </div>
          </div>
          {/* <div className="input-group">
            <div className="input">
              <span>Token Symbol</span>
              <input
                type="number"
                value={form.symbol}
                onChange={e => handleForm('symbol', e.target.value)}
              />
            </div>
          </div> */}
          <div className="input-group">
            <div className="input select">
              <span htmlFor="riskFree">PoolType Type</span>
              <select
                value={form.riskFree}
                onChange={e => handleForm('riskFree', Number(e.target.value))}
              >
                <option value={1}>Harbour</option>
                <option value={0}>High Water</option>
              </select>
            </div>
          </div>
        </Row>
        <Row>
          <div className="input-group">
            <div className="input">
              <span htmlFor="feePercentI">Fee Percentage per I token</span>
              <input
                name="feePercentI"
                placeholder="Fee %"
                value={form.feePercentI}
                onChange={e => handleForm('feePercentI', e.target.value)}
              />
            </div>
          </div>
          {!riskFree ? (
            <div className="input-group">
              <div className="input">
                <span htmlFor="feePercentS">Fee Percentage per S token</span>
                <input
                  name="feePercentS"
                  placeholder="Fee %"
                  value={form.feePercentS}
                  onChange={e => handleForm('feePercentS', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="input-group" />
          )}
        </Row>
        <Row>
          <div className="input-group">
            <div className="input select">
              <span htmlFor="currency">Currency</span>
              <select
                value={form.currency}
                onChange={e => handleForm('currency', e.target.value)}
              >
                <option defaultValue>Choose Currency</option>
                {currencies.map((token, idx) => (
                  <option value={token} key={idx}>
                    {token}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-group">
            <div className="input select">
              <span htmlFor="onlyMe">Contribute Type</span>
              <select
                value={form.onlyMe}
                onChange={e => handleForm('onlyMe', Number(e.target.value))}
              >
                <option value={0} disabled>
                  Open to all
                </option>
                <option value={1}>Only Me</option>
              </select>
            </div>
          </div>
        </Row>
        <Row>
          <div className="input-group">
            <div className="input">
              <span htmlFor="exchangeRate">Initial Exchange Rate</span>
              <input
                name="exchangeRate"
                placeholder="Rate %"
                value={form.exchangeRate}
                onChange={e => handleForm('exchangeRate', e.target.value)}
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input">
              <span htmlFor="expiryLimit">Maximum expiry limit</span>
              <div>
                <input
                  name="expiryLimit"
                  placeholder="..."
                  value={form.expiryLimit}
                  onChange={e => handleForm('expiryLimit', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Row>
        <Actions>
          <Button type="submit">Create Pool</Button>
          <Button type="button" className="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Actions>
      </Form>
      <PopupBox>
        {success && (
          <Success>
            <Popup>
              <h1>{form.poolName}</h1>
              <p>has been created Succesfully</p>
              <div className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quisnostrud exercitation ullamco.
              </div>
              <div className="actions">
                <Button onClick={onClose}>View Pool</Button>
              </div>
            </Popup>
          </Success>
        )}
      </PopupBox>
    </Wrapper>
  )
}
