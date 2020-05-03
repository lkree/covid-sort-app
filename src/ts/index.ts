import getData from "./components/fetchData";
import loader from "./components/loader";
import {refreshTable, renderTable, renderPage, refreshToggle, tableSlide} from "./components/render";
import {sort, search, errorPage} from "./components/utils";
import {ISortItem, IApp, IInit, IRussiaTotal, IAppFunction, IAppVars, IUserData} from "./components/interface";
import {getFromLocalStorage, setToLocalStorage} from "./components/useLocalStorage";

import './css/index.scss';

const app = (): IApp => {
  const w: IAppFunction = {
    async init() {
      const w: IInit = {

        renderError: () => {
          document.body.insertAdjacentHTML('afterbegin', errorPage);
        },
        showLoader: () => {
          loader.showLoader();

          return w;
        },
        getUserDevice: () => {
          this.userData.device = window.innerWidth > 1024
            ? 'desktop'
            : window.innerWidth > 900 ? 'tablet' : 'mobile';

          return w;
        },
        fetchData: async () => {
          this.data = await getData()
            .catch(e => {
              this.cancel = true;
              console.log(e);

              w.renderError();
            });

          return w;
        },
        handleData: () => {
          if (this.cancel) return w;

          const {data, dates} = this.data.russia_stat_struct;
          this.data = Object.keys(data).map(key => data[key].info);
          this.currentDate = dates[dates.length - 1];

          return w;
        },
        getUserData: () => {
          if (this.cancel) return w;

          this.userData = {
            ...this.userData,
            ...getFromLocalStorage(['favourite'])
          };

          return w;
        },
        renderData: () => {
          if (this.cancel) return w;

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
        .getUserDevice()
        .fetchData())
        .handleData()
        .getUserData()
        .renderData()
        .hideLoader();

      return this;
    },
    createListeners() {
      if (this.cancel) return this;

      this.l.onHeaderTableClick = (evt: Event) => {
        const data = this.sortedData[0] ? this.sortedData : this.data;
        const res = sort(data, ((evt.target as HTMLElement).classList[0].split('-')[2] as ISortItem), this.sortType);
        this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';

        refreshTable(res);
      };
      this.l.onInputChange = (evt: Event) => {
        const {value} = (evt.target as HTMLInputElement);

        if (value.length > 2) {
          this.sortedData = search(this.data, value);
          renderTable(this.sortedData,true);
        } else {
          this.sortedData = this.data;
          renderTable(this.data, true);
        }
      };
      this.l.onSelectChange = (evt: Event) => {
        const {target} = evt;

        setToLocalStorage({favourite: (<HTMLSelectElement>target).value});
        refreshToggle(this.data, (<HTMLSelectElement>target).value);
      };
      this.l.onSlideChange = ((status = 0, max = -100, min = 0, step = 50) => (evt: Event) => {
        const direction = (<HTMLElement>evt.target).classList[1].split('--')[1];

        if (direction === 'right') {
          if (status !== max) {
            status -= step;
            tableSlide(status);
          } else
            return;
        } else {
          if (status !== min) {
            status += step;
            tableSlide(status);
          } else
            return;
        }

      })();

      return this;
    },
    addListeners() {
      if (this.cancel) return this;

      [...document.querySelectorAll('.infected-table__header-item')]
        .forEach(item => {
          item.addEventListener('click', this.l.onHeaderTableClick);
        });
      document.querySelector('.infected-search__input').addEventListener('input', this.l.onInputChange);
      document.querySelector('.infected-toggle__select').addEventListener('input', this.l.onSelectChange);
      [...document.querySelectorAll('.infected-nav__button')].forEach(button => {
        button.addEventListener('click', this.l.onSlideChange);
      })

      return this;
    },
  };

  return Object.assign(w, ({
    data: ([] as Array<IRussiaTotal>),
    l: {
      onHeaderTableClick: () => {},
      onInputChange: () => {},
      onSelectChange: () => {},
      onSlideChange: () => () => {}
    },
    sortType: 'asc',
    sortItem: ('' as ISortItem),
    sortedData: [],
    userData: ({} as IUserData),
    currentDate: '',
    cancel: false,
  } as IAppVars));
};
(async () => {
    (await
      app()
      .init())
      .createListeners()
      .addListeners();
})();