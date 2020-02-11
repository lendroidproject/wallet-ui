import styled from 'styled-components'

const Wrapper = styled.button`
  background: linear-gradient(122.66deg, #12265e -71.32%, #46bb9d 122.36%);
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 21px;
  border: none;
  color: #ffffff;
  padding: 8px 16px;
  cursor: pointer;
  min-width: 163px;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin-right: 5px;
    position: relative;
    top: -1px;
  }

  &.secondary {
    background: transparent;
    color: #204e6f;
  }
`

export default props => <Wrapper {...props} />
