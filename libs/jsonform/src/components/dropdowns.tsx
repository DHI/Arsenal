import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { DropdownMenu } from './dropdownMenu';
import { Button, ListItemIcon, MenuItem, Paper } from '@material-ui/core';
import { PropsOf } from '@dhi/arsenal.ui';
import { CloseIcon, CheckIcon } from './icons';

export const ConfirmDropdown = observer<{
  trigger: {
    icon?: React.ReactNode;
    label: React.ReactNode;
    button?: Partial<PropsOf<typeof Button>>;
  };
  confirm: {
    icon?: React.ReactNode;
    label: React.ReactNode;
    onClick?(): void;

    menuItem?: Partial<PropsOf<typeof MenuItem>>;
  };
  cancel?: {
    icon?: React.ReactNode;
    label?: React.ReactNode;
    onClick?(): void;
    menuItem?: Partial<PropsOf<typeof MenuItem>>;
  };
  className?: string;
}>(({ trigger, cancel, confirm, ...p }) => {
  return (
    <DropdownMenu>
      {({ isOpen, closeMenu, openMenu }) => ({
        button: (
          <Button
            variant="outlined"
            onClick={openMenu}
            endIcon={trigger.icon}
            {...trigger.button}
            disabled={isOpen || trigger.button?.disabled}
            {...p}
          >
            {trigger.label}
          </Button>
        ),
        menu: (
          <Paper>
            <MenuItem
              {...cancel?.menuItem}
              onClick={() => {
                closeMenu();
                cancel?.onClick?.();
              }}
            >
              <ListItemIcon>{cancel?.icon ?? <CloseIcon />}</ListItemIcon>
              {cancel?.label ?? 'Cancel'}
            </MenuItem>
            <MenuItem
              {...confirm?.menuItem}
              onClick={() => {
                closeMenu();
                confirm.onClick?.();
              }}
            >
              <ListItemIcon>{confirm.icon ?? <CheckIcon />}</ListItemIcon>
              {confirm.label}
            </MenuItem>
          </Paper>
        ),
      })}
    </DropdownMenu>
  );
});
