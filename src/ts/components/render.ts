import {
  TRenderTable,
  IRussiaTotal,
  TRenderPage,
  IUserData,
  CRenderPage,
  TRegionToggle,
  CRegionToggle,
  CRenderTable
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

class RenderPage implements CRenderPage {
  data: IRussiaTotal[];
  options: IUserData;

  headerWrapper = document.createElement('div');
  regionToggle = '';
  header = '';
  search = '';
  tableHeader = '';
  russiaInfo = '';

  constructor(data: IRussiaTotal[], options: IUserData) {
    this.data = data;
    this.options = options;
  }

  customizeHeaderWrapper() {
    this.headerWrapper.classList.add('infected__header', 'infected-header');

    return this;
  }
  createRegionToggle() {
    const regionToggle: TRegionToggle = (data: IRussiaTotal[], self: CRenderPage): string => {
      return new RegionToggle(data, self)
        .createWrapper()
        .getFavouriteCity()
        .createSelect()
        .createOptions()
        .fillSelect()
        .createAdvantage()
        .fillWrapper()
    };

    this.regionToggle = regionToggle(sort(this.data, 'name', 'asc'), this);

    return this;
  }
  createHeader() {
    this.header = headerHTML;

    return this;
  }
  createSearch() {
    this.search = searchHTML;

    return this;
  }
  createTableHeader() {
    this.tableHeader = tableHeaderHTML;

    return this;
  }
  createRussiaInfo() {
    this.russiaInfo = russiaBlock(this.options.russiaInfo, this.options.currentDate);

    return this;
  }
  fillContent() {
    this.headerWrapper.insertAdjacentHTML('afterbegin', this.russiaInfo);
    this.headerWrapper.insertAdjacentHTML('afterbegin', this.regionToggle);
    this.headerWrapper.insertAdjacentHTML('afterbegin', this.header);
    this.headerWrapper.insertAdjacentHTML('afterbegin', this.search);

    document.body.insertAdjacentHTML('afterbegin', this.tableHeader);
    document.body.insertAdjacentHTML('afterbegin', this.headerWrapper.outerHTML);

    return this;
  }
  renderAndInsertTable() {
    renderTable(this.data);

    return this;
  }
}
class RegionToggle implements CRegionToggle {
  data: IRussiaTotal[];
  self: CRenderPage;
  wrapper = document.createElement('div');
  favouriteCity: IRussiaTotal;
  items = '';
  select = document.createElement('select');
  advantages = '';

  constructor(data: IRussiaTotal[], self: CRenderPage) {
    this.data = data;
    this.self = self;
  }
  createWrapper() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('infected-header__toggle', 'infected-toggle');
    this.wrapper.textContent = 'Мой регион: ';

    return this;
  }
  getFavouriteCity() {
    this.favouriteCity = this.self.options?.favourite
      ? this.data.find(city => city.name === this.self.options.favourite)
      : {cases_delta: 0, deaths_delta: 0, cured_delta: 0, name: '', deaths: 0, cured: 0, cases: 0};

    return this;
  }
  createSelect() {
    this.select = document.createElement('select');
    this.select.classList.add('infected-toggle__select');

    return this;
  }
  createOptions() {
    this.data.forEach(city => {
      this.items += `<option value="${city.name}" ${city.name === this.self.options?.favourite && 'selected'}>${city.name}</option>`
    });

    return this;
  }
  fillSelect() {
    this.select.insertAdjacentHTML('afterbegin', this.items);

    return this;
  }
  createAdvantage() {
    this.advantages = toggleAdvantages(this.favouriteCity);

    return this;
  }
  fillWrapper() {
    const tempWrapper = document.createElement('div');
    tempWrapper.classList.add('infected-toggle__wrapper');
    tempWrapper.append(this.select);
    tempWrapper.insertAdjacentHTML('beforeend', this.advantages);
    this.wrapper.append(tempWrapper);

    return this.wrapper.outerHTML;
  }
}
class RenderTable implements CRenderTable {
  wrapper = document.createElement('ul');
  aside = document.createElement('li');
  body = document.createElement('li');
  data: Array<IRussiaTotal>;
  withDeletion = false;

  constructor(data: Array<IRussiaTotal>, withDeletion: boolean) {
    this.data = data;
    this.withDeletion = withDeletion;
  }

  deleteTable() {
    this.withDeletion
      && document.body.removeChild(document.querySelector(`.${TABLE_CLASS}`));

    return this;
  }
  createWrapper() {
    this.wrapper.classList.add(TABLE_CLASS);

    return this;
  }
  createPart(className: string, wrapperName: 'body' | 'aside', htmlFn: 'getBodyElement' | 'getAsideElement') {
    this[wrapperName].classList.add(className);

    let items: string = '';

    this.data.forEach(city => items += this[htmlFn](city));

    this[wrapperName].insertAdjacentHTML('afterbegin', items);

    return this;
  }
  fillWrapper() {
    this.wrapper.append(this.aside);
    this.wrapper.append(this.body);

    return this;
  }
  uploadWrapper() {
    document.body.append(this.wrapper);

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
    .createPart('infected-table__body', 'body', 'getBodyElement')
    .createPart('infected-table__aside', 'aside', 'getAsideElement')
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