import styled from 'styled-components'

const Wrapper = styled.div`
  table {
    width: 100%;
    text-align: left;

    background: #ffffff;
    border: 1px solid #d8d8d8;
    box-sizing: border-box;
    border-radius: 4px;

    thead tr th {
      font-weight: normal;
      font-size: 12px;
      line-height: 18px;
      color: #949494;
    }

    th {
      padding: 7px 16px;
      border-bottom: 1px solid #D8D8D8;
    }

    td {
      padding: 9px 16px;
      font-weight: bold;
      font-size: 14px;
      line-height: 21px;
      color: #212121;
      border-top: 1px solid rgba(216, 216, 216, 0.3);
    }
  }
`

function Table({
  headers,
  data = [],
  sort,
  actions,
  onAction,
  selectable,
  selection,
  onSelect,
}) {
  const addCommas = value => {
    return (value + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }

  const setPrecision = (value, prec) => {
    const up = parseInt(value, 10)
    const down = (
      '000' + parseInt(value * Math.pow(10, prec), 10).toString()
    ).substr(-prec)
    return addCommas(up) + '.' + down
  }

  const getDisplayData = (data, header) => {
    if (header.render) return header.render(data)
    let ret = header.key ? data[header.key] : data
    if (header.access) ret = header.access(ret)
    if (header.precision) ret = setPrecision(ret, header.precision)
    return <div>{ret || '-'}</div>
  }

  return (
    <Wrapper>
      <table cellPadding="0" cellSpacing="0" border="0">
        <thead>
          <tr>
            {selectable && <th />}
            {headers.map((h, hIndex) => (
              <th key={hIndex} style={h.style}>
                {h.label}
              </th>
            ))}
            {actions && actions.lenght && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {(sort ? data.sort(sort) : data).map((d, dIndex) => {
            return (
              <tr key={dIndex}>
                {selectable && (
                  <th>
                    <input
                      type="checkbox"
                      checked={selection === dIndex + 1}
                      onChange={e => {
                        if (e.target.checked) {
                          onSelect(dIndex + 1)
                        } else {
                          onSelect(0)
                        }
                      }}
                    />
                  </th>
                )}
                {headers.map((h, hIndex) => (
                  <td key={hIndex} style={h.style}>
                    {getDisplayData(d, h)}
                  </td>
                ))}
                {actions && actions.lenght && (
                  <td>
                    {actions
                      .filter(({ visible }) => !visible || visible(d))
                      .map(({ label, slot }) => (
                        <button key={slot} onClick={() => onAction(slot, d)}>
                          {label}
                        </button>
                      ))}
                  </td>
                )}
              </tr>
            )
          })}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={headers.length + (selectable ? 2 : 1)}
                style={{ textAlign: 'center' }}
              >
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Wrapper>
  )
}

export default Table
