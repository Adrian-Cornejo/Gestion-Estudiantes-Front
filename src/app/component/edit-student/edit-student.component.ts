import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../service/student.service';
import { Student } from '../student.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-student',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css'
})
export class EditStudentComponent implements OnInit {
  errorDatosFaltantes = signal(false);
  student = signal<Student | undefined>(undefined);
  isFetching = signal(true);
  error = signal('');
  @Input() id! : string;
  private studentService = inject(StudentService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private activateRoute = inject(ActivatedRoute);


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
    
  });
  

  ngOnInit(): void {
    this.isFetching.set(true);
    this.activateRoute.paramMap.subscribe((params) => {
      const studentId = params.get('id');
      if (studentId) {
        this.fetchStudent(studentId);
      } else {
        this.error.set('ID del estudiante no proporcionado.');
      }
    });
    
  }


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
    }
    const subscription = this.studentService.editStudent(studentData,this.id)
    .subscribe({
      next: (response)=>{
        //console.log('Estudiante actualizado', response);
        this.router.navigate(['profile/',this.id]);
        // window.location.reload();

      },
      error: (err)=>{
        console.log(err);
      }
    });
    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    });


  }

  private fetchStudent(studentId : string): void{
    const subscription = this.studentService.loadStudentById(studentId)
    .subscribe({
      next : (students) =>{
        //console.log('Estudiantes cargados',students);
        const sexo = students.sexo === 'M' || students.sexo === 'F' ? students.sexo : null;
        this.form.patchValue({
          nombre: students.nombre,
          edad : String(students.edad),
          sexo: sexo,
          fechaNacimiento: students.fechaNacimiento,
          telefono : students.telefono,
          correo :students.correo,
          direccion : students.direccion,
          carrera: students.carrera,


        })
        this.student.set(students);
        this.isFetching.set(false);
      },
      error : (error :Error) =>{
        console.log(error);
        this.error.set(error.message);
      },
      complete :()=>{
        //this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }

}