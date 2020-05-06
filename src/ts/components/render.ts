import {
  TRenderTable,
  IRussiaTotal,
  TRenderPage,
  IUserData,
  ACRenderPage,
  TRegionToggle,
  ACRegionToggle,
  ACRenderTable
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

class RenderPage extends ACRenderPage {
  protected _headerWrapper = document.createElement('div');
  protected _regionToggle = '';
  protected _header = '';
  protected _search = '';
  protected _tableHeader = '';
  protected _russiaInfo = '';

  customizeHeaderWrapper() {
    this._headerWrapper.classList.add('infected__header', 'infected-header');

    return this;
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

    this._regionToggle = regionToggle(sort(this.data, 'name', 'asc'), this);

    return this;
  }
  createHeader() {
    this._header = headerHTML;

    return this;
  }
  createSearch() {
    this._search = searchHTML;

    return this;
  }
  createTableHeader() {
    this._tableHeader = tableHeaderHTML;

    return this;
  }
  createRussiaInfo() {
    this._russiaInfo = russiaBlock(this.options.russiaInfo, this.options.currentDate);

    return this;
  }
  fillContent() {
    this._headerWrapper.insertAdjacentHTML('afterbegin', this._russiaInfo);
    this._headerWrapper.insertAdjacentHTML('afterbegin', this._regionToggle);
    this._headerWrapper.insertAdjacentHTML('afterbegin', this._header);
    this._headerWrapper.insertAdjacentHTML('afterbegin', this._search);

    document.body.insertAdjacentHTML('afterbegin', this._tableHeader);
    document.body.insertAdjacentHTML('afterbegin', this._headerWrapper.outerHTML);

    return this;
  }
  renderAndInsertTable() {
    renderTable(this.data);

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
  protected _wrapper = document.createElement('ul');
  protected _aside = document.createElement('li');
  protected _body = document.createElement('li');
  protected _data: Array<IRussiaTotal>;

  deleteTable() {
    this._withDeletion
      && document.body.removeChild(document.querySelector(`.${TABLE_CLASS}`));

    return this;
  }
  createWrapper() {
    this._wrapper.classList.add(TABLE_CLASS);

    return this;
  }
  createPart(className: string, wrapperName: '_body' | '_aside', htmlFn: 'getBodyElement' | 'getAsideElement') {
    this[wrapperName].classList.add(className);

    let items: string = '';

    this._data.forEach(city => items += this[htmlFn](city));

    this[wrapperName].insertAdjacentHTML('afterbegin', items);

    return this;
  }
  fillWrapper() {
    this._wrapper.append(this._aside);
    this._wrapper.append(this._body);

    return this;
  }
  uploadWrapper() {
    document.body.append(this._wrapper);

    return this;
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
    .customizeHeaderWrapper()
    .createRegionToggle()
    .createHeader()
    .createSearch()
    .createTableHeader()
    .createRussiaInfo()
    .fillContent()
    .renderAndInsertTable();
};
export const renderTable: TRenderTable = (data, withDeletion = false): void => {
  new RenderTable(data, withDeletion)
    .deleteTable()
    .createWrapper()
    .createPart('infected-table__body', '_body', 'getBodyElement')
    .createPart('infected-table__aside', '_aside', 'getAsideElement')
    .fillWrapper()
    .uploadWrapper();
};

export const refreshTable: TRenderTable = data => {
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