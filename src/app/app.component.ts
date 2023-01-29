import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  
  public item: Item[] = [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 3 },
  ];


}

interface Item {
  id: number;
  quantity: number;
}
