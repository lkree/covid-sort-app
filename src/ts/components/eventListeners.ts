import {IEventListeners, IRussiaTotal, ISortItem, ISortType} from "./interface";

export const onHeaderTableClick: IEventListeners['onHeaderTableClick'] = (
  self: {data: Array<IRussiaTotal>, sortedData:  [] | Array<IRussiaTotal>, sortType: ISortType},
  sort: Function,
  refreshTable: Function,
  evt: Event
): void => {
  const data = self.sortedData[0] ? self.sortedData : self.data;
  const res = sort(data, ((evt.target as HTMLElement).classList[0].split('-')[2] as ISortItem), self.sortType);
  self.sortType = self.sortType === 'asc' ? 'desc' : 'asc';

  refreshTable(res);
};
export const onInputChange: IEventListeners['onInputChange'] = (
  self: {sortedData: [] | Array<IRussiaTotal>, data: Array<IRussiaTotal>},
  renderTable: Function,
  search: Function,
  evt: Event
) => {
  const {value} = (evt.target as HTMLInputElement);

  if (value.length > 2) {
    self.sortedData = search(self.data, value);
    renderTable(self.sortedData,true);
  } else {
    self.sortedData = self.data;
    renderTable(self.data, true);
  }
};
export const onSelectChange: IEventListeners['onSelectChange'] = (
  self: {data: Array<IRussiaTotal>},
  setToLocalStorage: Function,
  refreshToggle: Function,
  evt: Event
) => {
  const {target} = evt;

  setToLocalStorage({favourite: (<HTMLSelectElement>target).value});
  refreshToggle(self.data, (<HTMLSelectElement>target).value);
};
export const onSlideChange: IEventListeners['onSlideChange'] = ((status = 0, max = -100, min = 0, step = 50) => (
  evt: Event,
  tableSlide: Function,
  customDirection?: 'right' | 'left',
) => {
  const direction = customDirection || (<HTMLElement>evt.target).classList[1].split('--')[1];

  if (direction === 'right') {
    status !== max
      ? status -= step
      : status = min;
  } else {
    status !== min
      ? status += step
      : status = max;
  }

  tableSlide(status);
})();
export const onSlideTouch: IEventListeners['onSlideTouch'] = ((x: number) => (
  onSlideChange: Function,
  evt: TouchEvent
) => {
  const onTouchEnd = (evt: TouchEvent) => {
    evt.currentTarget.removeEventListener('touchend', onTouchEnd);

    if (x > evt.changedTouches[0].clientX)
      onSlideChange({target: null}, 'right');

    if (x < evt.changedTouches[0].clientX)
      onSlideChange({target: null}, 'left');
  };

  x = evt.changedTouches[0].clientX;
  evt.currentTarget.addEventListener('touchend', onTouchEnd);
})(0);

export const onUpdateButtonClick: IEventListeners['onUpdateButtonClick'] = (app: Function) => {
  app(true);
};