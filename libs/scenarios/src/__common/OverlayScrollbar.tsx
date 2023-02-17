import { css, observer, PropsOf } from '@dhi/arsenal.ui';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { ReactNode } from 'react';
import 'overlayscrollbars/overlayscrollbars.css';

export const OverlayScrollbar = observer<{
  children: ReactNode;
  className?: string;
  options?: Partial<PropsOf<typeof OverlayScrollbarsComponent>['options']>;
}>(({ children, className, options }) => {
  return (
    <OverlayScrollbarsComponent
      defer
      {...{ className }}
      options={{
        showNativeOverlaidScrollbars: true,
        scrollbars: {
          autoHide: 'never',
        },
        ...options,
      }}
      css={css`
        .os-scrollbar {
          opacity: 0.75;
        }
      `}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
});
