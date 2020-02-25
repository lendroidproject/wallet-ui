import { useState } from 'react'
import Accordion from '~/components/common/Accordion'
import List from '~/components/common/List'
import Table from '~/components/common/Table'
import Modal from '~/components/common/Modal'

import BalanceItem from './components/BalanceItem'
import WrappedItem from './components/WrappedItem'
import SplittedItem from './components/SplittedItem'

import WalletBalance from '~/components/assets/images/icons/WalletBalance.svg'
import Wrapped from '~/components/assets/images/icons/Wrapped.svg'
import SUFITokens from '~/components/assets/images/icons/SUFI_Tokens.svg'
import HarbourTokens from '~/components/assets/images/icons/Harbour_Tokens.svg'
import HighWaterTokens from '~/components/assets/images/icons/HighWater_Tokens.svg'

const headers = {
  tokens: [
    {
      label: 'Name',
      key: 'token',
      style: { textAlign: 'left' },
    },
    {
      label: 'Balance',
      key: 'balance',
      precision: 3,
    },
  ],
  wrappedTokens: [
    {
      label: 'Name',
      key: '',
      access: ({ name, token: val }) => name || val.split('_')[1],
      style: { textAlign: 'left' },
    },
    {
      label: 'Balance',
      key: 'balance',
      precision: 3,
    },
  ],
  sufiTokens: [
    {
      label: 'T',
      key: 'token',
      access: val => val.split('_')[0],
      style: { textAlign: 'left' },
    },
    {
      label: 'Name',
      key: 'token',
      access: val => val.split('_')[1],
      style: { textAlign: 'left' },
    },
    {
      label: 'Expiry',
      key: 'token',
      access: val => val.split('_')[2],
    },
    {
      label: 'Underlying',
      key: 'token',
      access: val => val.split('_')[3],
    },
    {
      label: 'Strike',
      key: 'strike',
      key: 'token',
      access: val => val.split('_')[4],
    },
    {
      label: 'Balance',
      key: 'balance',
      precision: 3,
    },
  ],
  poolshareTokens: [
    {
      label: 'Name',
      key: 'symbol',
      style: { textAlign: 'left' },
    },
    {
      label: 'Token Balance',
      key: 'balance',
      precision: 3,
    },
  ],
}

const enumSlots = {
  wrap: 1,
  unwrap: 1,
  withdraw: 1,
  split: 2,
  fuse: 3,
}

const formFields = {
  1: defaults => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        type: 'number',
        autoFocus: true,
      },
    ],
    defaults,
  }),
  2: (defaults, options = {}) => ({
    fields: [
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        type: 'number',
        autoFocus: true,
      },
      {
        key: 'expiry',
        label: 'Expiry',
        required: ({ expiry }) => !!expiry,
        type: 'select',
        options: options.expiries,
        noNoneValue: true,
        valueKey: 'name',
        labelValue: ({ name, date }) => `${name} (${date})`,
      },
      {
        key: 'underlying',
        label: 'Underlying',
        required: ({ underlying, strike }) =>
          (underlying && Number(strike)) || (!underlying && !Number(strike)),
        type: 'select',
        options: options.underlying,
      },
      {
        key: 'strike',
        label: 'Strike Price',
        required: ({ underlying, strike }) =>
          (underlying && Number(strike)) || (!underlying && !Number(strike)),
        type: 'number',
      },
    ],
    defaults,
  }),
  3: (defaults, options) => ({
    fields: [
      {
        key: 'token',
        label: 'Fuse Token',
        type: 'select',
        options: options.tokens,
        noNoneValue: true,
        labelValue: ({ token }) =>
          token
            .replace('S_', '')
            .replace('F_', '')
            .replace(/_-/gi, ''),
        onUpdate: ({ token, balance }, { form, setForm }) => {
          setForm({
            ...form,
            amount: balance,
            expiry: token.split('_')[2],
            underlying: token.split('_')[3].replace('-', ''),
            strike: token.split('_')[4].replace('-', '0'),
          })
        },
        hidden: options.tokens.length <= 1,
      },
      {
        key: 'amount',
        label: 'Amount',
        required: ({ amount }) => !!amount,
        type: 'number',
        autoFocus: true,
      },
      {
        key: 'expiry',
        label: 'Expiry',
        type: 'text',
        disabled: true,
      },
      {
        key: 'underlying',
        label: 'Underlying',
        type: 'text',
        disabled: true,
      },
      {
        key: 'strike',
        label: 'Strike Price',
        type: 'number',
        disabled: true,
      },
    ],
    defaults,
  }),
}

export default function({
  type,
  library,
  panel,
  onPanel,
  supportTokens,
  riskFreePools = [],
  riskyPools = [],
}) {
  const { expiries } = library.contracts || {}
  const [modal, setModal] = useState(null)
  const poolShareTokens = [
    ...riskFreePools.map(({ id, poolShareToken }) => ({
      riskFree: true,
      id,
      ...poolShareToken,
    })),
    ...riskyPools.map(({ id, poolShareToken }) => ({
      riskFree: false,
      id,
      ...poolShareToken,
    })),
  ]

  const selection = panel && panel.token

  const tabs = [
    {
      value: 'tokens',
      label: (
        <>
          <div className="icon">
            <img src={WalletBalance} />
          </div>
          Wallet Balance&nbsp;<span>({type})</span>
        </>
      ),
      filter: ({ token }) => !token.includes('_'),
      render: BalanceItem,
    },
    {
      value: 'wrappedTokens',
      label: (
        <>
          <div className="icon">
            <img src={Wrapped} />
          </div>
          Wrapped Tokens
        </>
      ),
      filter: ({ token }) => token.includes('L_'),
      render: WrappedItem,
    },
    {
      value: 'sufiTokens',
      label: (
        <>
          <div className="icon">
            <img src={SUFITokens} />
          </div>
          SUFI Tokens
        </>
      ),
      filter: ({ token, balance }) =>
        (token.includes('S_') ||
          token.includes('F_') ||
          token.includes('U_') ||
          token.includes('I_')) &&
        balance >= 0,
      sort: ({ token: t1 }, { token: t2 }) =>
        Number(t1.split('_')[2]) - Number(t2.split('_')[2]),
      render: SplittedItem,
      itemProps: {
        expiries,
      },
    },
    {
      value: 'poolshareTokens',
      label: (
        <>
          <div className="icon">
            <img src={HarbourTokens} />
          </div>
          Poolshare Tokens
        </>
      ),
      type: 'Table',
    },
  ]

  const handleModal = (form, callback) => {
    const { token, slot } = modal
    switch (slot) {
      case 'withdraw': {
        const { poolId, riskFree } = modal
        const { amount } = form
        library.contracts
          .onWithdrawContribute(poolId, amount, { riskFree: !riskFree })
          .then(() => {
            if (riskFree) {
              library.contracts.getRiskFreePools()
            } else {
              library.contracts.getRiskyPools()
            }
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

  const handleAction = async (value, slot, data, callback) => {
    switch (slot) {
      case 'wrap':
      case 'unlock': {
        const { token } = data
        const { contracts, address, web3Utils } = library.contracts
        if (contracts[token]) {
          contracts[token].methods
            .allowance(address, contracts.CurrencyDao._address)
            .call()
            .then(allowance => {
              const { amount } = value
              if (Number(allowance) === 0) {
                contracts[token].methods
                  .approve(
                    contracts.CurrencyDao._address,
                    web3Utils.toWei(amount)
                  )
                  .send({ from: address })
                  .then(() => {
                    library.contracts.getBalances()
                  })
              } else {
                library.contracts.onWrap(token, amount).then(() => {
                  library.contracts.getBalances()
                  callback && callback()
                })
              }
            })
        }
        break
      }
      case 'unwrap': {
        const token = data.token.replace('L_', '')
        const { amount } = value
        library.contracts.onUnwrap(token, amount).then(() => {
          library.contracts.getBalances()
          callback && callback()
        })
        break
      }
      case 'split': {
        const token = data.token.replace('L_', '')
        const { type, amount, expiry, underlying, strike } = value
        library.contracts
          .onSplit(token, {
            amount,
            expiry,
            underlying: type ? underlying : undefined,
            strike: type ? Number(strike) : undefined,
          })
          .then(() => {
            library.contracts.getBalances(true)
            callback && callback()
          })
        break
      }
      case 'fuse': {
        const { token } = data
        const [, , expiry, underlying, strike] = token
          .replace(/-/gi, '')
          .split('_')
        const { amount } = value
        library.contracts
          .onFuse(token, {
            amount,
            expiry,
            underlying,
            strike: Number(strike),
          })
          .then(() => {
            library.contracts.getBalances()
            callback && callback()
          })
        break
      }
      case 'withdraw': {
        const { id: poolId, name, poolShareBalance, riskFree } = data
        setModal({
          slot,
          poolId,
          riskFree,
          title: `Withdraw from ${name}`,
          data: formFields[enumSlots.withdraw]({
            amount: poolShareBalance,
          }),
        })
        break
      }
      case 'transfer': {
        const { token, id } = data
        const { amount, to } = value
        library.contracts
          .onTransfer({ token: token.replace(/_-/g, ''), amount, to, id })
          .then(() => {
            library.contracts.getBalances()
            callback && callback()
          })
        break
      }
      default:
        console.log(value, slot, data)
    }
  }

  return (
    <Accordion>
      {tabs.map(
        ({ type = 'List', value, label, filter, sort, render, itemProps }) => {
          const data =
            value === 'poolshareTokens' ? poolShareTokens : supportTokens
          const selectProps = {
            selection,
            onSelect: d => {
              onPanel(
                d
                  ? {
                      value,
                      token: d.token,
                      onAction: handleAction,
                      relations: supportTokens
                        .filter(
                          ({ token, balance }) =>
                            token != d.token &&
                            ((d.token[0] !== 'F' &&
                              token.includes(
                                `S_${d.token.split('_')[1]}_${
                                  d.token.split('_')[2]
                                }`
                              )) ||
                              (d.token[0] !== 'F' &&
                                token.includes(
                                  `U_${d.token.split('_')[1]}_${
                                    d.token.split('_')[2]
                                  }`
                                )) ||
                              (d.token[0] === 'I' &&
                                token.includes(
                                  `F_${d.token.split('_')[1]}_${
                                    d.token.split('_')[2]
                                  }`
                                )) ||
                              (!['S', 'U'].includes(d.token[0]) &&
                                token.includes(
                                  `F_${d.token.split('_')[1]}_${
                                    d.token.split('_')[2]
                                  }`
                                )) ||
                              token.includes(
                                `I_${d.token.split('_')[1]}_${
                                  d.token.split('_')[2]
                                }`
                              )) &&
                            Number(balance) > 0
                        )
                        .map(({ token }) => token),
                    }
                  : null
              )
            },
          }
          return (
            <div key={value}>
              <div className={`accordion`}>{label}</div>
              <div className={`panel`}>
                {type === 'List' && (
                  <List
                    headers={headers[value] || []}
                    data={filter ? data.filter(filter) : data}
                    sort={sort}
                    render={render || (() => <div>Coming soon</div>)}
                    selectable
                    itemProps={itemProps}
                    relations={panel && panel.relations}
                    {...selectProps}
                  />
                )}
                {type === 'Table' && (
                  <Table
                    headers={headers[value] || []}
                    data={filter ? data.filter(filter) : data}
                    sort={sort}
                    onAction={(slot, data) => handleAction(value, slot, data)}
                  />
                )}
              </div>
            </div>
          )
        }
      )}
      {!!modal && (
        <Modal
          title={modal.title || 'Input Fields'}
          {...modal.data}
          onSubmit={handleModal}
          onClose={() => setModal(null)}
        />
      )}
    </Accordion>
  )
}
