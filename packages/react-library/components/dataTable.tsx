import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@material-ui/core';
import {
  ArrowDownward as DownArrowIcon,
  ArrowUpward as UpArrowIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
} from '@material-ui/icons';
import { orderBy } from 'lodash';
import { observer } from 'mobx-react-lite';
import { Instance, types as t } from 'mobx-state-tree';
import * as React from 'react';
import styled from 'styled-components';
import { SetterAction } from './support/utils';

export const DataTable: React.FC<{
  table: ITableModel;
  Row: React.FC<{
    row: ITableModel['rows'][number];
    index: number;
  }>;
}> = observer(({ table, Row }) => {
  const colSpan = table.columns.length + 2;
  const sortableColumnRange = [1, table.columns.length - 1];

  return (
    <>
      <styles.DataTable size="small">
        <TableHead>
          <TableRow>
            {table.columns.map((name, i) => {
              const isSortable =
                i >= sortableColumnRange[0] && i < sortableColumnRange[1];

              const isSorting = table.columnSortIndex === i;

              return (
                <TableCell
                  key={name + i}
                  className={[
                    isSortable && 'isSortable',
                    isSorting && 'isSorting',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => isSortable && table.toggleColumnSort(i)}
                >
                  {name}
                  {isSorting && (
                    <>
                      {table.columnSortDirection === 'asc' ? (
                        <UpArrowIcon fontSize="inherit" color="primary" />
                      ) : (
                        <DownArrowIcon fontSize="inherit" color="primary" />
                      )}
                    </>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.pageRows.map((row, i) => (
            <Row key={i} row={row} index={i} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={colSpan}>
              <TablePagination
                rowsPerPageOptions={[10, 15, 20, 25, 30]}
                component="div"
                count={table.rowCount}
                rowsPerPage={table.rowsLimit}
                page={table.currentPage - 1}
                onChangePage={(e, n) => table.goToPage(n)}
                onChangeRowsPerPage={(e) =>
                  table.set({ rowsLimit: e.target.value as any })
                }
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </styles.DataTable>
    </>
  );
});

export const DataTableFilter: React.FC<{
  table: ITableModel;
  selections: typeof SelectionsModel.Type;
}> = observer(({ table, selections }) => {
  return (
    <>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Button
            variant={!selections.hasSelection ? 'outlined' : 'contained'}
            disabled={!selections.hasSelection}
            onClick={() => selections.clearSelections()}
            startIcon={<CancelIcon />}
          >
            Deselect ({selections.selections.length})
          </Button>
        </Grid>
        <Grid item>
          <Box p={1}>
            <TextField
              label="Search Filter"
              value={table.searchTextFilter}
              onChange={(e) =>
                table.set({
                  searchTextFilter: e.target.value as string,
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="disabled" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <CancelIcon
                      style={{
                        opacity: !table.searchTextFilter ? 0 : 0.5,
                        cursor: 'pointer',
                      }}
                      onClick={() => table.set({ searchTextFilter: '' })}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
});

const styles = {
  DataTable: styled(Table)`
    && {
      td,
      th {
        padding: 0 0.5em 0 1em;
        font-size: 0.95em;
      }

      th {
        width: 1px;
        white-space: nowrap;
        background: #efefef;
        padding-top: 1em;
        padding-bottom: 1em;

        &.isSortable {
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }

        &.isSorting {
          font-weight: 600;
        }

        /* Sort icons */
        svg {
          margin-left: 0.5em;
          font-size: 1.2em;
        }
      }

      td,
      th {
        &:first-child,
        &:last-child {
          width: 1%;
        }
        &:last-child {
          text-align: right;
        }
      }

      tr:hover .actions {
        opacity: 1;
      }

      .actions {
        white-space: nowrap;
        opacity: 0.75;
        transition: opacity 0.2s ease;
      }
    }
  `,
};

export const AbstractTableModel = t
  .model('TableModel', {
    rowsLimit: 10,
    columnSortIndex: t.maybe(t.number),
    columnSortDirection: t.optional(t.enumeration(['desc', 'asc']), 'desc'),
  })
  .volatile((self) => ({
    rowsOffset: 0,
    searchTextFilter: '',
  }))
  .views((self) => ({
    get columns(): string[] {
      return ['columns', 'not implemented'];
    },
    get rows(): string[][] {
      return [['rows', 'not implemented']];
    },
    get currentPage() {
      return Math.max(1, self.rowsOffset / self.rowsLimit + 1);
    },
  }))
  .views((self) => ({
    get filteredRows() {
      const rows = self.rows.filter((cols) => {
        if (!self.searchTextFilter) return true;

        return cols
          .join(' ')
          .toLowerCase()
          .includes(self.searchTextFilter.toLowerCase());
      });

      if (self.columnSortIndex) {
        return orderBy(
          rows,
          self.columnSortIndex,
          self.columnSortDirection,
        ) as typeof rows;
      }

      return rows;
    },
  }))
  .views((self) => ({
    get pageRows() {
      const to = self.rowsOffset + self.rowsLimit;

      return self.filteredRows.slice(self.rowsOffset, to);
    },
    get rowCount() {
      return self.filteredRows.length;
    },
    get pageCount() {
      return Math.floor(self.filteredRows.length / self.rowsLimit) + 1;
    },
  }))
  .actions((self) => {
    const actions = {
      set: SetterAction(self),
      goToPage(page: number) {
        if (page === 0) {
          self.rowsOffset = 0;
          return;
        }
        self.rowsOffset = Math.max(1, page) * self.rowsLimit;
      },

      toggleColumnSort(colIndex: number) {
        if (
          self.columnSortIndex === colIndex &&
          self.columnSortDirection === 'asc'
        ) {
          // Cycle complete, remove sorting
          self.columnSortIndex = undefined;
          return;
        }

        if (
          self.columnSortIndex === colIndex &&
          self.columnSortDirection === 'desc'
        ) {
          // Move from desc to asc
          self.columnSortDirection = 'asc';
          return;
        }

        // Set initial sorting for new column
        self.columnSortDirection = 'desc';
        self.columnSortIndex = colIndex;
      },
    };
    return actions;
  });

export const CreateTableModel = <
  R extends (readonly string[])[],
  C extends readonly string[]
>(
  views: (self: typeof AbstractTableModel.Type) => { rows: R; columns: C },
) => AbstractTableModel.extend((self) => ({ views: views(self) }));

export type ITableModel = Instance<ReturnType<typeof CreateTableModel>>;

export const SelectionsModel = t
  .model({
    selections: t.array(t.union(t.string, t.number)),
  })
  .views((self) => ({
    get hasSelection() {
      return !!self.selections.length;
    },
    has(v: typeof self.selections[number]) {
      return self.selections.includes(v);
    },
  }))
  .actions((self) => ({
    toggleSelection(v: typeof self.selections[number]) {
      if (self.selections.includes(v)) {
        self.selections.splice(self.selections.indexOf(v), 1);
        return;
      }

      self.selections.push(v);
    },
    clearSelections() {
      self.selections.clear();
    },
  }));
