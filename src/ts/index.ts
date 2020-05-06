import getData from "./components/fetchData";
import loader from "./components/loader";
import {refreshTable, renderTable, renderPage, refreshToggle} from "./components/render";
import {sort, search, errorPage, tableSlide} from "./components/utils";
import {
  ACApp,
  IListeners,
  IRussiaTotal,
  ISortType,
  ISortItem,
  IUserData, TApp, ACInit, TFetchData
} from "./components/interface";
import {getFromLocalStorage, setToLocalStorage} from "./components/useLocalStorage";
import {
  onHeaderTableClick,
  onInputChange,
  onSelectChange,
  onSlideChange,
  onSlideTouch,
  onUpdateButtonClick,
} from "./components/eventListeners";

import './css/index.scss';

class Init extends ACInit {
  data: TFetchData;

  reInitiate() {
    if (this.reInit)
      document.body.innerHTML = '';

    return this;
  }
  renderError() {
    document.body.insertAdjacentHTML('afterbegin', errorPage);
  }
  showLoader() {
    loader.showLoader();

    return this;
  }
  getUserDevice() {
    this._app.userData.device = window.innerWidth > 1024
      ? 'desktop'
      : window.innerWidth > 900 ? 'tablet' : 'mobile';

    return this;
  }
  async fetchData() {
    this.data = await getData()
      .catch(e => {
        this._app.cancel = true;
        console.log(e);

        this.renderError();
      }) || {
      russia_stat_struct: {
        data: {
          1: {
            info: {
              cases_delta: 0,
              deaths: 0,
              deaths_delta: 0,
              cured: 0,
              cured_delta: 0,
              cases: 0,
              name: ''
            }
          }
        },
        dates: ['a', 'b'],
      }
    };

    return this;
  }
  handleData() {
    if (this._app.cancel) return this;

    const {data, dates} = this.data.russia_stat_struct;
    this._app.data = Object
      .keys(data)
      .map((key: '1') => data[key].info)
      .filter(city => {
        if (city.name === 'Россия')
          this._app.russiaInfo = city;

        return city.name !== 'Россия';
      });
    this._app.currentDate = dates[dates.length - 1];

    return this;
  }
  getUserData() {
    if (this._app.cancel) return this;

    this._app.userData = {
      currentDate: this._app.currentDate,
      russiaInfo: this._app.russiaInfo,
      favourite: getFromLocalStorage(['favourite']).favourite || '',
      ...this._app.userData,
    };

    return this;
  }
  renderData() {
    if (this._app.cancel) return this;

    renderPage(this._app.data, this._app.userData);

    return this;
  }
  hideLoader() {
    loader.hideLoader();

    return this;
  }
}
class App extends ACApp {
  data: Array<IRussiaTotal> = [];
  l: IListeners = {
    onHeaderTableClick: () => {},
    onInputChange: () => {},
    onSelectChange: () => {},
    onSlideChange: () => () => {},
    onSlideTouch: () => () => {},
    onUpdateButtonClick: () => {},
  };
  sortType: ISortType = 'asc';
  sortItem: ISortItem = ('' as ISortItem);
  sortedData: Array<IRussiaTotal> = [];
  userData: IUserData = {};
  currentDate: string = '';
  cancel: boolean = false;
  russiaInfo: IRussiaTotal;

  async init(reInit: boolean) {
    (await
      new Init(reInit, this)
      .reInitiate()
      .showLoader()
      .getUserDevice()
      .fetchData())
      .handleData()
      .getUserData()
      .renderData()
      .hideLoader();

    return this;
  }
  createListeners() {
    if (this.cancel) return this;

    this.l = {
      onHeaderTableClick: (evt: Event) => {
        onHeaderTableClick(this, sort, refreshTable, evt);
      },
      onInputChange: (evt: Event) => {
        onInputChange(this, renderTable, search, evt);
      },
      onSelectChange: (evt: Event) => {
        onSelectChange(this, setToLocalStorage, refreshToggle, evt);
      },
      onSlideChange: (evt: Event, customDirection?: 'right' | 'left') => {
        onSlideChange(evt, tableSlide, customDirection);
      },
      onSlideTouch: (evt: TouchEvent) => {
        onSlideTouch(this.l.onSlideChange, evt);
      },
      onUpdateButtonClick: () => {
        onUpdateButtonClick(appInit);
      },
    };

    return this;
  }
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
  }
}

const appInit: TApp = async (reInit = false): Promise<void> => {
  (await
    new App()
      .init(reInit))
      .createListeners()
      .addListeners();
};

appInit();