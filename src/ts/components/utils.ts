import {IRussiaTotal, ISortItem, ISortType} from "./interface";

export const sort = (array: IRussiaTotal[], sortItem: ISortItem, sortType: ISortType) => {
  array = array.sort((a, b) => {
      const {[sortItem]: item1} = a;
      const {[sortItem]: item2} = b;

      if (item1 > item2) {
        return sortType === 'asc' ? 1 : -1;
      }
      if (item1 < item2) {
        return sortType === 'asc'  ? -1 : 1;
      }

      return 0;
    })

  return array;
};
export const search = (array: Array<IRussiaTotal>, value: string) => {
  value = value.toLowerCase();

  return array.filter(city => {
    const name: string = city.name.toLowerCase();

    return ~name.indexOf(value);
  }) || [];
};
export const tableSlide = (vw: number) => {
  [...document.querySelectorAll('.infected-table__header-item--else, .infected-table__body')]
    .forEach((part: HTMLElement) => part.style.transform = `translateX(${vw}vw)`);
};
export const getLastIndex = (array: any[]) => array.length - 1;

export const headerText = 'Распостронение COVID-19 в России';
export const TABLE_CLASS = 'infected-table__table';

export const russiaBlockHeader = 'Статистика по России';
export const getThousands = (n: number) => Math.round(n / 1000);

export const headerHTML = `<header class="infected-header__header">${headerText}</header>`;
export const searchHTML = `<div class="infected-search infected-header__search">
                        <label class="infected-search__label">
                          Поиск <input type="text" class="infected-search__input">
                        </label>
                      </div>`;
export const tableHeaderHTML = (
  `<ul class="infected-table__header">
              <li class="infected-table__header-item infected-table__header-item--name">
                <div class="infected-table__item-name">Область</div>
              </li>
              <li class="infected-table__header-item infected-table__header-item--else">
                <div class="infected-table__item-cases">Больные</div>
                <div class="infected-table__item-cured">Выздоровевшие</div>
                <div class="infected-table__item-deaths">Умершие</div>
              </li>
              <li class="infected-table__header-nav">
                <button class="infected-nav__button infected-nav__button--right">-></button>
                <button class="infected-nav__button infected-nav__button--left"><-</button>
              </li>
            </ul>`
);
export const toggleAdvantages = (favouriteCity: IRussiaTotal) => `
            <div class='infected-toggle__advantages-wrapper'>
              <div class="infected-toggle__advantage-item infected-toggle__advantage-item--cases_delta">+&nbsp;${favouriteCity.cases_delta}</div>
              <div class="infected-toggle__advantage-item infected-toggle__advantage-item--cured_delta">+&nbsp;${favouriteCity.cured_delta}</div>
              <div class="infected-toggle__advantage-item infected-toggle__advantage-item--deaths_delta">+&nbsp;${favouriteCity.deaths_delta}</div>
            </div>`;
export const russiaBlock = (info: IRussiaTotal, date: string): string => `
  <section class="russia-info infected-header__russia-info">
    <button class="russia-info__update-button"></button>
    <header class="russia-info__header">${russiaBlockHeader}</header>
    <p class="russia-info__sub-header">Данные актуальны на
      <span class="russia-info__date">
        ${new Date(Date.parse(date)).toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'})}
      </span>
    </p>
    <main class="russia-info__main">
      <div class="russia-info__item russia-info__item--cured">
        <header class="russia-info__item-header russia-info__item-header--cured"><span class="russia-info__cured-delta">+ ${info.cured_delta}</span> (за сутки)</header>
        <main class="russia-info__item-main">
          <p class="russia-info__item-count">${getThousands(info.cured)} тыс.</p>
          <p class="russia-info__item-info">Выздоровели</p>
        </main>
      </div>
      <div class="russia-info__border"></div>
      <div class="russia-info__item russia-info__item--cases">
        <header class="russia-info__item-header russia-info__item-header--cases"><span class="russia-info__cases-delta">+ ${info.cases_delta}</span> (за сутки)</header>
        <main class="russia-info__item-main">
          <p class="russia-info__item-count">${getThousands(info.cases)} тыс.</p>
          <p class="russia-info__item-info">Заразились</p>
        </main>
      </div>
      <div class="russia-info__border"></div>
      <div class="russia-info__item russia-info__item--deaths">
        <header class="russia-info__item-header russia-info__item-header--deaths"><span class="russia-info__deaths-delta">+ ${info.deaths_delta}</span> (за сутки)</header>
        <main class="russia-info__item-main">
          <p class="russia-info__item-count">${getThousands(info.deaths)} тыс.</p>
          <p class="russia-info__item-info">Умерли</p>
        </main>
      </div>
    </main>
  </section>
`;
export const asideElement = (city: IRussiaTotal) => `<div class="infected-table__aside-item">
          <div class="infected-table__aside-sub-item infected-table__aside-sub-item--name">${city.name}</div>
        </div>`;
export const bodyElement = (city: IRussiaTotal) => `<div class="infected-table__body-item">
          <div class="infected-table__body-sub-item infected-table__body-sub-item--cases">
            <span class="infected-table__inner-cases">${city.cases}</span>
            <span class="infected-table__inner-cases_delta"><span class="infected-table__inner-text">+ ${city.cases_delta}</span></span>
          </div>
          <div class="infected-table__body-sub-item infected-table__body-sub-item--cured">
            <span class="infected-table__inner-cured">${city.cured}</span>
            <span class="infected-table__inner-cured_delta"><span class="infected-table__inner-text">+ ${city.cured_delta}</span></span>
          </div>
          <div class="infected-table__body-sub-item infected-table__body-sub-item--deaths">
            <span class="infected-table__inner-deaths">${city.deaths}</span>
            <span class="infected-table__inner-deaths_delta"><span class="infected-table__inner-text">+ ${city.deaths_delta}</span></span>
          </div>
        </div>`;
export const errorPage = `
  <main style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh">
    К сожалению, данные не загрузились :(
    <button onclick="( () => location.reload() )();">Попробовать ещё раз</button>
  </main>
`;
