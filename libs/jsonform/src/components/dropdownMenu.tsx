import * as React from 'react';
import Popper from '@material-ui/core/Popper/Popper';
import Grow from '@material-ui/core/Grow/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import { observer } from 'mobx-react-lite';

export const DropdownMenu: React.FC<{
  isOpen?: boolean;
  popper?: PropsOf<typeof Popper>;
  children(props: {
    isOpen: boolean;
    openMenu(event: { currentTarget: Element }): void;
    closeMenu(): void;
  }): {
    button: React.ReactElement;
    menu: React.ReactElement;
  };
}> = observer(({ children, isOpen: controlledIsOpen, popper }) => {
  // TODO: use a ref here to stop the error
  // Do we need a forward ref for this to be controllable for placement?
  const [anchor, setAnchor] = React.useState<null | Element>(null);
  const [isOpen, setOpen] = React.useState(false);

  type Props = Parameters<typeof children>[0];

  const closeMenu: Props['closeMenu'] = () => {
    setAnchor(null);
    setOpen(false);
  };

  const openMenu: Props['openMenu'] = ({ currentTarget }) => {
    setAnchor(anchor ? null : currentTarget);
    setOpen(true);
  };

  React.useEffect(() => {
    if (controlledIsOpen !== undefined) setOpen(controlledIsOpen);
  }, [controlledIsOpen]);

  const { button, menu } = children({ isOpen, openMenu, closeMenu });

  return (
    <>
      {button}
      <Popper
        open={isOpen}
        anchorEl={anchor}
        role={undefined}
        transition
        // disablePortal
        {...popper}
      >
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <div>
              <ClickAwayListener onClickAway={closeMenu}>
                <div>{menu}</div>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
    </>
  );
});
