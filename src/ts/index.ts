import getData from "./components/fetchData";
import loader from "./components/loader";
import {refreshTable, renderTable, renderPage, refreshToggle} from "./components/render";
import {sort, search, errorPage, tableSlide} from "./components/utils";
import {ISortItem, IApp, IInit, IRussiaTotal, IAppFunction, IAppVars, IUserData} from "./components/interface";
import {getFromLocalStorage, setToLocalStorage} from "./components/useLocalStorage";
import {
  onHeaderTableClick,
  onInputChange,
  onSelectChange,
  onSlideChange,
  onSlideTouch, onUpdateButtonClick
} from "./components/eventListeners";

import './css/index.scss';

const app = (): IApp => {
  const w: IAppFunction = {
    async init(reInit) {
      const w: IInit = {

        reInit: () => {
          if (reInit)
            document.body.innerHTML = '';

          return w;
        },
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
          this.data = Object
            .keys(data)
            .map(key => data[key].info)
            .filter(city => {
              if (city.name === 'Россия')
                this.russiaInfo = city;

              return city.name !== 'Россия';
            });
          this.currentDate = dates[dates.length - 1];

          return w;
        },
        getUserData: () => {
          if (this.cancel) return w;

          this.userData = {
            currentDate: this.currentDate,
            russiaInfo: this.russiaInfo,
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
        .reInit()
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

      (this.l as IAppVars['l']) = {
        onHeaderTableClick: (evt: Event) => {
          onHeaderTableClick(this, sort, refreshTable, evt);
        },
        onInputChange: (evt: Event) => {
          onInputChange(this, renderTable, search, evt);
        },
        onSelectChange: (evt: Event) => {
          onSelectChange(this, setToLocalStorage, refreshToggle, evt);
        },
        onSlideChange: (evt: Event, customDirection: 'right' | 'left') => {
          onSlideChange(evt, customDirection, tableSlide);
        },
        onSlideTouch: (evt: TouchEvent) => {
          onSlideTouch(this.l.onSlideChange, evt);
        },
        onUpdateButtonClick: (evt: Event) => {
          onUpdateButtonClick(appInit);
        },
      };

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
      });
      document.querySelectorAll('.infected-table__header-item--else, .infected-table__body').forEach(li => {
        li.addEventListener('touchstart', this.l.onSlideTouch);
      });
      document.querySelector('.russia-info__update-button').addEventListener('click', this.l.onUpdateButtonClick);

      return this;
    },
  };

  return Object.assign(w, ({
    data: ([] as Array<IRussiaTotal>),
    l: {
      onHeaderTableClick: () => {},
      onInputChange: () => {},
      onSelectChange: () => {},
      onSlideChange: () => () => {},
      onSlideTouch: () => () => {},
      onUpdateButtonClick: () => {},
    },
    sortType: 'asc',
    sortItem: ('' as ISortItem),
    sortedData: [],
    userData: ({} as IUserData),
    currentDate: '',
    cancel: false,
    russiaInfo: ({} as IRussiaTotal),
  } as IAppVars));
};

const appInit = async (reInit = false): Promise<void> => {
  (await
    app()
      .init(reInit))
      .createListeners()
      .addListeners();
};

appInit();