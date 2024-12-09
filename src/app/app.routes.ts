import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { superadminComponent } from './superadmin/superadmin.component';
import { CreateadminComponent } from './createadmin/createadmin.component';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { RaiseticketComponent } from './raiseticket/raiseticket.component';


export const routes: Routes = [
    {path:'',component:HomeComponent,data: { showNavbar: false }},
    {path:'register',component:RegistrationComponent,data: { showNavbar: false }},
    {path:'login',component:LoginComponent,data: { showNavbar: false }},
    {path:'superadmin_',component:superadminComponent,data: { showNavbar: false }},
    {path:'addadmin',component:CreateadminComponent,data: { showNavbar: false }},
    {path:'suggestion',component:SuggestionComponent,data: { showNavbar: true }},
    {path:'userhome',component:UserhomeComponent,data: { showNavbar: true }},
    {path:'ticket',component:RaiseticketComponent,data: { showNavbar: true }},
    { path: '', redirectTo: '/home', pathMatch: 'full' }  
];
