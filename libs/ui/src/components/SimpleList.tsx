import {
  ListItem,
  List,
  ListItemText,
  Divider,
  ListItemIcon,
  ListItemProps,
  ListProps,
} from '@mui/material';
import { ReactNode, Fragment as Frag } from 'react';
import { css, styled, observer, cx } from '../react';

export enum SimpleListClasses {
  ListItem = 'simple-list-item',
}

export const SimpleList = observer<{
  items?: {
    id: string;
    icon?: ReactNode;
    text?: ReactNode;
    onClick?(): void;
    isSelected?: boolean;
    ListItemProps?: Partial<ListItemProps>;
    arrow?: 'right';
  }[];
  showDivider?: boolean;
  listProps?: Partial<ListProps>;
  className?: string;
}>(({ items = [], listProps, showDivider, className }) => (
  <$List {...listProps} {...{ className }}>
    {items.map(
      ({ id, icon, onClick, text, ListItemProps = {}, arrow, isSelected }) => (
        <Frag key={id}>
          <$ListItem
            button={!!onClick as any}
            onClick={onClick}
            {...ListItemProps}
            {...{
              className: cx(
                SimpleListClasses.ListItem,
                ListItemProps?.className,
              ),
            }}
            selected={isSelected ?? ListItemProps?.selected}
          >
            {!!icon && <$ListItemIcon>{icon}</$ListItemIcon>}
            <ListItemText primary={text} />
            {!!isSelected && arrow === 'right' && <$RightArrow />}
          </$ListItem>
          {showDivider && (
            <Divider
              css={css`
                opacity: 0.5;
              `}
            />
          )}
        </Frag>
      ),
    )}
  </$List>
));

const $ListItem = styled(ListItem)`
  position: relative;
`;

const $ListItemIcon = styled(ListItemIcon)`
  min-width: 32px;
`;

const $RightArrow = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  right: -10px;
  z-index: 3;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #ebebeb;
`;

const $List = styled(List)`
  .Mui-selected {
    .MuiListItemText-primary {
      font-weight: 600;
    }
  }
`;
