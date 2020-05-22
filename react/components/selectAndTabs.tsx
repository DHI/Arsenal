import { Tab, Tabs } from '@material-ui/core';
import { sentence } from 'case';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import SwipableViews from 'react-swipeable-views';

import { isNumber } from 'lodash';
import { Instance, types as t } from 'mobx-state-tree';

type IMuiTabsProps = Omit<
  React.ComponentProps<typeof Tabs>,
  'onChange' | 'value'
>;
type IMuiTabProps = Omit<React.ComponentProps<typeof Tab>, 'value'>;

export const SelectionTabs: React.FC<{
  selection: ISelectModel;
  TabsProps?: IMuiTabsProps;
  TabProps?: (tab: ISelectModel['value']) => IMuiTabProps;
  TabsComponent?: typeof Tabs;
  TabComponent?: typeof Tab;
}> = observer(
  ({
    selection,
    TabsProps = {},
    TabProps = () => ({}),
    TabsComponent = Tabs,
    TabComponent = Tab,
  }) => {
    return (
      <TabsComponent
        value={selection.value}
        onChange={(e, tab) => selection.select(tab)}
        {...TabsProps}
      >
        {selection.options.map((key) => (
          <TabComponent
            key={key}
            label={sentence(key)}
            value={key}
            {...TabProps(key)}
          />
        ))}
      </TabsComponent>
    );
  },
);

type ISwipableViewsProps = Omit<
  React.ComponentProps<typeof SwipableViews>,
  'index' | 'onChangeIndex'
>;

/**
 * @example
 *
 * <TabViews>
 *   {tabs.tab === 'myTab' ? <MyTabContent /> : <></>}
 *   {tabs.tab === 'myTab2' ? <MyTab2Content /> : <></>}
 * </TabViews>
 */
export const SelectionViews: React.FC<{
  selection: ISelectModel;
  SwipableViewsProps?: ISwipableViewsProps;
  SwipableViewsComponent?: typeof SwipableViews;
}> = observer(
  ({
    selection,
    children,
    SwipableViewsProps = {},
    SwipableViewsComponent = SwipableViews,
  }) => {
    return (
      <SwipableViewsComponent
        index={selection.index}
        onChangeIndex={(i) => selection.select(i)}
        {...(SwipableViewsProps as any)}
      >
        {children}
      </SwipableViewsComponent>
    );
  },
);

export type ISelectModel = Instance<ReturnType<typeof CreateSelectModel>>;

export const CreateSelectModel = <O extends readonly string[]>(
  options: O,
  initialTab: O[number] = options[0],
) => {
  const Enum = t.enumeration<O[number]>(options as any);

  return t
    .model('SelectModel', {
      value: t.optional(Enum, initialTab),
    })
    .views(() => ({
      get options() {
        return options;
      },
    }))
    .views((self) => ({
      indexOf(tab: typeof self.value) {
        return self.options.indexOf(tab);
      },
    }))
    .views((self) => ({
      get index() {
        return self.indexOf(self.value);
      },
    }))
    .actions((self) => ({
      select(to: typeof self.value | number) {
        if (isNumber(to)) {
          self.value = self.options[to] as typeof self.value;
          return;
        }

        self.value = to;
      },
    }));
};
