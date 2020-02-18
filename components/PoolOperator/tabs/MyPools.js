import { useState } from 'react'
import styled from 'styled-components'
import Modal from '~/components/common/Modal'

import Pool from './Pool'
import ModalMFT from '../components/ModalMFT'

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

const formFields = {
  offer: (defaults, options = {}) => ({
    fields: [
      {
        key: 'expiry',
        label: 'Expiry',
        required: ({ expiry }) => !!expiry,
        type: 'select',
        autoFocus: true,
        options: options.expiries,
        noNoneValue: true,
        valueKey: 'name',
        labelValue: ({ name, date }) => `${name} (${date})`,
      },
      ...(options.riskFree
        ? []
        : [
            {
              key: 'underlying',
              label: 'Underlying',
              required: ({ underlying, strike }) =>
                (underlying && Number(strike)) ||
                (!underlying && !Number(strike)),
              type: 'select',
              options: options.underlying,
            },
            {
              key: 'strike',
              label: 'Strike Price',
              required: ({ underlying, strike }) =>
                (underlying && Number(strike)) ||
                (!underlying && !Number(strike)),
              type: 'number',
            },
          ]),
      {
        key: 'iCostPerDay',
        label: 'I Cost per day',
        type: 'number',
      },
      ...(options.riskFree
        ? []
        : [
            {
              key: 'sCostPerDay',
              label: 'S Cost per day',
              type: 'number',
            },
          ]),
    ],
    defaults,
  }),
}

export default function MyPools({
  library,
  riskFree,
  riskFreePools,
  riskyPools,
}) {
  const { balanceTokens, expiries } = library.contracts
  const currencies = balanceTokens.filter(t => t !== 'LST')
  const data = ((riskFree ? riskFreePools : riskyPools) || []).filter(
    ({ isOwner }) => isOwner
  )
  const [modal, setModal] = useState(null)
  const [modalMFT, setModalMFT] = useState(null)

  const fetchPools = () => {
    if (riskFree) {
      library.contracts.getRiskFreePools()
    } else {
      library.contracts.getRiskyPools()
    }
  }

  const handleModal = (form, callback) => {
    const { poolId, slot } = modal
    switch (slot) {
      case 'offer': {
        const { expiry, underlying, strike, ...info } = form
        library.contracts
          .onOfferNewToken(poolId, {
            expiry,
            underlying,
            strike: Number(strike),
            ...info,
          })
          .then(() => {
            fetchPools()
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
      case 'offer': {
        const { id: poolId } = data
        setModal({
          slot,
          poolId,
          data: formFields.offer(
            {
              expiry: expiries[0].name,
              strike: '0',
              iCostPerDay: 0.025,
              sCostPerDay: 0.05,
            },
            {
              underlying: currencies,
              expiries,
              riskFree,
            }
          ),
        })
        break
      }
      case 'withdraw': {
        const { id: poolId } = data
        library.contracts.onWithdrawEarnings(poolId, riskFree).then(() => {
          fetchPools()
        })
        break
      }
      case 'close': {
        const { id: poolId } = data
        library.contracts.onClosePool(poolId, riskFree).then(() => {
          fetchPools()
        })
        break
      }
      default:
        console.log(slot, data)
        break
    }
  }

  const handleModalMFT = (slot, form) => {
    const { id: poolId, type, marketInfo, marketInfoParam } = modalMFT
    const { value } = form
    const options = {
      riskFree,
      type,
      marketInfo: marketInfoParam || marketInfo,
    }

    switch (slot) {
      case 'changePrice': {
        library.contracts.onChangePrice(poolId, value, options).then(() => {
          fetchPools()
        })
        break
      }
      case 'increaseCapacity': {
        library.contracts.onIncreaseCapacity(poolId, value, options).then(() => {
          fetchPools()
        })
        break
      }
      case 'decreaseCapacity': {
        library.contracts.onDecreaseCapacity(poolId, value, options).then(() => {
          fetchPools()
        })
        break
      }
      case 'retireToken': {
        library.contracts.onRetireToken(poolId, options).then(() => {
          fetchPools()
        })
        break
      }
      default:
        console.log(slot, form, modalMFT)
        break
    }
  }

  return (
    <Wrapper>
      <div className="list">
        {data.map(pool => (
          <Pool
            className="item"
            key={pool.id}
            data={pool}
            onAction={handleAction}
            onMFTAction={setModalMFT}
          />
        ))}
      </div>
      {!!modal && (
        <Modal
          title="Input Fields"
          {...modal.data}
          onSubmit={handleModal}
          onClose={() => setModal(null)}
        />
      )}
      {!!modalMFT && (
        <ModalMFT
          riskFree={riskFree}
          data={modalMFT}
          onAction={handleModalMFT}
          onClose={() => setModalMFT(null)}
        />
      )}
    </Wrapper>
  )
}
