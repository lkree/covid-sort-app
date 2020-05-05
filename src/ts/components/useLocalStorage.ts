import {IUserData, TUserOption} from './interface';

export const getFromLocalStorage = (names: TUserOption[]): IUserData => {
  let obj: IUserData = ({} as IUserData);

  names.forEach(name => {
    obj[name] = localStorage.getItem(name);
  });

  return obj;
};

export const setToLocalStorage = (obj: IUserData): boolean => {
  return Object.keys(obj).some((key: keyof IUserData) => {
    const value = typeof obj[key] !== 'string' ? JSON.stringify(obj[key]) : obj[key];

    localStorage.setItem(key, value as string);
  });
};