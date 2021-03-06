export abstract class ACApp {
  abstract currentDate: string;
  abstract userData: IUserData;
  abstract data: Array<IRussiaTotal>;
  abstract l: IListeners;
  abstract sortType: ISortType;
  abstract sortItem: ISortItem;
  abstract sortedData: Array<IRussiaTotal>;
  abstract russiaInfo: IRussiaTotal;
  abstract cancel: boolean;

  abstract init(reInit: boolean): Promise<this>;
  abstract createListeners(): this;
  abstract addListeners(): this;
}
export type TApp = (reInit?: boolean) => Promise<void>;
export abstract class ACInit {
  abstract data: TFetchData;

  constructor(protected reInit: boolean, protected _app: ACApp) {}

  abstract reInitiate(): this;
  abstract showLoader(): this;
  abstract hideLoader(): this;
  abstract fetchData(): Promise<this>;
  abstract getUserData(): this;
  abstract handleData(): this;
  abstract renderData(): this;
  abstract getUserDevice(): this;
  abstract renderError(): void;
}

export interface IListeners {
  onHeaderTableClick: (evt: Event) => void;
  onInputChange: (evt: Event) => void;
  onSelectChange: (evt: Event) => void;
  onSlideChange: (evt: Event, customDirection?: 'right' | 'left') => void;
  onSlideTouch: (evt: TouchEvent) => void;
  onUpdateButtonClick: () => void;
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

export abstract class ACRenderPage {
  protected _headerWrapper: HTMLDivElement;
  protected _regionToggle: string;
  protected _header: string;
  protected _search: string;
  protected _tableHeader: string;
  protected _russiaInfo: string;

  constructor(public data: IRussiaTotal[], public options: IUserData) {}

  abstract customizeHeaderWrapper(): this;
  abstract createRegionToggle(): this;
  abstract createHeader(): this;
  abstract createSearch(): this;
  abstract createTableHeader(): this;
  abstract fillContent(): this;
  abstract renderAndInsertTable(): this;
  abstract createRussiaInfo(): this;
}
export type TRenderPage = (data: Array<IRussiaTotal>, options?: IUserData) => void;
export abstract class ACRenderTable {
  protected _wrapper: HTMLUListElement;
  protected _aside: HTMLLIElement;
  protected _body: HTMLLIElement;

  constructor(protected _data: Array<IRussiaTotal>, protected _withDeletion: boolean) {}

  abstract deleteTable(): this;
  abstract createWrapper(): this;
  abstract createPart(className: string, wrapperName: '_body' | '_aside', htmlFn: 'getBodyElement' | 'getAsideElement'): this;
  abstract fillWrapper(): this;
  abstract uploadWrapper(): this;
  abstract getBodyElement(city: IRussiaTotal): string;
  abstract getAsideElement(city: IRussiaTotal): string;
}
export type TRenderTable = (data: Array<IRussiaTotal>, withDeletion?: boolean) => void;
export abstract class ACRegionToggle {
  protected _wrapper: HTMLDivElement;
  protected _favouriteCity: IRussiaTotal;
  protected _items: string;
  protected _select: HTMLSelectElement;
  protected _advantages: string;

  constructor(public data: IRussiaTotal[], protected _renderPage: ACRenderPage) {}

  abstract createWrapper(): this;
  abstract getFavouriteCity(): this;
  abstract createSelect(): this;
  abstract createOptions(): this;
  abstract fillSelect(): this;
  abstract createAdvantage(): this;
  abstract fillWrapper(): string;
}
export type TRegionToggle = (data: IRussiaTotal[], self: ACRenderPage) => string;

export interface ILoader {
  class: string;
  _getHtml(): string;
  _setHTML(html: string): void;
  showLoader(): void;
  hideLoader(): void;
}

export type ISortType = 'asc' | 'desc';
export type ISortItem = 'name' | 'cases' | 'cases_delta';

export interface IEventListeners {
  onHeaderTableClick: (
    self: {data: Array<IRussiaTotal>, sortedData:  [] | Array<IRussiaTotal>, sortType: ISortType},
    sort: Function,
    refreshTable: Function,
    evt: Event
  ) => void;
  onInputChange: (
    self: {sortedData: [] | Array<IRussiaTotal>, data: Array<IRussiaTotal>},
    renderTable: Function,
    search: Function,
    evt: Event
  ) => void;
  onSelectChange: (
    self: {data: Array<IRussiaTotal>},
    setToLocalStorage: Function,
    refreshToggle: Function,
    evt: Event
  ) => void;
  onSlideChange: (
    evt: Event,
    tableSlide: Function,
    customDirection?: 'right' | 'left',
  ) => void;
  onSlideTouch: (onSlideChange: Function, evt: TouchEvent) => void;
  onUpdateButtonClick: (app: Function) => void;
}

export type TFetchData = {
  russia_stat_struct: {
    data: {
      1: {
        info: IRussiaTotal
      },
    },
    dates: string[],
  }
};