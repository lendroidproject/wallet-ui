import { useState } from 'react'
import styled from 'styled-components'
import Modal from '~/components/common/Modal'

import Loan from './Loan'

const Wrapper = styled.div`
  text-align: left;

  .list {
    display: flex;
    flex-wrap: wrap;
    margin: -14px;
    align-items: flex-start;

    .item {
      margin: 14px;
      width: 358px;
    }
  }
`

const actions = []

const formFields = {
  repay: defaults => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        autoFocus: true,
      },
    ],
    defaults,
  }),
}

export default function({ library, data, supportTokens }) {
  const [modal, setModal] = useState(null)
  const { expiries } = library.contracts || {}

  const handleModal = (form, callback) => {
    const { positionId, slot } = modal
    switch (slot) {
      case 'repay': {
        const { amount } = form
        library.contracts
          .onRepay(positionId, amount)
          .then(() => {
            library.contracts.getPositions()
            setModal(null)
          })
          .catch(() => {
            if (callback) callback()
          })
      }
      default:
        console.log(modal, form)
        break
    }
  }

  const handleAction = async (slot, data) => {
    switch (slot) {
      case 'repay': {
        const { id: positionId } = data
        setModal({
          slot,
          positionId,
          title: `Repay Loan`,
          data: formFields.repay({
            amount: 0,
          }),
        })
        break
      }
      case 'withdraw': {
        const { id: positionId } = data
        library.contracts
          .onWithdrawCallateral(positionId)
          .then(() => {
            library.contracts.getPositions()
          })
        break
      }
      default:
        console.log(slot, data)
        break
    }
  }

  return (
    <Wrapper>
      <div className="list">
        {data.map(loan => (
          <Loan
            className="item"
            key={loan.id}
            data={loan}
            onAction={handleAction}
            expiries={expiries}
            supportTokens={supportTokens}
          />
        ))}
      </div>
      {!!modal && (
        <Modal
          title={modal.title || 'Input Fields'}
          subTitle={modal.subTitle}
          {...modal.data}
          onSubmit={handleModal}
          onClose={() => setModal(null)}
        />
      )}
    </Wrapper>
  )
}
