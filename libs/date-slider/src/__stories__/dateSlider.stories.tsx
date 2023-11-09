import '@fontsource/roboto';
import { css, PropsOf } from '@emotion/react';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { DateSlider } from '..';
import { CssBaseline, Grid } from '@mui/material';

export default {
  title: 'DateSlider',
};

export const Scenario1 = () => {
  const [activeId, setActiveId] = useState(undefined);
  // One year diff
  const start = DateTime.fromFormat('2020-01-01', 'yyyy-MM-dd');
  const end = DateTime.fromFormat('2021-01-01', 'yyyy-MM-dd');
  const sliderProps: PropsOf<typeof DateSlider> = {
    onChange: (p) => {
      setActiveId(p?.id);
    },
    activeId,
    start: start.toJSDate(),
    end: end.toJSDate(),
    points: [
      {
        id: 0,
        start: start.plus({ months: 2 }).toJSDate(), // March
        end: start.plus({ months: 4 }).toJSDate(),
      },
      {
        id: 1,
        start: start.plus({ months: 4 }).toJSDate(), // June
        end: start.plus({ months: 6 }).toJSDate(),
      },
      {
        id: 2,
        start: start.plus({ months: 7 }).toJSDate(), // August
        end: start.plus({ months: 10 }).toJSDate(),
      },
    ],
  };

  /**
   * show date range for 3 ranges
   * monthly periods
   * shows proportional label & points
   */
  return (
    <>
      <CssBaseline />
      <Grid
        container
        gap={'2em'}
        css={css`
          padding: 1em;
        `}
      >
        <DateSlider
          {...sliderProps}
          css={css`
            max-width: 500px;
          `}
        />
        <DateSlider
          {...sliderProps}
          css={css`
            max-width: 900px;
          `}
        />
        <DateSlider
          {...sliderProps}
          css={css`
            max-width: 1200px;
          `}
        />
        <DateSlider
          {...sliderProps}
          css={css`
            max-width: 1600px;
          `}
        />
        <DateSlider {...sliderProps} />
      </Grid>
    </>
  );
};
