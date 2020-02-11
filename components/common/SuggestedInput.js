import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;

  .autocomplete-items {
    position: absolute;
    border: 1px solid #d4d4d4;
    border-bottom: none;
    border-top: none;
    z-index: 99;
    top: 100%;
    left: 0;
    right: 0;

    > div {
      padding: 10px;
      cursor: pointer;
      background-color: #fff;
      border-bottom: 1px solid #d4d4d4;

      &:hover {
        background-color: #e9e9e9;
      }
    }
  }
`

export default ({ suggests, onSuggest, ...props }) => {
  const [focus, setFocus] = useState(true)

  return (
    <Wrapper>
      <input
        {...props}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 100)}
      />
      {focus && (
        <div className="autocomplete-items">
          {suggests.map((s, idx) => (
            <div
              key={idx}
              onClick={e => {
                console.log(e)
                e.preventDefault()
                e.stopPropagation()
                onSuggest(s)
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </Wrapper>
  )
}
