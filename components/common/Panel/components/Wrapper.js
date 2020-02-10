import styled from 'styled-components'

export const Wrapper = styled.div`
  .form {
    max-height: 55vh;
    overflow: hidden auto;
  }

  .input-group {
    margin: 5px 0;

    label {
      font-size: 12px;
      line-height: 18px;
      color: #949494;
      margin-bottom: 6px;
    }

    .input {
      position: relative;
    }

    .info {
      font-size: 10px;
      line-height: 15px;
      color: #949494;
      margin-left: 18px;
      margin-top: 2px;
    }

    input, select {
      background: white;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: #1c2843;

      padding: 27px 18px 8px;

      border: 1px solid #ebebf1;
      border-radius: 4px;
      width: 100%;
    }

    span {
      font-size: 14px;
      line-height: 21px;
      color: #a5a5a5;
      position: absolute;
      left: 18px;
      bottom: 27px;
    }

    .radios {
      margin: 6px -11px 24px;
      display: flex;
      flex-wrap: wrap;

      .radio {
        font-weight: 600;
        font-size: 12px;
        line-height: 18px;
        color: #1c2843;
        display: flex;
        align-items: center;
        margin: 0 11px;
        cursor: pointer;

        .check {
          position: relative;
          top: -1px;

          border: 1px solid #204e6f;
          box-sizing: border-box;
          width: 12px;
          flex: 0 0 12px;
          height: 12px;
          border-radius: 6px;
          margin-right: 8px;
        }

        &.active .check:after {
          content: '';
          position absolute;

          width: 6px;
          height: 6px;
          background: #204E6F;
          border-radius: 50%;
          left: 2px;
          top: 2px;
        }
      }
    }
  }
`
