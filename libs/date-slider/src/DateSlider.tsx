import { Grid, IconButton } from '@mui/material';
import {
  ChevronLeft as ArrowBack,
  ChevronRight as ArrowForward,
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useMeasure } from 'react-use';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export type SliderPoint = SliderRangePoint | SliderDatePoint;
export interface SliderDatePoint {
  id: any;
  date: Date;
  /** Arbitrary data goes here */
  data?: any;
}
export interface SliderRangePoint {
  id: any;
  start: Date;
  end: Date;
  /** Arbitrary data goes here */
  data?: any;
}

/**
 * Rewritten from scratch to correctly display labels and points on a pixelWidth-per-day basis
 */
export const DateSlider = observer<{
  points: SliderPoint[];
  start: Date;
  end: Date;
  activeId: any;
  labelType?: 'months';
  /** Can override label formatting  */
  labelDateFormat?(date: Date): string;
  onChange(point?: SliderPoint): void;
  /**
   * Divides the label count by provided number.
   * - 'auto' will choose based on width checks
   * - Provide a callback to return your own multi based on width
   */
  labelMulti?: 1 | 2 | 4 | 8 | 'auto' | ((width: number) => 1 | 2 | 4 | 8);
  className?: string;
}>(
  ({
    activeId,
    labelMulti = 'auto',
    labelType = 'months',
    points,
    start,
    end,
    labelDateFormat,
    onChange,
    className,
  }) => {
    const [ref, { width }] = useMeasure();
    const state = React.useMemo(
      () =>
        new (class {
          constructor() {
            makeAutoObservable(this);
          }

          get start() {
            return DateTime.fromJSDate(start).startOf('month');
          }

          get end() {
            return DateTime.fromJSDate(end)
              .plus({ months: 1 })
              .startOf('month');
          }

          get duration() {
            const days = this.end.diff(this.start, 'days').toObject().days ?? 0;
            const months =
              this.end.diff(this.start, 'months').toObject().months ?? 0;

            return { days, months };
          }

          get thumbWidthByDay() {
            return width / this.duration.days;
          }

          get activePoint() {
            return points.find((point) => point.id === activeId);
          }

          get prevPoint() {
            const prev = points[points.indexOf(this.activePoint!) - 1];

            return prev ?? points[0];
          }

          get nextPoint() {
            const next = points[points.indexOf(this.activePoint!) + 1];

            return next ?? points[points.length - 1];
          }

          autoLabelMulti = (labelMax: number) => {
            if (labelMax > 30) {
              if (width < 800) return 8;
              if (width < 1400) return 4;
              if (width < 1800) return 2;
            }

            if (labelMax > 20) {
              if (width < 600) return 8;
              if (width < 1000) return 4;
              if (width < 1300) return 2;
            }

            if (labelMax > 10) {
              if (width < 500) return 8;
              if (width < 900) return 4;
              if (width < 1200) return 2;
            }

            return 1;
          };

          get labelsByMonth() {
            const monthCount = Math.round(
              this.end.diff(this.start, 'months').toObject().months ?? 1,
            );

            const multi = (() => {
              if (typeof labelMulti === 'function') return labelMulti(width);
              if (labelMulti === 'auto') return this.autoLabelMulti(monthCount);

              return labelMulti;
            })();

            const labelCount = Math.round(monthCount / multi);
            let currentYear: undefined | number;

            if (labelCount < 1) return [];

            return Array(labelCount + 1)
              .fill(0)
              .map((_, index) => {
                const initialDate = this.start.plus({ months: index * multi });
                const days =
                  initialDate.diff(this.start, 'days').toObject().days ?? 0;

                const isDateOverLimit = days >= this.duration.days;
                const isFirst = index === 0;
                const date = (() => {
                  if (isDateOverLimit)
                    return this.start.plus({ days: this.duration.days });

                  return initialDate;
                })();

                const year = date.year;
                const format = (() => {
                  if (labelDateFormat)
                    return labelDateFormat?.(date.toJSDate());
                  if (isFirst || isDateOverLimit) return 'LLL d, yyyy';
                  if (year !== currentYear) return 'LLL, yyyy';

                  return 'LLL';
                })();

                currentYear = year;

                return { date: date.toJSDate(), label: date.toFormat(format) };
              });
          }

          get labels() {
            if (labelType === 'months') {
              return this.labelsByMonth;
            }

            return [];
          }

          getPointDays = (point: SliderPoint) => {
            if ('date' in point) return 0;

            return (
              DateTime.fromJSDate(point.end)
                .diff(DateTime.fromJSDate(point.start), 'days')
                .toObject().days ?? 0
            );
          };

          pointWidthPixels = (point: SliderPoint) => {
            const days = this.getPointDays(point);

            return days * this.thumbWidthByDay;
          };

          dateLeftPixels = (date: Date) => {
            const days =
              DateTime.fromJSDate(date).diff(this.start, 'days').toObject()
                .days ?? 0;

            return days * this.thumbWidthByDay;
          };
        })(),
      [start, end, points, labelType, width],
    );

    return (
      <Grid
        direction={'row'}
        container
        flexGrow={1}
        alignItems={'center'}
        flexWrap={'nowrap'}
        gap={'1.5em'}
        {...{ className }}
        css={css`
          padding: 0.75em 1.5em;
          width: 100%;
        `}
      >
        <$PrevNextIconButton
          disableTouchRipple
          disableFocusRipple
          size="small"
          onClick={() => onChange(state.prevPoint)}
          disabled={state.activePoint === state.prevPoint}
          css={css`
            margin-right: 1.25em;
          `}
        >
          <ArrowBack color="secondary" />
        </$PrevNextIconButton>
        <Grid container ref={ref as any} flexGrow={1}>
          <div
            css={css`
              position: relative;
              border-top: 1px solid #164d53;
              height: 5px;
              width: 100%;
            `}
          >
            {points.map((point) => {
              const isActive = point.id === activeId;
              const isSinglePoint = 'date' in point;
              const startDate = isSinglePoint ? point.date : point.start;

              return (
                <div
                  css={css`
                    position: absolute;
                    left: ${state.dateLeftPixels(startDate)}px;
                    width: ${state.pointWidthPixels(point)}px;
                    height: 10px;
                    top: -5px;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
                    background-color: #7fa1a3;
                    border-right: 2px solid #42585a;
                    border-left: 2px solid #42585a;
                    z-index: 2;
                    outline: 2px solid #164d5300;
                    transition: all 0.5s ease;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

                    ${isSinglePoint
                      ? css`
                          width: 12px;
                          height: 12px;
                          margin-top: -2px;
                          margin-left: -6px;
                          border-radius: 50%;
                          background-color: #fff;
                          outline: none;
                          border: 3px solid rgb(22, 77, 83);
                        `
                      : ''}

                    &:hover {
                      cursor: pointer;
                      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);

                      background-color: #164d53;
                      outline: 2px solid #164d53;
                    }

                    ${isActive
                      ? css`
                          background-color: #164d53;
                        `
                      : ''}
                  `}
                  key={point.id}
                  onClick={() => {
                    onChange(point);
                  }}
                >
                  <div
                    css={css`
                      position: relative;
                      width: 100%;
                    `}
                  >
                    {isActive ? (
                      <div
                        css={css`
                          position: absolute;
                          top: -34px;
                          left: calc(50% - 160px / 2);

                          ${isSinglePoint
                            ? css`
                                margin-left: -2.5px;
                              `
                            : ''}
                          width: 160px;
                          white-space: nowrap;
                          background: #164d53;
                          padding: 0.3em 0.5em 0.2em;
                          color: white;
                          font-size: 80%;
                          text-align: center;
                          border-radius: 4px;

                          &:after {
                            content: '';
                            position: absolute;
                            left: calc(50% - 3px);
                            bottom: -6px;
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 6px solid #164d53;
                            clear: both;
                          }
                        `}
                      >
                        {(() => {
                          if ('date' in point)
                            return DateTime.fromJSDate(point.date).toFormat(
                              'LLL d, yyyy',
                            );

                          return (
                            <>{`${DateTime.fromJSDate(point.start).toFormat(
                              'LLL d, yyyy',
                            )} - ${DateTime.fromJSDate(point.end).toFormat(
                              'LLL d, yyyy',
                            )}`}</>
                          );
                        })()}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            css={css`
              position: relative;
              height: 12px;
              width: 100%;
              z-index: 1;
            `}
          >
            {state.labels.map((label) => (
              <div
                css={css`
                  left: ${state.dateLeftPixels(label.date)}px;
                  position: absolute;
                  top: -4px;
                  div {
                    border-left: 1px solid rgba(22, 77, 83, 0.502);
                    height: 12px;
                  }
                  span {
                    position: relative;
                    left: -50%;
                    font-size: 80%;
                    white-space: nowrap;
                    text-align: center;
                    display: block;
                  }
                `}
                key={label.date.valueOf()}
              >
                <div></div>
                <span>
                  {label.label.split(',').map((v) => (
                    <>
                      {v}
                      <br />
                    </>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </Grid>
        <$PrevNextIconButton
          disableTouchRipple
          disableFocusRipple
          size="small"
          onClick={() => onChange(state.nextPoint)}
          disabled={state.activePoint === state.nextPoint}
          css={css`
            margin-left: 1.25em;
          `}
        >
          <ArrowForward />
        </$PrevNextIconButton>
      </Grid>
    );
  },
);

const $PrevNextIconButton = styled(IconButton)`
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0);
  padding: 0;
  margin-top: -0.5ex;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &[disabled] {
    svg {
      border-color: #aaa;
      color: #aaa;
      transition: all 0.5s ease;
    }
  }
  svg {
    border: 2px solid #164d53aa;
    color: #164d53;
    border-radius: 50%;
    font-size: 1.75em;
    padding: 0.1em;
  }
`;
