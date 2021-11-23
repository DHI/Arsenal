import { css } from '@emotion/react';
import styled from '@emotion/styled';

type $RowProps = { grow?: boolean };

export const $Row = styled.div<$RowProps>`
  display: flex;
  align-items: center;
  flex-direction: row;

  ${({ grow = true }) =>
    grow
      ? css`
          flex-grow: 1;
        `
      : ''}
`;

type $ColProps = { grow?: boolean };

export const $Col = styled.div<$ColProps>`
  display: flex;
  flex-direction: column;

  ${({ grow = false }) =>
    grow
      ? css`
          flex-grow: 1;
        `
      : ''}
`;
