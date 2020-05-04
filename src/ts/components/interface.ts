export interface IApp extends IAppFunction, IAppVars {}
export interface IAppVars {
  currentDate: string;
  userData: IUserData;
  data: Array<IRussiaTotal>;
  l: IListeners;
  sortType: ISortType;
  sortItem: ISortItem;
  sortedData: Array<IRussiaTotal>;
  russiaInfo: IRussiaTotal;
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
  onSlideTouch: (x: number) => Function;
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
export type TUserOption = 'favourite';
export interface IUserData {
  russiaInfo?: IRussiaTotal;
  favourite?: string;
  device?: TDevice;
  currentDate?: string;
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

export abstract class CRenderPage {
  data: IRussiaTotal[];
  options: IUserData;

  abstract headerWrapper: HTMLDivElement;
  abstract regionToggle: string;
  abstract header: string;
  abstract search: string;
  abstract tableHeader: string;
  abstract russiaInfo: string;

  constructor(data: IRussiaTotal[], options: IUserData) {
    this.data = data;
    this.options = options;
  }

  abstract customizeHeaderWrapper: () => this;
  abstract createRegionToggle: () => this;
  abstract createHeader: () => this;
  abstract createSearch: () => this;
  abstract createTableHeader: () => this;
  abstract fillContent: () => this;
  abstract renderAndInsertTable: () => this;
  abstract createRussiaInfo: () => this;
}
export type TRenderPage = (data: Array<IRussiaTotal>, options?: IUserData) => void;
export abstract class CRenderTable {
  data: Array<IRussiaTotal>;
  withDeletion: boolean;

  abstract wrapper: HTMLUListElement;
  abstract aside: HTMLLIElement;
  abstract body: HTMLLIElement;

  constructor(data: Array<IRussiaTotal>, withDeletion: boolean) {
    this.data = data;
    this.withDeletion = withDeletion;
  }

  abstract deleteTable: () => this;
  abstract createWrapper: () => this;
  abstract createPart: (className: string, wrapperName: 'body' | 'aside', htmlFn: 'getBodyElement' | 'getAsideElement') => this;
  abstract fillWrapper: () => this;
  abstract uploadWrapper: () => this;
  abstract getBodyElement: (city: IRussiaTotal) => string;
  abstract getAsideElement: (city: IRussiaTotal) => string;
}
export type TRenderTable = (data: Array<IRussiaTotal>, withDeletion?: boolean) => void;
export abstract class CRegionToggle {
  data: IRussiaTotal[];
  self: CRenderPage;

  abstract wrapper: HTMLDivElement;
  abstract favouriteCity: IRussiaTotal;
  abstract items: string;
  abstract select: HTMLSelectElement;
  abstract advantages: string;

  constructor(data: IRussiaTotal[], self: CRenderPage) {
    this.data = data;
    this.self = self;
  }

  abstract createWrapper: () => this;
  abstract getFavouriteCity: () => this;
  abstract createSelect: () => this;
  abstract createOptions: () => this;
  abstract fillSelect: () => this;
  abstract createAdvantage: () => this;
  abstract fillWrapper: () => string;
}
export type TRegionToggle = (data: IRussiaTotal[], self: CRenderPage) => string;

export interface ILoader {
  class: string;
  _getHtml(): string;
  _setHTML(html: string): void;
  showLoader(): void;
  hideLoader(): void;
}

export type ISortType = 'asc' | 'desc';
export type ISortItem = 'name' | 'cases' | 'cases_delta';