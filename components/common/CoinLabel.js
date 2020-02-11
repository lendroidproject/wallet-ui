import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  font-weight: bold;
  font-size: 16px;
  line-height: 25px;
  color: #12161e;
  margin-bottom: 12px;

  span {
    font-size: 12px;
    line-height: 18px;
    color: #808080;
    text-transform: capitalize;
    font-weight: normal;
  }

  .icon {
    background: #ffffff;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;

    &.S {
      color: #f7931a;
      background: linear-gradient(139.6deg, #fdb662 -9.45%, #ffe9c8 100%);
    }

    &.I {
      color: #2a5ada;
      background: linear-gradient(139.6deg, #6b94ff -9.45%, #c9d8ff 100%);
    }

    &.F {
      color: #188881;
      background: linear-gradient(139.6deg, #4ee2d9 -9.45%, #caf8db 100%);
    }

    &.U {
      color: #2775ca;
      background: linear-gradient(139.6deg, #4190e6 -9.45%, #dcedff 100%);
    }
  }
`

export default props => <Wrapper {...props} />
