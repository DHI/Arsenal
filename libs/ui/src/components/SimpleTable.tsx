import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { isString } from 'lodash-es';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableProps,
} from '@mui/material';
import { css } from '../react';

export const SimpleTable = observer<{
  tableProps?: TableProps;
  head?: string[] | { id?: string; cell: React.ReactNode }[];
  body: {
    id?: string;
    cells:
      | string[]
      | {
          id?: string;
          minWidth?: boolean;
          cell: React.ReactNode;
          colSpan?: number;
        }[];
  }[];
  className?: string;
}>(({ body, head, tableProps, className }) => (
  <TableContainer
    css={css`
      tbody tr:last-child td {
        border-bottom: none;
      }

      td {
        padding: 0.5em 0.75em;
      }
    `}
    {...{ className }}
  >
    <Table size="small" stickyHeader {...tableProps}>
      {head && (
        <TableHead>
          <TableRow>
            {head.map((cell, i) => {
              const { value, id } = (() => {
                if (isString(cell)) return { value: cell, id: cell };

                return { id: cell.id ?? i, value: cell.cell };
              })();

              return <TableCell key={id}>{value}</TableCell>;
            })}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {body.map((row, i1) => (
          <TableRow key={row.id ?? i1}>
            {row.cells.map((cell, i2) => {
              const { value, id, minWidth, colSpan } = (() => {
                if (isString(cell))
                  return {
                    value: cell,
                    id: cell,
                    minWidth: false,
                    colSpan: undefined,
                  };

                return { ...cell, id: cell.id ?? i2, value: cell.cell };
              })();

              return (
                <TableCell
                  key={id}
                  colSpan={colSpan}
                  css={css`
                    ${minWidth
                      ? css`
                          width: 1%;
                        `
                      : ''}
                  `}
                >
                  {value}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
));
