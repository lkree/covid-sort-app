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

export const headerText = 'Распостронение COVID-19 в России';
export const TABLE_CLASS = 'infected-table__table';
export const errorPage = `
  <main style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh">
    К сожалению, данные не загрузились :(
    <button onclick="( () => location.reload() )();">Попробовать ещё раз</button>
  </main>
`;