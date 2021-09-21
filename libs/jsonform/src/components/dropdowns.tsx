import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { DropdownMenu } from './dropdownMenu';
import * as ui from '__ui';

export const ConfirmDropdown = observer<{
  trigger: {
    icon?: React.ReactNode;
    label: React.ReactNode;
    button?: Partial<PropsOf<typeof ui.Button>>;
  };
  confirm: {
    icon?: React.ReactNode;
    label: React.ReactNode;
    onClick?(): void;

    menuItem?: Partial<PropsOf<typeof ui.MenuItem>>;
  };
  cancel?: {
    icon?: React.ReactNode;
    label?: React.ReactNode;
    onClick?(): void;
    menuItem?: Partial<PropsOf<typeof ui.MenuItem>>;
  };
  className?: string;
}>(({ trigger, cancel, confirm, ...p }) => {
  return (
    <DropdownMenu>
      {({ isOpen, closeMenu, openMenu }) => ({
        button: (
          <ui.Button
            variant="outlined"
            onClick={openMenu}
            endIcon={trigger.icon}
            {...trigger.button}
            disabled={isOpen || trigger.button?.disabled}
            {...p}
          >
            {trigger.label}
          </ui.Button>
        ),
        menu: (
          <ui.Paper>
            <ui.MenuItem
              {...cancel?.menuItem}
              onClick={() => {
                closeMenu();
                cancel?.onClick?.();
              }}
            >
              <ui.ListItemIcon>
                {cancel?.icon ?? <ui.CloseIcon />}
              </ui.ListItemIcon>
              {cancel?.label ?? 'Cancel'}
            </ui.MenuItem>
            <ui.MenuItem
              {...confirm?.menuItem}
              onClick={() => {
                closeMenu();
                confirm.onClick?.();
              }}
            >
              <ui.ListItemIcon>
                {confirm.icon ?? <ui.CheckIcon />}
              </ui.ListItemIcon>
              {confirm.label}
            </ui.MenuItem>
          </ui.Paper>
        ),
      })}
    </DropdownMenu>
  );
});
