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

export const headerText = 'Распостронение COVID-19 в России';
export const TABLE_CLASS = 'infected-table__table';
export const errorPage = `
  <main style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh">
    К сожалению, данные не загрузились :(
    <button onclick="( () => location.reload() )();">Попробовать ещё раз</button>
  </main>
`;
export const russiaBlockHeader = 'Статистика по России';
export const getThousands = (n: number) => Math.round(n / 1000);
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