import { Routes } from '@angular/router';
import{PruebaComponent} from '../../pages/prueba/prueba.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import{HomeAdminComponent} from '../../pages/home-admin/home-admin.component';
import {IndexComponent} from '../../pages/CrudTeams/index/index.component';
import {CreateComponent} from '../../pages/CrudTeams/create/create.component';
import {IndexSeasonComponent} from '../../pages/CrudSeason/index/indexSeason.component';
import{CreateSeasonComponent} from '../../pages/CrudSeason/create/createSeason.component';
import{IndexPlayerComponent} from '../../pages/CrudPlayer/index/indexPlayer.component';
import{CreatePlayerComponent} from '../../pages/CrudPlayer/create/createPlayer.component';
import{CedulaComponent} from '../../pages/CrudPlayer/cedula/cedula.component';
import{ReporteCedulaComponent} from '../../Reportes/reporteCedula/reporteCedula.component';
import{CreateMatchDaysComponent} from '../../pages/CrudMatchDays/createMatchDays/createMatchDays.component'


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'prueba',         component: PruebaComponent },
    { path: 'index',         component: IndexComponent },
    { path: 'home-admin',    component: HomeAdminComponent },
    { path: 'create',    component: CreateComponent },
    { path: 'indexSeason',    component: IndexSeasonComponent },
    { path: 'createSeason',    component: CreateSeasonComponent },
    { path: 'indexPlayer',    component: IndexPlayerComponent },
    { path: 'createPlayer',    component: CreatePlayerComponent },
    { path: 'cedula',    component: CedulaComponent },
    { path: 'reporteCedula',    component: ReporteCedulaComponent },
    {path: 'createMatchDays',    component: CreateMatchDaysComponent }


];

