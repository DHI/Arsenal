import { colord } from 'colord';

export type RGB = [number, number, number];

export type RGBA = [number, number, number, number];

export const RED = colord('rgb(240, 20, 20)');

export const LIGHT_BLUE = colord('#88aaff');

export const BLUE = colord('#2222aa');

export const LIGHT_GREEN = colord('rgb(123, 174, 60)');

export const DARK_GREEN = colord('rgb(57, 110, 18)');

export const DARK_GREY = colord('rgb(38,38,38)');

export const LIGHT_GREY = colord('rgb(242, 242, 242)');

export const YELLOW = colord('rgb(242, 200, 50)');

export const PRIMARY = BLUE;

export const SECONDARY = LIGHT_BLUE;
