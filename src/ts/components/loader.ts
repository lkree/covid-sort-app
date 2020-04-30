import {ILoader} from './interface';

const loader: ILoader = {
  class: 'lds-dual-ring',
  _getHtml(): string { return `<div class="${this.class}"></div>` },
  _setHTML(html: string): void {
    html
      ? document.body.insertAdjacentHTML("beforeend", html)
      : document.body.removeChild(document.body.querySelector(`.${this.class}`));
  },
  hideLoader(): void {
    this._setHTML('');
  },
  showLoader(): void {
    this._setHTML(this._getHtml());
  }
}

export default loader;