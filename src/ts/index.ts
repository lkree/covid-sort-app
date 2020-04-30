import getData from "./components/fetchData";
import loader from "./components/loader";
import {refreshTable, renderTable, renderPage, refreshToggle} from "./components/render";
import {sort, search} from "./components/utils";
import {ISortItem, IApp, IInit, IRussiaTotal, IAppFunction, IAppVars, IUserData} from "./components/interface";

import './css/index.scss';
import {getFromLocalStorage, setToLocalStorage} from "./components/useLocalStorage";

const app = (): IApp => {
  const w: IAppFunction = {
    async init() {
      const w: IInit = {

        showLoader: () => {
          loader.showLoader();

          return w;
        },
        fetchData: async () => {
          this.data = await getData();
          console.log(this.data);

          return w;
        },
        handleData: () => {
          const {data, dates} = this.data.russia_stat_struct;
          this.data = Object.keys(data).map(key => data[key].info);
          this.currentDate = dates[dates.length - 1];

          return w;
        },
        getUserData: () => {
          this.userData = getFromLocalStorage(['favourite']);

          return w;
        },
        renderData: () => {
          renderPage(this.data, this.userData);

          return w;
        },
        hideLoader: () => {
          loader.hideLoader();

          return w;
        },
      };

      (await w
        .showLoader()
        .fetchData())
        .handleData()
        .getUserData()
        .renderData()
        .hideLoader();

      return this;
    },
    createListeners() {
      this.l.onHeaderTableClick = (evt: Event) => {
        const data = this.sortedData[0] ? this.sortedData : this.data;
        const res = sort(data, ((evt.target as HTMLElement).classList[1].split('--')[1] as ISortItem), this.sortType);
        this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';

        refreshTable(res);
      };
      this.l.onInputChange = (evt: Event) => {
        const {value} = (evt.target as HTMLInputElement);

        if (value.length > 2) {
          this.sortedData = search(this.data, value);
          renderTable(this.sortedData, true);
        }
        else {
          this.sortedData = this.data;
          renderTable(this.data, true);
        }
      };
      this.l.onSelectChange = (evt: Event) => {
        const {target} = evt;

        setToLocalStorage({favourite: (<HTMLSelectElement>target).value});
        refreshToggle(this.data, (<HTMLSelectElement>target).value);
      };

      return this;
    },
    addListeners() {
      [...document.querySelectorAll('.infected-table__header-item')]
        .forEach(item => {
          item.addEventListener('click', this.l.onHeaderTableClick);
        });
      document.querySelector('.infected-search__input').addEventListener('input', this.l.onInputChange);
      document.querySelector('.infected-toggle__select').addEventListener('input', this.l.onSelectChange);

      return this;
    },
  };

  return Object.assign(w, ({
    data: ([] as Array<IRussiaTotal>),
    l: {
      onHeaderTableClick: (evt: Event) => {},
      onInputChange: (evt: Event) => {},
      onSelectChange: (evt: Event) => {},
    },
    sortType: 'asc',
    sortItem: ('' as ISortItem),
    sortedData: [],
    userData: ({} as IUserData),
    currentDate: ''
  } as IAppVars));
}
(async () => {
    (await
      app()
      .init())
      .createListeners()
      .addListeners();
})();