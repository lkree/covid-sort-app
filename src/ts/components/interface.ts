export interface IApp extends IAppFunction, IAppVars {}
export interface IAppVars {
  currentDate: string;
  userData: IUserData;
  data: Array<IRussiaTotal>;
  l: IListeners;
  sortType: ISortType;
  sortItem: ISortItem;
  sortedData: Array<IRussiaTotal>;
  cancel: boolean;
}
export interface IAppFunction {
  init: () => Promise<this>;
  createListeners: () => this;
  addListeners: () => this;
}
export interface IListeners {
  onHeaderTableClick: (evt: Event) => void;
  onInputChange: (evt: Event) => void;
  onSelectChange: (evt: Event) => void;
  onSlideChange: (status: number, min: number, max: number, step: number) => Function;
}
export interface IInit {
  showLoader: () => this;
  hideLoader: () => this;
  fetchData: () => Promise<this>;
  getUserData: () => this;
  handleData: () => this;
  renderData: () => this;
  getUserDevice: () => this;
  renderError: () => void;
}
export type IUserOption = 'favourite';
export interface IUserData {
  favourite?: string;
  device?: TDevice;
}
type TDevice = 'desktop' | 'mobile' | 'tablet';
export interface IRussiaTotal {
  name: string;
  cases: number;
  cases_delta: number;
  deaths: number;
  deaths_delta: number;
  cured: number;
  cured_delta: number;
}

export type TRenderPage = (data: Array<IRussiaTotal>, options?: IUserData) => void;
export type TRenderTable = (data: Array<IRussiaTotal>, withDeletion?: boolean) => void;
export interface IRegionToggle {
  wrapper?: HTMLDivElement;
  favouriteCity?: IRussiaTotal;
  items?: string;
  select?: HTMLSelectElement;
  advantages?: string;
  createWrapper: () => this;
  getFavouriteCity: () => this;
  createSelect: () => this;
  createOptions: () => this;
  fillSelect: () => this;
  createAdvantage: () => this;
  fillWrapper: () => string;
}
export interface IRenderTable {
  wrapper: HTMLUListElement;
  aside: HTMLLIElement;
  body: HTMLLIElement;

  deleteTable: () => this;
  createWrapper: () => this;
  createPart: (className: string, wrapperName: 'body' | 'aside', htmlFn: 'getBodyElement' | 'getAsideElement') => this;
  fillWrapper: () => this;
  uploadWrapper: () => this;
  getBodyElement: (city: IRussiaTotal) => string;
  getAsideElement: (city: IRussiaTotal) => string;
}
export interface IRenderPage {
  customizeHeaderWrapper: () => this;
  createRegionToggle: () => this;
  createHeader: () => this;
  createSearch: () => this;
  createTableHeader: () => this;
  fillContent: () => this;
  renderAndInsertTable: () => this;

  headerWrapper: HTMLDivElement;
  regionToggle: string;
  header: string;
  search: string;
  tableHeader: string;
}

export interface ILoader {
  class: string;
  _getHtml(): string;
  _setHTML(html: string): void;
  showLoader(): void;
  hideLoader(): void;
}

export type ISortType = 'asc' | 'desc';
export type ISortItem = 'name' | 'cases' | 'cases_delta';