import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { HeaderLangSelectorComponent } from './header-lang-selector/header-lang-selector.component';
import { CommonOverlayComponent } from './common-overlay/common-overlay.component';
import { MainPageCardComponent } from './main-page-card/main-page-card.component';
import { ResultCardComponent } from './result-card/result-card.component';
import { ResultCardPublicationComponent } from './result-card-publication/result-card-publication.component';
import { ResultCardLayoutComponent } from './result-card-layout/result-card-layout.component';


const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  // { path: '**', component: PageNotFoundComponent }
  { path: '', component: MainPageComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    FooterComponent,
    HeaderMenuComponent,
    HeaderLangSelectorComponent,
    CommonOverlayComponent,
    MainPageCardComponent,
    ResultCardComponent,
    ResultCardPublicationComponent,
    ResultCardLayoutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
