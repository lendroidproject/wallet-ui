import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Created from '~/components/assets/images/popups/Created.svg'
import close from '~/components/assets/images/popups/close.svg'

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background: #ffffff;
  mix-blend-mode: normal;
  opacity: 0.8;
  z-index: 1;
`

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  width: 100vw;
  top: 0;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Content = styled.div`
  position: relative;
  padding: 28px;
  min-width: 460px;
  z-index: 2;

  background: #ffffff;
  border: 1px solid #efefef;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  .bg {
    position: absolute;
    right: 9px;
    bottom: 7px;
    width: 230px;

    img {
      width: 100%;
    }
  }

  .close {
    position: absolute;
    top: 13px;
    right: 15px;
  }

  .content {
    color: #12161e;

    h1 {
      font-weight: bold;
      font-size: 22px;
      margin: 0 0 4px;
    }

    p {
      font-size: 16px;
      margin: 0 0 4px;
    }

    .description {
      font-size: 10px;
      color: #7a7a7a;
      max-width: 247px;
    }

    .actions {
      margin-top: 32px;
    }
  }
`

export const Success = ({ onClose, ...props }) => (
  <Wrapper>
    <Overlay onClick={onClose} />
    <Content>
      <div className="bg">
        <img src={Created} />
      </div>
      <div className="close">
        <img src={close} />
      </div>
      <div className="content" {...props} />
    </Content>
  </Wrapper>
)

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
`
export const PopupContainer = props => <Container id="poup-box" {...props} />
export const PopupBox = ({ children }) => {
  return ReactDOM.createPortal(children, document.getElementById('poup-box'))
}
