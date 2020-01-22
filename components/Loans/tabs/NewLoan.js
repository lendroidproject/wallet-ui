import { useState } from 'react'
import styled from 'styled-components'

import Table from '~/components/common/Table'

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
    width: 100%;
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
const actions = [
  {
    label: 'Purchase',
    slot: 'purchase',
  },
]

function NewPool({
  library,
  poolNames,
  supportTokens,
  riskyPools,
  riskFreePools,
  ...props
}) {
  const { balanceTokens, expiries } = library.contracts
  const currencies = balanceTokens.filter(t => t !== 'LST')

  const defaults = {
    currency: currencies[0],
    expiry: expiries[0].name,
    underlying: currencies.length > 1 ? currencies[1] : currencies[0],
    amount: 0,
  }

  const [form, setForm] = useState(defaults)

  const handleForm = (key, val) => {
    const newForm = { ...form, [key]: val }
    setForm(newForm)
  }

  const [selection, setSelection] = useState(0)

  const riskyData = riskyPools
    .map(({ id: poolId, name: poolName, markets: { mfts: [lToken, ...mfts] } }) =>
      mfts
        .filter(({ name }) =>
          name.includes(`S_${form.currency}_${form.underlying}_${form.expiry}`)
        )
        .map(({ id: mftIndex, type, rate, offered, marketInfo }) => ({
          riskFree: false,
          id: poolId,
          mftIndex,
          name: poolName,
          rate,
          lRate: `${lToken.rate.toFixed(3)} ${lToken.name}`,
          collateralRatio: 100 / Number(marketInfo[2]),
          offered,
          strike: marketInfo[2],
          type,
          marketInfo,
        }))
    )
    .reduce((a, c) => [...a, ...c], [])
  const riskFreeData = riskFreePools
    .map(({ id: poolId, name: poolName, markets: { mfts: [lToken, ...mfts] } }) =>
      mfts
        .filter(({ name }) => name.includes(`I_${form.currency}_${form.expiry}`))
        .map(({ id: mftIndex, type, rate, offered, marketInfo }) => ({
          riskFree: true,
          id: poolId,
          mftIndex,
          name: poolName,
          rate,
          lRate: `${lToken.rate.toFixed(3)} ${lToken.name}`,
          offered,
          strike: 150,
          type,
          marketInfo,
        }))
    )
    .reduce((a, c) => [...a, ...c], [])

  const selectedData =
    selection > 0
      ? riskyData[selection - 1]
      : selection < 0
      ? riskFreeData[-selection - 1]
      : null

  const handleSubmit = async e => {
    e.preventDefault()
    const { strike } = selectedData
    library.contracts
      .onAvailLoan({ ...form, strike })
      .then(() => {
        console.log('Loan Created')
        library.contracts.getRiskFreePools()
        library.contracts.getRiskyPools()
      })
      .finally(() => setForm(defaults))
  }

  const headers = {
    risky: [
      {
        label: 'Pool',
        key: 'name',
      },
      {
        label: 'Collateral ratio',
        key: 'collateralRatio',
        access: val => `${val.toFixed(3)} %`,
      },
      {
        label: 'Price',
        key: 'lRate',
      },
      {
        label: 'Balance',
        key: 'offered',
        precision: 8,
      },
    ],
    riskFree: [
      {
        label: 'Pool',
        key: 'name',
      },
      {
        label: 'Price',
        key: 'lRate',
      },
      {
        label: 'Balance',
        key: 'offered',
        precision: 8,
      },
    ],
  }

  const handleAction = async (slot, data) => {
    switch (slot) {
      case 'purchase':
        const { id, type, marketInfo } = data
        console.log(marketInfo)
        library.contracts.onPurchase(id, type, marketInfo).then(() => {
          console.log('Token Purchased')
          library.contracts.getRiskFreePools()
          library.contracts.getRiskyPools()
        })
        break
      default:
        console.log(slot, data)
        break
    }
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <InputFields>
          <InputField>
            <label htmlFor="currency">Currency</label>
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
          </InputField>
          <InputField>
            <label htmlFor="underlying">Collateral</label>
            <select
              value={form.underlying}
              onChange={e => handleForm('underlying', e.target.value)}
            >
              <option defaultValue>Choose Collateral</option>
              {currencies.map((token, idx) => (
                <option value={token} key={idx}>
                  {token}
                </option>
              ))}
            </select>
          </InputField>
        </InputFields>
        <InputFields>
          <InputField>
            <label htmlFor="expiry">Expiry</label>
            <select
              value={form.expiry}
              onChange={e => handleForm('expiry', e.target.value)}
            >
              <option defaultValue>Choose Expiry</option>
              {expiries.map(({ name }, idx) => (
                <option value={name} key={idx}>
                  {name}
                </option>
              ))}
            </select>
          </InputField>
          <InputField>
            <label htmlFor="amount">Amount</label>
            <input
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={e => handleForm('amount', e.target.value)}
            />
          </InputField>
        </InputFields>
        <div style={{ textAlign: 'center', margin: 20 }}>
          <button
            type="submit"
            disabled={
              !selectedData
              //  || Number(selectedData.offered) < Number(form.amount)
            }
          >
            Get Loan
          </button>
        </div>
      </form>
      <InputFields>
        <Table
          headers={headers.risky}
          data={riskyData}
          actions={actions}
          onAction={handleAction}
          selectable
          selection={selection}
          onSelect={idx => setSelection(idx)}
        />
        <Table
          headers={headers.riskFree}
          data={riskFreeData}
          actions={actions}
          onAction={handleAction}
          selectable
          selection={-selection}
          onSelect={idx => setSelection(-idx)}
        />
      </InputFields>
    </Wrapper>
  )
}

export default NewPool
