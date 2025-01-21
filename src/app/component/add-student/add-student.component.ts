import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../service/student.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-student',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent {
  private router = inject(Router);
  /*Formulario reactivo */
form = new FormGroup({
  nombre : new FormControl('',{
    validators :[Validators.required],
  }),
  edad : new FormControl('',{
    validators:[Validators.required],
  }),
  sexo : new FormControl<'M'|'F'>('M',{
    validators:[ Validators.required]
  }),
  fechaNacimiento : new FormControl('',{
    validators: [Validators.required]
  }),
  telefono : new FormControl('',{
    validators: [Validators.required]
  }),
  correo : new FormControl('',{
    validators:[Validators.email, Validators.required]
  }),
  direccion : new FormControl('',{
    validators : [Validators.required]
  }),
  carrera : new FormControl('',{
    validators: [Validators.required]
  })
  
})
  errorDatosFaltantes =signal(false);
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);


  onSubmit(){
    if(this.form.invalid){
      console.log('Error');
      this.errorDatosFaltantes.set(true);
      return;
    }
    const studentData ={
      nombre : this.form.value.nombre!,
      edad : Number(this.form.value.edad),
      sexo : this.form.value.sexo!,
      correo : this.form.value.correo!,
      telefono : this.form.value.telefono!,
      direccion : this.form.value.direccion!,
      fechaNacimiento : this.form.value.fechaNacimiento!,
      carrera : this.form.value.carrera!,
    };
    const subscription = this.studentService.addStudent(studentData).subscribe({
      next :(response: any)=>{
        //console.log('Estudiante Agregado', response);
        //console.log('Estudiante Agregado', response.id);
        const id = response.id;
        this.router.navigate(['profile/',id]);


      },
      error: (err)=>{
        console.error(err)
      }
    });

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    });

  }
}
  