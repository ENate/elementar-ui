import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { DrawerComponent } from '@elementar-ui/components/drawer';
import {
  PanelBodyComponent,
  PanelComponent,
  PanelFooterComponent,
  PanelHeaderComponent
} from '@elementar-ui/components/panel';

@Component({
  selector: 'app-basic-drawer-example',
  imports: [
    MatButton,
    DrawerComponent,
    PanelComponent,
    PanelHeaderComponent,
    PanelBodyComponent,
    PanelFooterComponent
  ],
  templateUrl: './basic-drawer-example.component.html',
  styleUrl: './basic-drawer-example.component.scss'
})
export class BasicDrawerExampleComponent {

}
