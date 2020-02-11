import { useState } from 'react'
import styled from 'styled-components'

import Accordion from '~/components/common/Accordion'
import Tabs from '~/components/common/Tabs'
import Button from '~/components/common/Button'

import { MyLoans, NewLoan } from './tabs'

import Static from '~/components/assets/images/icons/Static.svg'
import plus from '~/components/assets/images/icons/actions/plus-circle.svg'

export default function(props) {
  const { library, positions } = props
  const [mode, setMode] = useState('list')
  const [tab, setTab] = useState(0)

  const tabs = [
    {
      value: 0,
      filter: ['active'],
      label: 'Active',
    },
    {
      value: 1,
      filter: ['closed'],
      label: 'Closed',
    },
    {
      value: 2,
      filter: ['liquidating', 'liquidated_unwithdrawn', 'liquidated_withdrawn'],
      label: 'Liquidated',
    },
  ]

  return (
    <Accordion>
      {library.contracts ? (
        <>
          <div className={`accordion with-actions`}>
            <div className="label">
              <div className="icon">
                <img src={Static} />
              </div>
              {mode === 'list' && 'My Loans'}
              {mode === 'create' && 'New Loan'}
            </div>
            <div className="actions">
              {mode !== 'create' && (
                <Button onClick={() => setMode('create')}>
                  <img src={plus} /> Create Loan
                </Button>
              )}
            </div>
          </div>
          <div className={`panel`}>
            {mode === 'list' && (
              <>
                <Tabs>
                  {tabs.map(({ value, label }) => (
                    <div
                      key={value}
                      className={`tab ${tab === value ? 'active' : ''}`}
                      onClick={() => setTab(value)}
                    >
                      {label}
                    </div>
                  ))}
                </Tabs>
                <MyLoans
                  library={library}
                  data={positions.filter(({ status }) =>
                    tabs[tab].filter.includes(status)
                  )}
                  {...props}
                />
              </>
            )}
            {mode === 'create' && (
              <NewLoan onClose={() => setMode('list')} {...props} />
            )}
          </div>
        </>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </Accordion>
  )
}
