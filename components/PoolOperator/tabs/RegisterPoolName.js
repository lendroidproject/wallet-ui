import { useState, useEffect } from 'react'
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
  }
`

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;

  label {
    margin-bottom: 10px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
  }
`

let timerId = undefined
const throttleFunction = (func, delay, ...args) => {
  if (timerId) {
    clearTimeout(timerId)
  }
  timerId = setTimeout(
    (...args) => {
      func(...args)
      timerId = undefined
    },
    delay,
    ...args
  )
}

function findItem(list, key, value) {
  return list.find(({ [key]: val }) => val === value)
}

function RegisterPoolName({ library, supportTokens }) {
  const [poolName, setPoolName] = useState('')
  const [stake, setStake] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const dataLST = findItem(supportTokens, 'token', 'LST')

  const getAllowance = () => {
    const {
      address,
      contracts: { LST, CurrencyDao },
      web3Utils,
    } = library.contracts
    LST.methods
      .allowance(address, CurrencyDao._address)
      .call()
      .then(al => {
        setAllowance(Number(web3Utils.fromWei(al)))
      })
  }

  const handleStake = st => {
    setStake(Number(st))
  }

  const handleUnlock = () => {
    const {
      address,
      contracts: { LST, CurrencyDao },
      web3Utils,
    } = library.contracts
    LST.methods
      .approve(CurrencyDao._address, web3Utils.toWei(dataLST.balance))
      .send({ from: address })
      .then(al => setAllowance(Number(dataLST.balance)))
  }

  const handlePoolName = e => {
    const val = e ? e.target.value : ''
    setPoolName(val)
    throttleFunction(
      len => library.contracts.onRegisterLookUpStake(len).then(handleStake),
      200,
      val.length
    )
  }

  const handleSubmit = e => {
    e.preventDefault()
    library.contracts.onRegisterPoolName(poolName).then(() => {
      handlePoolName()
    })
  }

  useEffect(() => {
    getAllowance()
  }, [])

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <InputField>
          <label htmlFor="poolName">Pool Name</label>
          <input
            autoFocus
            name="poolName"
            maxLength={64}
            placeholder="Enter Pool Name (max 64 charactors)..."
            value={poolName}
            onChange={handlePoolName}
          />
        </InputField>
        <p>
          LST required to stake is - {stake}{' '}
          {allowance < stake && (
            <button type="button" onClick={handleUnlock}>
              Unlock LST
            </button>
          )}
        </p>
        <div style={{ textAlign: 'center' }}>
          <button type="submit" disabled={!poolName || allowance < stake}>
            Register Pool Name
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default RegisterPoolName
