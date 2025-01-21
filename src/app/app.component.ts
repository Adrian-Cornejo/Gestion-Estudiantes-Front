import { Component } from '@angular/core';
import { HeaderComponent } from './component/header/header.component';
import { StudentsComponent } from './component/students/students.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ErrorDisplayComponent } from "./shared/error-display/error-display.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, StudentsComponent, RouterOutlet, ErrorDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestion-estudiantes-front';
}
