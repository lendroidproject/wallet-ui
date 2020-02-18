import Link from 'next/link'
import styled from 'styled-components'
import { getDisplayData } from '~/components/common/Table'

const Wrapper = styled.div``

const Row = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden;

  margin: 8px 0;

  .field {
    font-size: 12px;
    color: #606060;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`

const Header = styled(Row)`
  .field {
    padding: 3px 20px;
  }
`

export const Item = styled(Row)`
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 4px;

  &:hover {
    background: rgba(70, 187, 157, 0.1);
  }

  &.mine .field:first-child {
    border-left: 3px solid #f7931a;
    padding-left: 17px;
  }

  .field {
    padding: 10px 20px;
    cursor: pointer;

    &.main {
      color: #212121;
      font-weight: bold;
    }
  }
`

export default function({ riskFree, data, headers }) {
  return (
    <Wrapper>
      <Header>
        {headers.map((h, hIndex) => (
          <div
            className={`field header`}
            key={hIndex}
            style={{ ...h.style, width: `${h.width}%` }}
          >
            {h.label}
          </div>
        ))}
      </Header>
      {data.map(d => (
        <Link
          key={d.id}
          href={`${riskFree ? 'lender' : 'underwriter'}?id=${d.id}`}
        >
          <Item className={d.isOwner ? 'mine' : ''} key={d.id}>
            {headers.map((h, hIndex) => (
              <div
                className={`field ${h.main ? 'main' : ''}`}
                key={hIndex}
                style={{ ...h.style, width: `${h.width}%` }}
              >
                {getDisplayData(d, h)}
              </div>
            ))}
          </Item>
        </Link>
      ))}
    </Wrapper>
  )
}
