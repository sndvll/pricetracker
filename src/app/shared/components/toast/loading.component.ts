import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'loading',
  template: `
    <div class="bg-red-400 w-full" style="height: 5px;">
      <div class="bg-red-800" style="height: 5px;" [@loading]="progress === 0 ? 'start':'end'">
      </div>
    </div>
  `,
  animations: [
    trigger('loading', [
      state('start', style({width: '0%'})),
      state('end', style({width: '100%'})),
      transition('start => end', [animate('1s')])
    ])
  ]
})
export class LoadingComponent implements OnInit {

  duration: number = 2 * 100;
  step = 1000;
  add_step = 100;
  progress = 0;

  //@Input() progress!: number;

  ngOnInit() {
    const interval = setInterval(() => {
      if (this.progress < this.duration) {
        this.progress += this.add_step ;
        console.log('here', this.progress)
      } else {
        clearInterval(interval);
        console.log('finished');
      }
    }, this.step);

  }



}
