import { observer } from 'mobx-react-lite';
import { DropdownMenu } from './dropdownMenu';
import { Button, ListItemIcon, MenuItem, Paper } from '@material-ui/core';
import { PropsOf } from '@emotion/react';
import { CloseIcon, CheckIcon } from './icons';
import { ReactNode } from 'react';

export const ConfirmDropdown = observer<{
  trigger: {
    icon?: ReactNode;
    label: ReactNode;
    button?: Partial<PropsOf<typeof Button>>;
  };
  confirm: {
    icon?: ReactNode;
    label: ReactNode;
    onClick?(): void;

    menuItem?: Partial<PropsOf<typeof MenuItem>>;
  };
  cancel?: {
    icon?: ReactNode;
    label?: ReactNode;
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
