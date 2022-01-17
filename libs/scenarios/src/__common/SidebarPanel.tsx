import { Paper, Slide, SlideProps } from '@mui/material';
import { ReactNode } from 'react';
import { css, observer } from '@dhi/arsenal.ui';

export const SidebarPanel = observer<{
  slide?: Partial<SlideProps>;
  isOpen?: boolean;
  children?: ReactNode;
  className?: string;
}>(({ slide, isOpen = true, ...props }) => (
  <Slide direction="right" in={isOpen} unmountOnExit {...slide}>
    <Paper
      css={css`
        && {
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.5s ease;
          box-shadow: 3px 0 8px 0 rgba(0, 0, 0, 0.075);
        }
      `}
      {...props}
    />
  </Slide>
));
