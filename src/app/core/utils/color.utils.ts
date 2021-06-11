export type ColorHue = '' | '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type Opacity = '0' | '5' | '10' | '20' | '25' | '30' | '40' | '50' | '60' | '70' | '72' | '80' | '90' | '95' | '100';

export enum Color {
  red = 'red',
  blue = 'blue',
  yellow = 'yellow',
  indigo = 'indigo',
  green = 'green',
  gray = 'gray',
  purple = 'purple',
  pink = 'pink',
  black = 'black',
  white = 'white',
  transparent = 'transparent'
}

export const Colors: Color[] = Object.values(Color);

export class ColorUtils {

  public static color(color: Color, hue: ColorHue, hover: boolean = false): string {
    if (hover) {
      return `hover:bg-${color}${hue ? '-' + ColorUtils.hoverHue(hue) : ''}`;
    }
    return `bg-${color}${hue ? '-' + hue : ''}`
  }

  public static hoverHue(hue: ColorHue): number {
    let newHue: number = !isNaN(Number(hue)) ? Number(hue) : 0;
    return newHue === 50 ? newHue + 150 : newHue + 100;
  }

  public static black(hover: boolean = false): string {
    let classes = 'bg-black';
    if (hover) {
      classes = `${classes} hover:bg-gray-700`;
    }
    return classes;
  }

  public static white(hover: boolean= false): string {
    let classes = 'bg-white';
    if (hover) {
      classes = `${classes} hover:bg-gray-100`;
    }
    return classes;
  }
}
