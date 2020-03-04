import { useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'

import Button from '~/components/common/Button'
import Table from '~/components/common/Table'
import CoinLabel from '~/components/common/CoinLabel'
import Form, { Row, Actions } from '~/components/common/Form'

import search from '~/components/assets/images/icons/search.svg'

const Wrapper = styled.div`
  width: 100%;

  .tables {
    display: flex;
    max-width: unset;
    margin: -14px;
    margin-top: 32px;

    > div {
      margin: 14px;
      width: 100%;
    }
  }

  form .input-group {
    max-width: 186px;
    margin: 5px 7px;
  }
`

const FormRow = styled(Row)`
  max-width: unset;
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
        library.contracts.getPositions()
      })
      .finally(() => setForm(defaults))
  }

  const headers = {
    risky: [
      {
        label: 'Name',
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
        label: 'Name',
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
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <div className="input-group">
            <div className="input select">
              <span htmlFor="currency">I want a Loan</span>
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
              <span htmlFor="expiry">I will Repay</span>
              <select
                value={form.expiry}
                onChange={e => handleForm('expiry', e.target.value)}
              >
                <option defaultValue>Choose Expiry</option>
                {expiries.map(({ name, timestamp }, idx) => (
                  <option value={name} key={idx}>
                    {name} - {moment.unix(timestamp).format('D MMM, YY')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-group">
            <div className="input select">
              <span htmlFor="underlying">Collateral</span>
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
            </div>
          </div>
          <div className="input-group">
            <div className="input">
              <span htmlFor="amount">Loan Amount</span>
              <input
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={e => handleForm('amount', e.target.value)}
              />
            </div>
          </div>
        </FormRow>
        <Actions style={{ marginTop: 8, borderTop: 0 }}>
          <Button
            type="submit"
            disabled={
              !selectedData
              //  || Number(selectedData.offered) < Number(form.amount)
            }
          >
            Get Loan
          </Button>
          <Button type="button">
            <img src={search} />
            Search
          </Button>
        </Actions>
      </Form>
      <div className="tables">
        <div>
          <CoinLabel>
            <div className="icon S">S</div>
            Purchse 'S' Tokens
          </CoinLabel>
          <Table
            headers={headers.risky}
            data={riskyData}
            actions={actions}
            onAction={handleAction}
            selectable
            selection={selection}
            onSelect={idx => setSelection(idx)}
          />
        </div>
        <div>
          <CoinLabel>
            <div className="icon I">I</div>
            Purchse 'I' Tokens
          </CoinLabel>
          <Table
            headers={headers.riskFree}
            data={riskFreeData}
            actions={actions}
            onAction={handleAction}
            selectable
            selection={-selection}
            onSelect={idx => setSelection(-idx)}
          />
        </div>
      </div>
    </Wrapper>
  )
}

export default NewPool
