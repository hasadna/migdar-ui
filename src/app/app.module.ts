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
import { InfoPageComponent } from './info-page/info-page.component';
import { InfoPageGenderIndexComponent } from './info-page-gender-index/info-page-gender-index.component';
import { InfoPageInequalityComponent } from './info-page-inequality/info-page-inequality.component';
import { InfoPageGapsComponent } from './info-page-gaps/info-page-gaps.component';
import { HorizontalSelectorComponent } from './horizontal-selector/horizontal-selector.component';
import { SearchFiltersSortingComponent } from './search-filters-sorting/search-filters-sorting.component';
import { SearchFiltersItemKindComponent } from './search-filters-item-kind/search-filters-item-kind.component';
import { ItemPageOrganisationComponent } from './item-page-organisation/item-page-organisation.component';
import { ItemPageStatsComponent } from './item-page-stats/item-page-stats.component';
import { GenderIndexPageFooterComponent } from './gender-index-page-footer/gender-index-page-footer.component';
import { ItemPageGenderIndexComponent } from './item-page-gender-index/item-page-gender-index.component';
import { SearchFiltersPropertyComponent } from './search-filters-property/search-filters-property.component';
import { SearchFiltersPropertyFieldNameComponent } from './search-filters-property-field-name/search-filters-property-field-name.component';
import { HeaderSearchIconComponent } from './header-search-icon/header-search-icon.component';
import { GenericPageComponent } from './generic-page/generic-page.component';
import { GenericPageAboutComponent } from './generic-page-about/generic-page-about.component';
import { GenericPageEulaComponent } from './generic-page-eula/generic-page-eula.component';
import { GenericPagePrivacyComponent } from './generic-page-privacy/generic-page-privacy.component';
import { GenderIndexPageBrowserComponent } from './gender-index-page-browser/gender-index-page-browser.component';
import { GenderIndexPageBrowserHeaderElementComponent
 } from './gender-index-page-browser-header-element/gender-index-page-browser-header-element.component';
import { GenderIndexPageBrowserSectionComponent } from './gender-index-page-browser-section/gender-index-page-browser-section.component';
import { GenericPageContactComponent } from './generic-page-contact/generic-page-contact.component';
import { CardPageComponent } from './card-page/card-page.component';
import { ResultCardImgComponent } from './result-card-img/result-card-img.component';
import { CardSharePageComponent } from './card-share-page/card-share-page.component';
import { ShareButtonComponent } from './share-button/share-button.component';
import { LtrDirective } from './ltr.directive';
import { TimeRangeSelectorComponent } from './time-range-selector/time-range-selector.component';
import { EmbedPageComponent } from './embed-page/embed-page.component';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { GenericPageOpportunitiesComponent } from './generic-page-opportunities/generic-page-opportunities.component';


const appRoutes: Routes = [
  { path: 'item',
    children: [
      {
        path: '**', component: ItemPageComponent
      }
    ]
  },
  { path: 'embed',
    data: {embed: true},
    children: [
      {
        path: '**', component: EmbedPageComponent
      }
    ]
  },
  { path: 'card',
    children: [
      {
        path: '**', component: CardPageComponent
      }
    ]
  },
  { path: 'card-share',
    children: [
      {
        path: '**', component: CardSharePageComponent
      }
    ]
  },
  { path: 'publications', component: PublicationsPageComponent },
  { path: 'organisations', component: OrganisationsPageComponent },
  { path: 'stats', component: StatsPageComponent },
  { path: 'gender-index', component: GenderIndexPageComponent },
  { path: 'opportunities', component: GenericPageOpportunitiesComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'gaps', component: InfoPageGapsComponent },
  { path: 'inequality', component: InfoPageInequalityComponent },
  { path: 'methodology', component: InfoPageGenderIndexComponent },
  { path: 'about', component: GenericPageAboutComponent },
  { path: 'contact-us', component: GenericPageContactComponent },
  { path: 'eula', component: GenericPageEulaComponent },
  { path: 'privacy', component: GenericPagePrivacyComponent },
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
    GenderIndexPageHeaderComponent,
    InfoPageComponent,
    InfoPageGenderIndexComponent,
    InfoPageInequalityComponent,
    InfoPageGapsComponent,
    HorizontalSelectorComponent,
    SearchFiltersSortingComponent,
    SearchFiltersItemKindComponent,
    ItemPageOrganisationComponent,
    ItemPageStatsComponent,
    GenderIndexPageFooterComponent,
    ItemPageGenderIndexComponent,
    SearchFiltersPropertyComponent,
    SearchFiltersPropertyFieldNameComponent,
    HeaderSearchIconComponent,
    GenericPageComponent,
    GenericPageAboutComponent,
    GenericPageEulaComponent,
    GenericPagePrivacyComponent,
    GenderIndexPageBrowserComponent,
    GenderIndexPageBrowserHeaderElementComponent,
    GenderIndexPageBrowserSectionComponent,
    GenericPageContactComponent,
    CardPageComponent,
    ResultCardImgComponent,
    CardSharePageComponent,
    ShareButtonComponent,
    LtrDirective,
    TimeRangeSelectorComponent,
    EmbedPageComponent,
    SearchDropdownComponent,
    GenericPageOpportunitiesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {
        // enableTracing: true, // <-- debugging purposes only
        // scrollPositionRestoration: 'enabled',
        // anchorScrolling: 'disabled',
      }
    ),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
