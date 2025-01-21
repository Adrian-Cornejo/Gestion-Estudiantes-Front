import { Routes } from '@angular/router';
import { StudentComponent } from './component/students/student/student.component';
import { NotFoundComponent } from './not-found/not-found/not-found.component';
import { SelectStudentComponent } from './not-found/select-student/select-student.component';
import { AddStudentComponent } from './component/add-student/add-student.component';
import { EditStudentComponent } from './component/edit-student/edit-student.component';

export const routes: Routes = [
    {
        path:'',
        component: SelectStudentComponent
    },
    {
        path :'profile/:id',
        component: StudentComponent,
        title :'Profile',
    },
    {
        path:'editProfile/:id',
        component: EditStudentComponent,
    },
    {
        path: 'addStudent',
        component: AddStudentComponent
        
    },
    {
        path: '**',
        component: NotFoundComponent

    },

];
