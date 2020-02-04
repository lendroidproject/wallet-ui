import styled from 'styled-components'

const Wrapper = styled.div`
  .list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: -6px;

    .item {
      margin: 6px;
      border: 3px solid transparent;
      position: relative;

      &.selected {
        border-color: #2f8260;
        box-sizing: border-box;
        box-shadow: 3px 3px 10px rgba(25, 60, 2, 0.3);
        border-radius: 4px;
      }
    }
  }
`

export default function({
  data = [],
  sort,
  selectable,
  selection,
  onSelect,
  render,
  itemProps = {},
}) {
  console.log(data)
  return (
    <Wrapper>
      {data.length === 0 ? (
        <div className="no-data">No Data</div>
      ) : (
        <div className="list">
          {(sort ? data.sort(sort) : data).map((d, dIndex) => {
            return (
              <div key={dIndex}>
                {render({
                  ...d,
                  props: {
                    className: `item ${
                      selection === dIndex + 1 ? 'selected' : ''
                    }`,
                    onClick: e => {
                      if (selectable && selection !== dIndex + 1) {
                        onSelect(dIndex + 1)
                      }
                    },
                    ...itemProps,
                  },
                })}
              </div>
            )
          })}
        </div>
      )}
    </Wrapper>
  )
}
