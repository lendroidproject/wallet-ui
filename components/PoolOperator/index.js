import { useState } from 'react'

import Accordion from '~/components/common/Accordion'
import Tabs from '~/components/common/Tabs'
import Button from '~/components/common/Button'

import { MyPools, NewPool, RegisterPoolName } from './tabs'

import Static from '~/components/assets/images/icons/Static.svg'
import plus from '~/components/assets/images/icons/actions/plus-circle.svg'

export default function(props) {
  const { library } = props
  const [mode, setMode] = useState('list')
  const [tab, setTab] = useState(0)

  const tabs = [
    {
      value: 0,
      label: 'Harbour',
    },
    {
      value: 1,
      label: 'High Water',
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
              {mode === 'list' && 'My Pools'}
              {mode === 'create' && 'New Pool'}
            </div>
            <div className="actions">
              {mode !== 'create' && (
                <Button onClick={() => setMode('create')}>
                  <img src={plus} /> Create Pool
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
                <MyPools riskFree={tab === 0} {...props} />
              </>
            )}
            {mode === 'create' && (
              <NewPool
                riskFree={tab === 0}
                onClose={() => setMode('list')}
                {...props}
              />
            )}
          </div>
        </>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </Accordion>
  )
}
