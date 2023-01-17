import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public homeUrl =
  'https://www.shutterstock.com/image-photo/wooden-house-isolated-on-white-600w-482149384.jpg';

public carUrl =
  'https://www.shutterstock.com/image-illustration/modern-electric-cars-red-blue-600w-750511849.jpg';

  public brokenUrl =
  '';

  title = 'custom-pipes';
}
