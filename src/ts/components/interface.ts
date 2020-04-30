export interface ILoader {
  class: string;
  _getHtml(): string;
  _setHTML(html: string): void;
  showLoader(): void;
  hideLoader(): void;
}

export interface IRussiaTotal {
  name: string;
  cases: number;
  cases_delta: number;
  deaths: number;
  deaths_delta: number;
  cured: number;
  cured_delta: number;
}

export type IRenderPage = (data: Array<IRussiaTotal>, options?: IUserData) => void;

export type IRenderTable = (data: Array<IRussiaTotal>, withDeletion?: boolean) => void;

export type ISortType = 'asc' | 'desc';

export type ISortItem = 'name' | 'cases' | 'cases_delta';

export interface IAppFunction {
  init: () => Promise<this>;
  createListeners: () => this;
  addListeners: () => this;
}

export interface IAppVars {
  currentDate: string;
  userData: IUserData;
  data: Array<IRussiaTotal>;
  l: IListeners;
  sortType: ISortType;
  sortItem: ISortItem;
  sortedData: Array<IRussiaTotal>;
}

export interface IApp extends IAppFunction, IAppVars {}

export interface IListeners {
  onHeaderTableClick: (evt: Event) => void;
  onInputChange: (evt: Event) => void;
  onSelectChange: (evt: Event) => void;
}

export interface IInit {
  showLoader: () => this;
  hideLoader: () => this;
  fetchData: () => Promise<this>;
  getUserData: () => this;
  handleData: () => this;
  renderData: () => this;
}

export interface IUserData {
  favourite: string;
}

export type IUserOption = 'favourite';

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