import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 10px;
  table {
    width: 100%;
    text-align: center;

    thead tr th {
      background: lightgrey;
    }

    tbody tr:nth-child(even) td {
      background: lightgrey;
    }

    tr th:last-child,
    tr td:last-child {
      text-align: right;
    }

    th,
    td {
      padding: 10px;
    }
  }
`

function Table({ headers, data = [], sort, actions, onAction }) {
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
            {headers.map((h, hIndex) => (
              <th key={hIndex} style={h.style}>
                {h.label}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(sort ? data.sort(sort) : data).map((d, dIndex) => {
            return (
              <tr key={dIndex}>
                {headers.map((h, hIndex) => (
                  <td key={hIndex} style={h.style}>
                    {getDisplayData(d, h)}
                  </td>
                ))}
                <td>
                  {actions
                    .filter(({ visible }) => !visible || visible(d))
                    .map(({ label, slot }) => (
                      <button key={slot} onClick={() => onAction(slot, d)}>
                        {label}
                      </button>
                    ))}
                </td>
              </tr>
            )
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan={headers.length + 1} style={{ textAlign: 'center' }}>
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
