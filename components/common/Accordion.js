import styled from 'styled-components'

export default styled.div`
  .accordion {
    color: #444;
    margin: 0 28px;
    width: auto;
    padding: 24px 0 10px;
    border: none;
    text-align: left;
    outline: none;

    font-weight: bold;
    font-size: 16px;
    line-height: 25px;
    color: #12161e;

    display: flex;
    align-items: center;

    &.with-actions {
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1.5px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;

      .label {
        display: flex;
        align-items: center;
      }
    }

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
    }
  }

  .panel {
    padding: 0 28px;
  }
`
