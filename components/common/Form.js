import styled from 'styled-components'

export default styled.form`
.input-group {
  margin: 5px 0;
  width: 100%;

  label {
    font-size: 12px;
    line-height: 18px;
    color: #949494;
    margin-bottom: 6px;
  }

  .input {
    position: relative;
    width: 100%;

    &.select:after {
      content: '';
      position: absolute;
      right: 12px;
      bottom: 14px;

      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 6px solid #1C2843;
    }
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
    outline: none;

    padding: 27px 18px 8px;

    border: 1px solid #ebebf1;
    border-radius: 4px;
    width: 100%;

    &:focus {
      border-color: #2f8260;
    }
  }

  &.error {
    input, select {
      border-color: #E80000;
    }

    .info {
      color: #E80000;
    }
  }

  select {
    -webkit-appearance: none;
  }

  span {
    font-size: 14px;
    line-height: 21px;
    color: #a5a5a5;
    position: absolute;
    left: 18px;
    bottom: 27px;
    z-index: 1;
    pointer-events: none;
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

export const Row = styled.div`
  display: flex;
  margin-left: -5px;
  margin-right: -5px;
  max-width: 650px;

  > .input-group {
    margin: 5px;
  }
`

export const Actions = styled.div`
  margin-top: 32px;
  border-top: 1.5px solid rgba(0, 0, 0, 0.1);
  padding-top: 16px;
  display: flex;

  button {
    margin-right: 10px;
    min-width: 147px;

    &.secondary {
      min-width: unset;
    }
  }
`
