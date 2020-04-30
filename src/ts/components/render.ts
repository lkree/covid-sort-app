import {IRenderTable, IRussiaTotal, IRenderPage, IUserData, IRegionToggle} from "./interface";
import {sort, headerText, TABLE_CLASS} from "./utils";

export const renderTable: IRenderTable = (data, withDeletion = false) => {
  if (withDeletion)
    document.body.removeChild(document.querySelector(`.${TABLE_CLASS}`));

  const renderBody = () => {
    const wrapper = document.createElement('ul');
    wrapper.classList.add(TABLE_CLASS);

    let items: string = '';

    data.forEach(city => {
      items += `<li class="infected-table__item">
          <div class="infected-table__sub-item infected-table__sub-item--name">${city.name}</div>
          <div class="infected-table__sub-item infected-table__sub-item--cases">
            <span class="infected-table__inner-cases">${city.cases}</span>
            <span class="infected-table__inner-cases_delta"><span class="infected-table__inner-text">+ ${city.cases_delta}</span></span>
          </div>
          <div class="infected-table__sub-item infected-table__sub-item--cured">
            <span class="infected-table__inner-cured">${city.cured}</span>
            <span class="infected-table__inner-cured_delta"><span class="infected-table__inner-text">+ ${city.cured_delta}</span></span>
          </div>
          <div class="infected-table__sub-item infected-table__sub-item--deaths">
            <span class="infected-table__inner-deaths">${city.deaths}</span>
            <span class="infected-table__inner-deaths_delta"><span class="infected-table__inner-text">+ ${city.deaths_delta}</span></span>
          </div>
        </li>`
    });

    wrapper.insertAdjacentHTML('afterbegin', items);

    return wrapper;
  };

  document.body.append(renderBody());
};

export const renderPage: IRenderPage = (data: IRussiaTotal[], options: IUserData): void => {
  const search = () => (
    `<div class="infected-search">
      <label class="infected-search__label">
        Поиск <input type="text" class="infected-search__input">
      </label>
    </div>`
  );
  const renderTableHeader = () => (
    `<ul class="infected-table__header">
      <li class="infected-table__header-item infected-table__item--name">Область</li>
      <li class="infected-table__header-item infected-table__item--cases">Больные</li>
      <li class="infected-table__header-item infected-table__item--cured">Выздоровевшие</li>
      <li class="infected-table__header-item infected-table__item--deaths">Умершие</li>
    </ul>`
  );
  const regionToggle = (data: IRussiaTotal[]): string => {
    const app = (): IRegionToggle => {
      const w: IRegionToggle = {
        createWrapper() {
          w.wrapper = document.createElement('div');
          w.wrapper.classList.add('infected-toggle');
          w.wrapper.textContent = 'Мой регион: ';

          return w;
        },
        getFavouriteCity() {
          w.favouriteCity = options?.favourite
            ? data.find(city => city.name === options.favourite)
            : { cases_delta: 0, deaths_delta: 0, cured_delta: 0, name: '', deaths: 0, cured: 0, cases: 0 };

          return w;
        },
        createSelect() {
          w.select = document.createElement('select');
          w.select.classList.add('infected-toggle__select');

          return w;
        },
        createOptions() {
          data.forEach(city => {
            w.items += `<option value="${city.name}" ${city.name === options.favourite && 'selected'}>${city.name}</option>`
          });

          return w;
        },
        fillSelect() {
          w.select.insertAdjacentHTML('afterbegin', w.items);

          return w;
        },
        createAdvantage() {
          w.advantages = `
            <div class='infected-toggle__advantages-wrapper'>
              <div class="infected-toggle__advantage-item infected-toggle__advantage-item--cases_delta">+ ${w.favouriteCity.cases_delta}</div>
              <div class="infected-toggle__advantage-item infected-toggle__advantage-item--cured_delta">+ ${w.favouriteCity.cured_delta}</div>
              <div class="infected-toggle__advantage-item infected-toggle__advantage-item--deaths_delta">+ ${w.favouriteCity.deaths_delta}</div>
            </div>`;

          return this;
        },
        fillWrapper() {
          const tempWrapper = document.createElement('div');
          tempWrapper.classList.add('infected-toggle__wrapper');
          tempWrapper.append(w.select);
          tempWrapper.insertAdjacentHTML('beforeend', w.advantages);
          w.wrapper.append(tempWrapper);

          return w.wrapper.outerHTML;
        }
      }

      return Object.assign(w, {
        wrapper: null,
        favouriteCity: null,
        items: '',
        select: null
      });
    };

    return app()
      .createWrapper()
      .getFavouriteCity()
      .createSelect()
      .createOptions()
      .fillSelect()
      .createAdvantage()
      .fillWrapper()
  };
  const renderHeader = (): string => (
    `<header class="infected-header__header">${headerText}</header>`
  );

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('infected__header');
  headerWrapper.classList.add('infected-header');
  headerWrapper.insertAdjacentHTML('afterbegin', regionToggle(sort(data, 'name', 'asc')));
  headerWrapper.insertAdjacentHTML('afterbegin', renderHeader());
  headerWrapper.insertAdjacentHTML('afterbegin', search());

  document.body.insertAdjacentHTML('afterbegin', renderTableHeader());
  document.body.insertAdjacentHTML('afterbegin', headerWrapper.outerHTML);
  renderTable(data);
};

export const refreshTable: IRenderTable = data => {
  const items = document.querySelectorAll(`.${TABLE_CLASS} li`);

  [...items].forEach((item, i) => {
    item.querySelector('.infected-table__sub-item--name').textContent = data[i].name;
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