import styled from 'styled-components'

export default styled.div`
  background: #ffffff;
  border: 1px solid #ebebf1;
  box-sizing: border-box;
  box-shadow: 3px 3px 12px rgba(26, 26, 26, 0.08);
  border-radius: 4px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;

  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(18px);
  border-radius: 3px 3px 0px 0px;
  position: relative;
  overflow: hidden;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.3;

    background: linear-gradient(
      187.32deg,
      #53dbff 11.72%,
      #57de87 58.97%,
      #f6b844 85.98%
    );
  }
`

export const Content = styled.div`
  padding: 16px 24px;

  table {
    width: 100%;
    table-layout: fixed;
  }

  td {
    font-size: 12px;
    color: #949494;

    &.main {
      font-size: 14px;
      font-weight: bold;
      color: #606060;
    }
  }
`

export const Footer = styled.div`
  display: flex;
  border-top: 1px solid #ebebf1;

  .action {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    line-height: 21px;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      margin-right: 8px;
    }
  }

  .action:not(:first-child) {
    border-left: 1px solid #ebebf1;
  }
`

export const Action = styled.div`
  width: 30px;
  height: 30px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(93, 195, 169, 0.3);
  border-radius: 10px;
`
