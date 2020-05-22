import * as assert from 'assert';

void (async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const components = require('../build/components');

  console.log(components);

  assert('DataTableFilter' in components);
  assert('AbstractTableModel' in components);
  assert('CreateTableModel' in components);
  assert('SelectionsModel' in components);
  assert('SelectionTabs' in components);
  assert('DataTable' in components);
  assert('SelectionViews' in components);
  assert('CreateSelectModel' in components);
})();
