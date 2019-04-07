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
import { MainPageSpinnerComponent } from './main-page-spinner/main-page-spinner.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchPageHeaderComponent } from './search-page-header/search-page-header.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PublicationsPageComponent } from './publications-page/publications-page.component';
import { PublicationsPageHeaderComponent } from './publications-page-header/publications-page-header.component';
import { FixedBackgroundComponent } from './fixed-background/fixed-background.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ItemPagePublicationComponent } from './item-page-publication/item-page-publication.component';
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemPageHeaderComponent } from './item-page-header/item-page-header.component';
import { ItemPageSearchResultsComponent } from './item-page-search-results/item-page-search-results.component';
import { ResultCardOrganisationComponent } from './result-card-organisation/result-card-organisation.component';
import { OrganisationsPageComponent } from './organisations-page/organisations-page.component';
import { OrganisationsPageHeaderComponent } from './organisations-page-header/organisations-page-header.component';
import { StatsPageComponent } from './stats-page/stats-page.component';
import { StatsPageHeaderComponent } from './stats-page-header/stats-page-header.component';
import { ResultCardDatasetComponent } from './result-card-dataset/result-card-dataset.component';
import { DatasetChartComponent } from './dataset-chart/dataset-chart.component';
import { GenderIndexPageComponent } from './gender-index-page/gender-index-page.component';
import { GenderIndexPageHeaderComponent } from './gender-index-page-header/gender-index-page-header.component';


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
  { path: 'item',
    children: [
      {
        path: '**', component: ItemPageComponent
      }
    ]
  },
  { path: 'publications', component: PublicationsPageComponent },
  { path: 'organisations', component: OrganisationsPageComponent },
  { path: 'stats', component: StatsPageComponent },
  { path: 'gender-index', component: GenderIndexPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '', component: MainPageComponent },
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
    ResultCardLayoutComponent,
    MainPageSpinnerComponent,
    SearchPageComponent,
    SearchPageHeaderComponent,
    SearchFiltersComponent,
    SearchResultsComponent,
    PublicationsPageComponent,
    PublicationsPageHeaderComponent,
    FixedBackgroundComponent,
    SearchBarComponent,
    ItemPagePublicationComponent,
    ItemPageComponent,
    ItemPageHeaderComponent,
    ItemPageSearchResultsComponent,
    ResultCardOrganisationComponent,
    OrganisationsPageComponent,
    OrganisationsPageHeaderComponent,
    StatsPageComponent,
    StatsPageHeaderComponent,
    ResultCardDatasetComponent,
    DatasetChartComponent,
    GenderIndexPageComponent,
    GenderIndexPageHeaderComponent
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
