import { useState, useEffect } from 'react'
import styled from 'styled-components'

import Form, { Row, Actions } from '~/components/common/Form'
import Button from '~/components/common/Button'
import { PopupBox, Success } from '~/components/common/Popup'

const Wrapper = styled.div`
  width: 100%;
`

const Popup = styled.div``

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

export default function({ onClose, library, supportTokens }) {
  const [poolName, setPoolName] = useState('')
  const [success, setSuccess] = useState(false)
  const [stake, setStake] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const dataLST = findItem(supportTokens, 'token', 'LST')
  const {
    address,
    contracts: { LST, CurrencyDao },
    web3Utils,
  } = library.contracts

  const getAllowance = () => {
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
      setSuccess(true)
      library.contracts.getPoolNames()
    })
  }

  useEffect(() => {
    getAllowance()
  }, [])

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Row>
          <div className="input-group">
            <div className="input">
              <span>Pool Name</span>
              <input
                autoFocus
                name="poolName"
                maxLength={64}
                placeholder="Enter Pool Name (max 64 charactors)..."
                value={poolName}
                onChange={handlePoolName}
              />
            </div>
          </div>
        </Row>
        <p>
          LST required to stake is - {stake}{' '}
          {allowance < stake && (
            <Button type="button" className="secondary" onClick={handleUnlock}>
              Unlock LST
            </Button>
          )}
        </p>
        <Actions>
          <Button type="submit" disabled={!poolName || allowance < stake}>
            Register Pool Name
          </Button>
          <Button type="button" className="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Actions>
      </Form>
      <PopupBox>
        {success && (
          <Success>
            <Popup>
              <h1>{poolName}</h1>
              <p>has been registered Succesfully</p>
              <div className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quisnostrud exercitation ullamco.
              </div>
              <div className="actions">
                <Button onClick={onClose}>Create Pool</Button>
              </div>
            </Popup>
          </Success>
        )}
      </PopupBox>
    </Wrapper>
  )
}
