import {IUserData, IUserOption} from './interface';

export const getFromLocalStorage = (names: IUserOption[]): IUserData => {
  let obj: IUserData = ({} as IUserData);

  names.forEach(name => {
    obj[name] = localStorage.getItem(name);
  });

  return obj;
};

export const setToLocalStorage = (obj: IUserData): boolean => {
  return Object.keys(obj).some((key: keyof IUserData) => {
    localStorage.setItem(key, obj[key]);
  });
};