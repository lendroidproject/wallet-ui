import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;

  form {
    text-align: left;
    max-width: 560px;
    margin: 0 auto;

    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
      padding: 10px;
    }
  }
`

const InputFields = styled.div`
  display: flex;
  margin-left: -10px;
  margin-right: -10px;

  > div {
    margin: 0 10px 10px;
  }
`

const InputField = styled.div`
  display: flex;
  flex-direction: ${props => (props.inline ? 'row' : 'column')};
  width: 100%;
  margin-bottom: 10px;

  label {
    width: 100%;
    margin-bottom: 10px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;

    &[type='checkbox'] {
      width: 20px;
      height: 20px;
      margin: 10px;
      margin-left: 0;
    }
  }

  > div {
    display: flex;
    align-items: center;
  }
`

function NewPool({ library, poolNames }) {
  const { balanceTokens } = library.contracts

  const defaults = {
    riskFree: false,
    poolName: '',
    feePercentI: 1,
    feePercentS: 1,
    currency: balanceTokens[0],
    onlyMe: false,
    exchangeRate: 50,
    expiryLimit: 90,
  }

  const [form, setForm] = useState(defaults)

  const handleForm = (key, val) => {
    const newForm = { ...form, [key]: val }
    setForm(newForm)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    library.contracts
      .onCreatePool(form)
      .then(() => {
        console.log('Pool Created')
      })
      .finally(() => setForm(defaults))
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <InputField>
          <label htmlFor="riskFree">Pool Type</label>
          <div>
            <input
              name="riskFree"
              type="checkbox"
              value={form.riskFree}
              onChange={e => handleForm('riskFree', e.target.checked)}
            />
            Risk-Free
          </div>
        </InputField>
        <InputField>
          <label htmlFor="poolName">Pool Name</label>
          <div>
            <select
              value={form.poolName}
              onChange={e => handleForm('poolName', e.target.value)}
            >
              <option defaultValue>Choose registered Pool Name</option>
              {poolNames.map((name, idx) => (
                <option value={name} key={idx}>
                  {name}
                </option>
              ))}
            </select>
            &nbsp;<p style={{ fontSize: 18, margin: 0 }}>or</p>&nbsp;
            <input
              autoFocus
              name="poolName"
              maxLength={64}
              placeholder="Enter Pool Name (max 64 charactors)..."
              value={form.poolName}
              onChange={e => handleForm('poolName', e.target.value)}
            />
          </div>
        </InputField>
        <InputFields>
          {/* <InputField>
            <label htmlFor="tokenSymbol">Token Symbol</label>
            <input
              name="tokenSymbol"
              placeholder="Enter Token Symbol"
              value={form.tokenSymbol}
              onChange={e => handleForm('tokenSymbol', e.target.value)}
            />
          </InputField> */}
          <InputField>
            <label htmlFor="feePercentI">Fee Percentage per I token</label>
            <input
              name="feePercentI"
              placeholder="Fee %"
              value={form.feePercentI}
              onChange={e => handleForm('feePercentI', e.target.value)}
            />
          </InputField>
          {form.riskFree ? (
            <InputField>
              <label htmlFor="feePercentS">Fee Percentage per S token</label>
              <input
                name="feePercentS"
                placeholder="Fee %"
                value={form.feePercentS}
                onChange={e => handleForm('feePercentS', e.target.value)}
              />
            </InputField>
          ) : (
            <div />
          )}
        </InputFields>
        <InputFields>
          <InputField>
            <label htmlFor="currency">Currency</label>
            <select
              value={form.currency}
              onChange={e => handleForm('currency', e.target.value)}
            >
              <option disabled>Choose Currency</option>
              {balanceTokens
                .filter(t => t !== 'LST')
                .map((token, idx) => (
                  <option value={token} key={idx}>
                    {token}
                  </option>
                ))}
            </select>
          </InputField>
          <InputField>
            <label htmlFor="onlyMe">Contribute Type</label>
            <div>
              <input
                disabled
                name="onlyMe"
                type="checkbox"
                value={form.onlyMe}
                onChange={e => handleForm('onlyMe', e.target.checked)}
              />
              Only Me
            </div>
          </InputField>
        </InputFields>
        <InputFields>
          <InputField>
            <label htmlFor="exchangeRate">Initial Exchange Rate</label>
            <input
              name="exchangeRate"
              placeholder="Rate %"
              value={form.exchangeRate}
              onChange={e => handleForm('exchangeRate', e.target.value)}
            />
          </InputField>
          <InputField>
            <label htmlFor="expiryLimit">Maximum expiry limit</label>
            <div>
              <input
                name="expiryLimit"
                placeholder="..."
                value={form.expiryLimit}
                onChange={e => handleForm('expiryLimit', e.target.value)}
              />
              &nbsp;days
            </div>
          </InputField>
        </InputFields>
        <div style={{ textAlign: 'center', margin: 20 }}>
          <button type="submit">Create Pool</button>
        </div>
      </form>
    </Wrapper>
  )
}

export default NewPool
