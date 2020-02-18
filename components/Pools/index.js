import { useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Accordion from '~/components/common/Accordion'
import Tabs from '~/components/common/Tabs'
import SuggestedInput from '~/components/common/SuggestedInput'

import PoolList from './PoolList'
import PoolDetail from './PoolDetail'

import Static from '~/components/assets/images/icons/Static.svg'
import filter from '~/components/assets/images/icons/filter.svg'
import arrowRight from '~/components/assets/images/icons/arrow-right.svg'

const Search = styled.div`
  position: relative;
  font-size: 14px;

  img {
    position: absolute;
    right: 10px;
    top: 8px;
  }

  input {
    background: #f0f0f0;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    padding: 5px 15px;
    font-size: 14px;
  }
`

const Utilization = styled.div`
  position: relative;
  width: 100%;
  background: rgba(196, 196, 196, 0.5);
  border-radius: 3px;
  height: 4px;
  overflow: hidden;

  .percent {
    height: 4px;
    background: #0d9181;
    border-radius: 3px;
  }
`

export default function Pools(props) {
  const router = useRouter()
  const id = router.query && router.query.id ? Number(router.query.id) : -1
  const { riskFree, riskFreePools, riskyPools } = props
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')

  const tabs = [
    {
      value: 0,
      label: 'Market',
    },
    {
      value: 1,
      label: 'My Pools',
    },
  ]

  const headers = [
    {
      label: 'Pool',
      key: 'name',
      width: 150,
      main: true,
    },
    {
      label: 'Poolshare Balance',
      key: 'poolShareBalance',
      width: 142,
    },
    {
      label: 'Deposite Rate',
      key: '',
      width: 133,
      access: ({ currency, depositeRate: val }) =>
        `${val ? (1 / val).toFixed(2) : 0} ${currency}`,
    },
    {
      label: 'Withdrawal Rate',
      key: 'withdrawalRate',
      width: 235,
      render: ({ markets: { mfts } }) =>
        mfts
          .map(
            ({ name, rate }) => `${rate.toFixed(2)} ${name.replace(/_/gi, '')}`
          )
          .join(', '),
    },
    {
      label: 'Fee',
      key: '',
      width: 82,
      access: ({ feePercentI, feePercentS }) => (
        <>
          {feePercentI} % (I)
          {!!Number(feePercentS) && <span>, {feePercentS} % (S)</span>}
        </>
      ),
    },
    {
      label: 'Total Contribution',
      key: '',
      width: 151,
      access: ({ currency, totalContributions: val }) =>
        `${val.toFixed(4)} ${currency}`,
    },
    {
      label: 'Utilization',
      width: 140,
      render: ({ utilization }) => (
        <Utilization>
          <div className="percent" style={{ width: `${utilization * 100}%` }} />
        </Utilization>
      ),
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    {
      width: 65,
      render: () => <img src={arrowRight} />,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
    },
  ]

  const origin = (riskFree ? riskFreePools : riskyPools) || []
  const data = tab === 1 ? origin.filter(({ isOwner }) => isOwner) : origin

  return id === -1 ? (
    <Accordion>
      <div className={`accordion with-actions`}>
        <div className="label">
          <div className="icon">
            <img src={Static} />
          </div>
          Pools
        </div>
        <Search>
          <SuggestedInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            suggests={data
              .map(({ name }) => name)
              .filter(name => name.includes(search))}
            onSuggest={val => setSearch(val)}
            placeholder="Search ..."
          />
          <img src={filter} />
        </Search>
      </div>
      <div className={`panel`}>
        <Tabs>
          {tabs.map(({ value, label }) => (
            <div
              key={value}
              className={`tab ${tab === value ? 'active' : ''}`}
              onClick={() => setTab(value)}
            >
              {label}{' '}
              {search
                ? `(${
                    data.filter(
                      ({ name, isOwner }) =>
                        name.includes(search) && (value !== 1 || isOwner)
                    ).length
                  })`
                : ''}
            </div>
          ))}
        </Tabs>
        <PoolList
          riskFree={riskFree}
          data={data.filter(({ name }) => name.includes(search))}
          headers={headers}
        />
      </div>
    </Accordion>
  ) : (
    <PoolDetail id={id} {...props} />
  )
}
