import {
  Button,
  ButtonProps,
  ListItemIcon,
  MenuItem,
  MenuItemProps,
  Paper,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { DropdownMenu } from './DropdownMenu';
import { CheckIcon, CloseIcon } from './icons';

export const ConfirmDropdown = observer<{
  trigger: {
    icon?: ReactNode;
    label: ReactNode;
    button?: Partial<ButtonProps>;
  };
  confirm: {
    icon?: ReactNode;
    label: ReactNode;
    onClick?(): void;

    menuItem?: Partial<MenuItemProps>;
  };
  cancel?: {
    icon?: ReactNode;
    label?: ReactNode;
    onClick?(): void;
    menuItem?: Partial<MenuItemProps>;
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
