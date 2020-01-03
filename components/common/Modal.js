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

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;

  label {
    margin-bottom: 10px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;

  button {
    margin-left: 10px;
  }
`

function Modal({ title, fields, defaults, onSubmit, onClose }) {
  const [form, setForm] = useState(defaults)
  const valid = fields.every(({ required }) => !required || required(form))
  const [submitting, setSubmitting] = useState(false)

  return (
    <Wrapper onMouseDown={onClose}>
      <Content onMouseDown={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            onSubmit(form)
            setSubmitting(true)
          }}
        >
          {fields.map(({ key, label, required, type, options, ...props }) => (
            <InputField key={key}>
              <label>{label}</label>
              {type === 'select' ? (
                <select
                  defaultValue={null}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                >
                  <option defaultValue>None</option>
                  {options.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              ) : (
                <input
                  {...props}
                  type={type}
                  value={form[key] || ''}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
              )}
            </InputField>
          ))}
          <Footer>
            <button type="submit" disabled={!valid || submitting}>
              Submit
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </Footer>
        </form>
      </Content>
    </Wrapper>
  )
}

export default Modal
