import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//session storage module
import { Ng2Webstorage } from 'ngx-webstorage';

//modal service
import { ModalModule } from 'ngx-bootstrap';

//notifications
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
//our components
import { TemplatesComponent } from './templates/templates.component';
import { TemplatesdetailComponent } from './templatesdetail/templatesdetail.component';

//Use FE routes
import { RouterModule, Routes } from '@angular/router';
//make http req to use express api
import { HttpClientModule } from '@angular/common/http';
//html editor
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ConnectionsComponent } from './connections/connections.component';
import { ConnectionsMysqlComponent } from './connections-mysql/connections-mysql.component';
import { ConnectionsStorageComponent } from './connections-storage/connections-storage.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { DatasourceTablesComponent } from './datasource-tables/datasource-tables.component';
import { DatasourceFiltersComponent } from './datasource-filters/datasource-filters.component';
import { DatasourceGroupbyComponent } from './datasource-groupby/datasource-groupby.component';
import { DatasourceFieldsComponent } from './datasource-fields/datasource-fields.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StylesComponent } from './styles/styles.component';
import { StylesHeaderComponent } from './styles-header/styles-header.component';
import { StylesFooterComponent } from './styles-footer/styles-footer.component';
import { HomeComponent } from './home/home.component';
import { DatasourceRelationComponent } from './datasource-relation/datasource-relation.component';


//define our SRE fe routes
const sreroutes: Routes = [
	{
    path: ':owner',
    component: HomeComponent
  },
  {
    path: ':owner/dashboard',
    component: AppComponent
  },
  {
		path: ':owner/templates',
		component: TemplatesComponent,
	},
  {
    path: ':owner/templates/:tid',
    component: TemplatesdetailComponent
  },
  {
    path: ':owner/templates/:tid/connections',
    component: ConnectionsComponent,
    children: [
      {path: '', redirectTo: 'mysql', pathMatch: "full"},
      {path: 'mysql', component: ConnectionsMysqlComponent},
      {path: 'storage', component: ConnectionsStorageComponent}
    ]
  },
  {
    path: ':owner/templates/:tid/datasources',
    component: DatasourceComponent,
    children: [
      {path: '', redirectTo: 'tables', pathMatch: "full"},
      {path: 'tables', component: DatasourceTablesComponent},
      {path: 'fields', component: DatasourceFieldsComponent},
      {path: 'filters', component: DatasourceFiltersComponent},
      {path: 'groupby', component: DatasourceGroupbyComponent},
      {path: 'relations', component: DatasourceRelationComponent}
    ]
  },
  {
    path: ':owner/templates/:tid/styles',
    component: StylesComponent,
    children: [
      {path: '', redirectTo: 'header', pathMatch: "full"},
      {path: 'header', component: StylesHeaderComponent},
      {path: 'footer', component: StylesFooterComponent}
    ]
  }

]


@NgModule({
  declarations: [
    AppComponent,
    TemplatesComponent,
    TemplatesdetailComponent,
    ConnectionsComponent,
    ConnectionsMysqlComponent,
    ConnectionsStorageComponent,
    DatasourceComponent,
    DatasourceTablesComponent,
    DatasourceFiltersComponent,
    DatasourceGroupbyComponent,
    DatasourceFieldsComponent,
    SidebarComponent,
    StylesComponent,
    StylesHeaderComponent,
    StylesFooterComponent,
    HomeComponent,
    DatasourceRelationComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    Ng2Webstorage,
    ToastrModule.forRoot(),
    //declare the http client module
    HttpClientModule,
    //forms modules
    FormsModule,
    ModalModule.forRoot(),
    //declare the import for our fe routes
    RouterModule.forRoot(sreroutes),
    //http editor
    AngularEditorModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
