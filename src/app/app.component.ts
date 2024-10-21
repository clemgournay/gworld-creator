import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from '@services/app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gworld-creator';


  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.appService.initComplete();
  }

}
