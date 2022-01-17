import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { css, PropsOf, observer } from '../react';
import { ReactElement, useState, useEffect } from 'react';

export const DropdownMenu = observer<{
  isOpen?: boolean;
  popper?: PropsOf<typeof Popper>;
  children(props: {
    isOpen: boolean;
    openMenu(event: { currentTarget: Element }): void;
    closeMenu(): void;
  }): {
    button: ReactElement;
    menu: ReactElement;
  };
}>(({ children, isOpen: controlledIsOpen, popper }) => {
  // TODO: use a ref here to stop the error
  // Do we need a forward ref for this to be controllable for placement?
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [isOpen, setOpen] = useState(false);

  type Props = Parameters<typeof children>[0];

  const closeMenu: Props['closeMenu'] = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const openMenu: Props['openMenu'] = ({ currentTarget }) => {
    setAnchorEl(anchorEl ? null : currentTarget);
    setOpen(true);
  };

  useEffect(() => {
    if (controlledIsOpen !== undefined) setOpen(controlledIsOpen);
  }, [controlledIsOpen]);

  const { button, menu } = children({ isOpen, openMenu, closeMenu });

  return (
    <>
      {button}
      <Popper
        open={isOpen}
        anchorEl={anchorEl}
        role={undefined}
        transition
        // disablePortal
        {...popper}
        css={css`
          z-index: 2;
        `}
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
