import {
  Divider,
  Paper,
  TableCell,
  TableRow,
  Checkbox,
} from '@material-ui/core';
import { useObserver, observer } from 'mobx-react-lite';
import * as React from 'react';
import {
  CreateTableModel,
  DataTable,
  DataTableFilter,
  SelectionsModel,
} from './dataTable';
import {
  CreateSelectModel,
  SelectionTabs,
  SelectionViews,
} from './selectAndTabs';

export default {
  title: 'components',
};

export const dataTable = () => {
  const MyDemoTableModel = CreateTableModel((self) => ({
    get columns() {
      return ['', 'a', 'b', 'c', 'd'] as const;
    },
    get rows() {
      return Array(100)
        .fill(1)
        .map((v, i) => ['a' + i, 'b' + i, 'c' + i, 'd' + i] as const);
    },
  }));

  const demoTable = MyDemoTableModel.create();
  const selections = SelectionsModel.create();

  const DemoTableComponent: React.FC = () => {
    return (
      <>
        <DataTable
          table={demoTable}
          Row={observer(({ row, index }) => {
            const id = row[0];

            return (
              <TableRow key={id}>
                <TableCell>
                  <Checkbox
                    checked={selections.has(id)}
                    onChange={() => selections.toggleSelection(id)}
                  />
                </TableCell>
                {row.map((cell) => (
                  <TableCell key={cell}>{cell}</TableCell>
                ))}
              </TableRow>
            );
          })}
        />
        <DataTableFilter table={demoTable} selections={selections} />
      </>
    );
  };

  return <DemoTableComponent />;
};

export const selectionTabs = () => {
  /** @note the `as const` here is necessary to preserve types */
  const MyDemoSelectModel = CreateSelectModel(
    ['a', 'b', 'c', 'x'] as const,
    'c',
  );

  const demoSelection = MyDemoSelectModel.create();

  const SelectionDemo: React.FC = () => {
    return useObserver(() => (
      <div style={{ width: '600px' }}>
        <Divider />
        <SelectionTabs selection={demoSelection} />
        <Divider />
        <SelectionViews selection={demoSelection}>
          <>{demoSelection.value === 'a' && <Paper>AAAAAAAAAAAAAAA</Paper>}</>
          <>{demoSelection.value === 'b' && <Paper>BBBBBBBBBBBBBBB</Paper>}</>
          <>{demoSelection.value === 'c' && <div>cccc</div>}</>
          <>{demoSelection.value === 'x' && <div>x</div>}</>
        </SelectionViews>
        <Divider />
      </div>
    ));
  };

  return <SelectionDemo />;
};
