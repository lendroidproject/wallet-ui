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

const actions = [
]

const formFields = {
}

export default function ({ library, data }) {
  const [modal, setModal] = useState(null)
  const { expiries } = library.contracts || {}

  const handleModal = (form, callback) => {
    // const { positionId, slot } = modal
    switch (slot) {
      default:
        console.log(modal, form)
        break
    }
  }

  const handleAction = async (slot, data) => {
    switch (slot) {
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
