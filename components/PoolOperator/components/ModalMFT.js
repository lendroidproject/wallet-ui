import { useState } from 'react'
import styled from 'styled-components'

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

const Table = styled.div`
  table {
    width: 100%;
    text-align: center;

    thead tr th {
      background: lightgrey;
    }

    tbody tr:nth-child(even) td {
      background: lightgrey;
    }

    th,
    td {
      padding: 10px;
    }
  }
`

const InputField = styled.div`
  display: flex;
  width: 33%;
  margin: 20px auto 0;
  align-items: center;

  label {
    margin-right: 15px;
  }

  input,
  select {
    width: 100%;
    padding: 5px 10px;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;

  button {
    margin: 0 5px;
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
        <Table>
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
        </Table>
        <InputField>
          <label>Value: </label>
          <input
            type="number"
            value={form.value}
            onChange={e => setForm({ value: e.target.value })}
          />
        </InputField>
        {actions.length > 0 && (
          <Footer>
            {actions.map(({ label, slot }) => (
              <button key={slot} onClick={() => onAction(slot, form)}>
                {label}
              </button>
            ))}
          </Footer>
        )}
      </Content>
    </Wrapper>
  )
}

export default ModalMFT
