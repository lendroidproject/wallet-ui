import styled from 'styled-components'

const Wrapper = styled.div`
  text-align: center;

  > div {
    font-weight: 300;
    font-size: 20px;
    line-height: 14px;
    color: #6d6d6d;

    background: #eeeeee;
    opacity: 0.8;
    border: 1px solid #ebebf1;
    box-sizing: border-box;
    border-radius: 35px;

    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

    span {
      margin-top: 2px;
    }
  }
`

export default () => {
  return (
    <Wrapper>
      <div>
        <span>=</span>
      </div>
    </Wrapper>
  )
}
