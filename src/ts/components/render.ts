import {
  TRenderTable,
  IRussiaTotal,
  TRenderPage,
  IUserData,
  ACRenderPage,
  TRegionToggle,
  ACRegionToggle,
  ACRenderTable, ACRender, TRenderItem, TPositions
} from "./interface";
import {
  sort,
  TABLE_CLASS,
  russiaBlock,
  headerHTML,
  searchHTML,
  tableHeaderHTML,
  toggleAdvantages,
  asideElement, bodyElement
} from "./utils";

class Render extends ACRender {
  protected _places: TPositions = {};
  protected _container: HTMLElement;

  constructor(container: HTMLElement, values?: { name: string; value: string }[]) {
    super();
    this._container = container;
    values && values.forEach((v, i) => this._places[i] = v);
  }

  getTakenPlaces(): number[] {
    return Object
      .keys(this._places)
      .map(Number);
  }
  addItem(item: TRenderItem, position?: number): boolean {
    const sortKeys = Object.keys(this._places).sort();

    if (position && sortKeys.includes(position.toString())) {
      return false;
    }

    this._places[position || sortKeys.length] = item;

    return true;
  }
  addItems(items: TRenderItem[]): void {
    items.forEach(e => this.addItem(e));
  }

  getHtml(): string {
    return this._container.outerHTML;
  }
  render(): void {
    Object.keys(this._places)
      .sort((a: string, b: string) => +b - +a)
      .forEach(i => {
        this._container.insertAdjacentHTML('afterbegin', this._places[i].value);
      })
  }
}

class RenderPage extends ACRenderPage {
  protected _headerWrapper: ACRender;
  protected _body: ACRender;

  constructor(public data: IRussiaTotal[], public options: IUserData) {
    super(data, options);

    this._createHeaderWrapper();
    this._body = new Render(document.body);
  }

  private _createHeaderWrapper(): void {
    const _headerWrapper = document.createElement('div');
    _headerWrapper.classList.add('infected__header', 'infected-header');
    this._headerWrapper = new Render(_headerWrapper);
  }

  createRegionToggle() {
    const regionToggle: TRegionToggle = (data: IRussiaTotal[], self: ACRenderPage): string => {
      return new RegionToggle(data, self)
        .createWrapper()
        .getFavouriteCity()
        .createSelect()
        .createOptions()
        .fillSelect()
        .createAdvantage()
        .fillWrapper()
    };

    this._headerWrapper.addItem({
      name: 'regionToggle',
      value: regionToggle(sort(this.data, 'name', 'asc'), this),
    });

    return this;
  }
  createHeader() {
    this._headerWrapper.addItem({
        name: 'header',
        value: headerHTML
    });

    return this;
  }
  createSearch() {
    this._headerWrapper.addItem({
      name: 'search',
      value: searchHTML
    });

    return this;
  }
  createRussiaInfo() {
    this._headerWrapper.addItem({
      name: 'russiaInfo',
      value: russiaBlock(this.options.russiaInfo, this.options.currentDate),
    });

    return this;
  }
  renderContent() {
    this._headerWrapper.render();

    this._body.addItems([
      { name: 'headerWrapper', value: this._headerWrapper.getHtml() },
      { name: 'tableHeader', value: tableHeaderHTML },
      { name: 'table', value: renderTable(this.data) }
    ]);
    this._body.render();

    return this;
  }
}
class RegionToggle extends ACRegionToggle {
  protected _wrapper = document.createElement('div');
  protected _favouriteCity: IRussiaTotal;
  protected _items = '';
  protected _select = document.createElement('select');
  protected _advantages = '';

  createWrapper() {
    this._wrapper = document.createElement('div');
    this._wrapper.classList.add('infected-header__toggle', 'infected-toggle');
    this._wrapper.textContent = 'Мой регион: ';

    return this;
  }
  getFavouriteCity() {
    this._favouriteCity = this._renderPage.options?.favourite
      ? this.data.find(city => city.name === this._renderPage.options.favourite)
      : {cases_delta: 0, deaths_delta: 0, cured_delta: 0, name: '', deaths: 0, cured: 0, cases: 0};

    return this;
  }
  createSelect() {
    this._select = document.createElement('select');
    this._select.classList.add('infected-toggle__select');

    return this;
  }
  createOptions() {
    this.data.forEach(city => {
      this._items += `<option value="${city.name}" ${city.name === this._renderPage.options?.favourite && 'selected'}>${city.name}</option>`
    });

    return this;
  }
  fillSelect() {
    this._select.insertAdjacentHTML('afterbegin', this._items);

    return this;
  }
  createAdvantage() {
    this._advantages = toggleAdvantages(this._favouriteCity);

    return this;
  }
  fillWrapper() {
    const tempWrapper = document.createElement('div');

    tempWrapper.classList.add('infected-toggle__wrapper');
    tempWrapper.append(this._select);
    tempWrapper.insertAdjacentHTML('beforeend', this._advantages);

    this._wrapper.append(tempWrapper);

    return this._wrapper.outerHTML;
  }
}
class RenderTable extends ACRenderTable {
  protected _wrapper: ACRender;
  protected _aside = document.createElement('li');
  protected _body = document.createElement('li');

  constructor(protected _data: Array<IRussiaTotal>, protected _withDeletion: boolean) {
    super(_data, _withDeletion);
    this._createWrapper();
  }

  deleteTable() {
    this._withDeletion
      && document.body.removeChild(document.querySelector(`.${TABLE_CLASS}`));

    return this;
  }
  protected _createWrapper(): void {
    const _wrapper = document.createElement('ul');
    _wrapper.classList.add(TABLE_CLASS);

    this._wrapper = new Render(_wrapper);
  }
  createPart(className: string, wrapperName: '_body' | '_aside', htmlFn: 'getBodyElement' | 'getAsideElement') {
    this[wrapperName].classList.add(className);

    let items: string = '';

    this._data.forEach(city => items += this[htmlFn](city));

    this[wrapperName].insertAdjacentHTML('afterbegin', items);

    return this;
  }
  fillWrapper() {
    this._wrapper.addItems([
      { name: 'aside', value: this._aside.outerHTML },
      { name: 'body', value: this._body.outerHTML },
    ]);
    this._wrapper.render();

    return this;
  }
  getTable() {
    return this._wrapper.getHtml();
  }
  getAsideElement(city: IRussiaTotal) {
    return asideElement(city);
  }
  getBodyElement(city: IRussiaTotal) {
    return bodyElement(city);
  }
}


export const renderPage: TRenderPage = (data: IRussiaTotal[], options: IUserData): void => {
  new RenderPage(data, options)
    .createSearch()
    .createHeader()
    .createRegionToggle()
    .createRussiaInfo()
    .renderContent()
};
export const renderTable: TRenderTable = (data, withDeletion = false): string => {
  return new RenderTable(data, withDeletion)
    .deleteTable()
    .createPart('infected-table__body', '_body', 'getBodyElement')
    .createPart('infected-table__aside', '_aside', 'getAsideElement')
    .fillWrapper()
    .getTable();
};

export const refreshTable = (data: IRussiaTotal[]): void => {
  const aside = document.querySelectorAll(`.infected-table__aside-item`);
  const body = document.querySelectorAll(`.infected-table__body-item`);

  [...aside].forEach((item, i) => {
    item.querySelector('.infected-table__aside-sub-item--name').textContent = data[i].name;
  });
  [...body].forEach((item, i) => {
    item.querySelector('.infected-table__inner-cases').textContent = String(data[i].cases);
    item.querySelector('.infected-table__inner-cases_delta .infected-table__inner-text').textContent = `+ ${data[i].cases_delta}`;
    item.querySelector('.infected-table__inner-cured').textContent = String(data[i].cured);
    item.querySelector('.infected-table__inner-cured_delta .infected-table__inner-text').textContent = `+ ${data[i].cured_delta}`;
    item.querySelector('.infected-table__inner-deaths').textContent = String(data[i].deaths);
    item.querySelector('.infected-table__inner-deaths_delta .infected-table__inner-text').textContent = `+ ${data[i].deaths_delta}`;
  });
};
export const refreshToggle = (data: IRussiaTotal[], city: string) => {
  const favouriteCity = data.find(region => region.name === city);
  const items = document.querySelectorAll('.infected-toggle__advantage-item');

  [...items].forEach(element => {
    const elementType: string = element.classList[1].split('--')[1];

    element.textContent = `+ ${favouriteCity[(elementType as keyof IRussiaTotal)]}`
  });
};