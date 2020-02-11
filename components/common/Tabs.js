import styled from 'styled-components'

const Wrapper = styled.div`
  background: #f0f0f0;
  border-radius: 4px 4px 0px 0px;
  margin-bottom: 16px;

  width: 100%;
  display: flex;

  .tab {
    border-radius: 4px 4px 0px 0px;
    min-width: 157px;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    text-transform: capitalize;
    color: #414141;
    padding: 9px 10px 7px;
    cursor: pointer;

    &.active {
      color: #f9f9f9;
      background: linear-gradient(109.73deg, #121e5e -30.81%, #467cbb 122.37%);
    }
  }
`

export default props => <Wrapper {...props} />
