import { useState } from 'react'
import styled from 'styled-components'
import { TableWrapper } from '~/components/common/Table'
import Form, { Row, Actions } from '~/components/common/Form'
import Button from '~/components/common/Button'

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
`

const Content = styled.div`
  width: 100%;
  max-width: 560px;
  padding: 30px;
  background: white;
  box-shadow: 3px 3px 5px grey;
`

const Footer = styled(Actions)`
  flex-wrap: wrap;
  margin: -5px;

  button {
    font-size: 12px;
    line-height: 1.5;
    padding: 8px;
    min-width: unset;
    margin: 5px;
  }
`

function ModalMFT({ riskFree, data, onAction, onClose }) {
  const [form, setForm] = useState({ value: 0 })
  const [submitting, setSubmitting] = useState(false)

  const { type, offered, expiry, utilization } = data

  const actions = []

  if (['I', 'S'].includes(type)) {
    actions.push({
      label: 'Change Price',
      slot: 'changePrice',
    })
  }
  if ((riskFree && type === 'I') || (!riskFree && type === 'S')) {
    actions.push(
      ...[
        {
          label: 'Increase Capacity',
          slot: 'increaseCapacity',
        },
        {
          label: 'Decrease Capacity',
          slot: 'decreaseCapacity',
        },
      ]
    )
    if (offered > 0) {
      actions.push({
        label: 'Retire Token',
        slot: 'retireToken',
      })
    }
  }

  return (
    <Wrapper
      onMouseDown={onClose}
      onKeyDown={e => (e.keyCode === 27 ? onClose() : null)}
    >
      <Content onMouseDown={e => e.stopPropagation()}>
        <TableWrapper>
          <table>
            <thead>
              <tr>
                <th>Expiry</th>
                <th>Type</th>
                <th>Offered</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{expiry}</td>
                <td>{type}</td>
                <td>{offered}</td>
                <td>{utilization}</td>
                <td>Active</td>
              </tr>
            </tbody>
          </table>
        </TableWrapper>
        <Form onSubmit={e => e.preventDefault()}>
          <Row>
            <div className="input-group">
              <div className="input">
                <span htmlFor="amount">Value</span>
                <input
                  type="number"
                  value={form.value}
                  onChange={e => setForm({ value: e.target.value })}
                />
              </div>
            </div>
          </Row>
          {actions.length > 0 && (
            <Footer
              style={{
                marginTop: 0,
                borderTop: 0,
                paddingTop: 0,
                justifyContent: 'center',
              }}
            >
              {actions.map(({ label, slot }) => (
                <Button
                  type="button"
                  key={slot}
                  onClick={() => onAction(slot, form)}
                >
                  {label}
                </Button>
              ))}
            </Footer>
          )}
        </Form>
      </Content>
    </Wrapper>
  )
}

export default ModalMFT
