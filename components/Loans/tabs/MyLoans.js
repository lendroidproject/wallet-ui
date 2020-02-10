import { useState } from 'react'
import styled from 'styled-components'
import Table from '~/components/common/Table'
import Modal from '~/components/common/Modal'

const Wrapper = styled.div`
  text-align: left;
`

const actions = [
]

const formFields = {
  contribute: defaults => ({
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
  withdraw: defaults => ({
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

export default function Positions({ supportTokens, library, positions: data }) {
  const [modal, setModal] = useState(null)

  const fetchPositions = () => {
    library.contracts.getPositions()
  }

  const handleModal = (form, callback) => {
    const { positionId, slot } = modal
    switch (slot) {
      case 'contribute': {
        const { amount } = form
        library.contracts
          .onContribute(positionId, amount, { riskFree })
          .then(() => {
            fetchPositions()
            library.contracts.getBalances()
            setModal(null)
          })
          .catch(() => {
            if (callback) callback()
          })
        break
      }
      case 'withdraw': {
        const { amount } = form
        library.contracts
          .onWithdrawContribute(positionId, amount, { riskFree: !riskFree })
          .then(() => {
            fetchPositions()
            library.contracts.getBalances()
            setModal(null)
          })
          .catch(() => {
            if (callback) callback()
          })
        break
      }
      default:
        console.log(modal, form)
        break
    }
  }

  const handleAction = async (slot, data) => {
    switch (slot) {
      case 'contribute': {
        const { id: positionId, name, currency } = data
        const { balance = 0 } =
          supportTokens.find(({ token }) => token === `L_${currency}`) || {}
        setModal({
          slot,
          positionId,
          title: `Contribute to ${name}`,
          subTitle: `Purchase tokens for L${currency}?`,
          data: formFields.contribute({
            amount: balance,
          }),
        })
        break
      }
      case 'withdraw': {
        const {
          id: positionId,
          name,
          positionShareBalance,
          markets: { mfts },
        } = data
        const mftNames = mfts
          .map(({ name }) => name.replace(/_/gi, ''))
          .join(', ')
        setModal({
          slot,
          positionId,
          title: `Withdraw from ${name}`,
          subTitle: `Withdraw Positionshare tokens for ${mftNames}?`,
          data: formFields.withdraw({
            amount: positionShareBalance,
          }),
        })
        break
      }
      default:
        console.log(slot, data)
        break
    }
  }

  const headers = [
    {
      label: 'Currency',
      key: 'currency',
    },
    {
      label: 'Underlying',
      key: 'underlying',
    },
    {
      label: 'Expiry',
      key: 'expiry',
    },
    {
      label: 'Underlying',
      key: 'underlying',
    },
    {
      label: 'Currency Value',
      key: 'currencyValue',
    },
    {
      label: 'Underlying Value',
      key: 'underlyingValue',
    },
    {
      label: 'Repaid',
      key: 'repaid',
    },
  ]

  return (
    <Wrapper>
      <Table
        headers={headers}
        data={data}
        actions={actions}
        onAction={handleAction}
      />
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
