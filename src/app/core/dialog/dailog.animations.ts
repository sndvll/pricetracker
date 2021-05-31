import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';

export enum DialogAnimationState {
  Close= 'close',
  Void = 'void',
  Show = 'show'
}

export interface Animation {
  transform: AnimationTriggerMetadata
}

export function fadeIn(fadeIn: number = 200, opacity: number = 1): Animation {
  return {
    transform: trigger('transform', [
      state('void', style({opacity: 0})),
      state('show', style({opacity})),
      transition('void => show', animate(`${fadeIn}ms ease-in`))
    ])
  }
}
