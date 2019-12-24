import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 10px;
  table {
    width: 100%;
    table-layout: fixed;

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

function Table({ headers, data = [], actions, onAction }) {
  const getDisplayData = (data, header) => {
    let ret = data[header.key]

    if (header.key === 'loanDuration') {
      ret = ret.split(' ')[0]
    }

    if (header.precision) ret = this.setPrecision(ret, header.precision)
    if (header.filter) ret = this[header.filter](ret)
    if (header.suffix) {
      ret = (
        <div>
          {ret} <span>{data[header.suffix] || header.suffix}</span>
        </div>
      )
    } else {
      ret = <div>{ret}</div>
    }
    return ret
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
      </table>
      <table cellPadding="0" cellSpacing="0" border="0">
        <tbody>
          {data.map((d, dIndex) => {
            return (
              <tr key={dIndex}>
                {headers.map((h, hIndex) => (
                  <td key={hIndex} style={h.style}>
                    {getDisplayData(d, h)}
                  </td>
                ))}
                <td>
                  {actions.map(({ label, slot }) => (
                    <button onClick={() => onAction(slot)}>{label}</button>
                  ))}
                </td>
              </tr>
            )
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center' }}>
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
