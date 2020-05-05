import {TFetchData} from './interface';

const getData = (
  url = 'https://yastat.net/s3/milab/2020/covid19-stat/data/data_struct_1.json?ts=1587573816'
): Promise<TFetchData> => (
  fetch(url).then(result => result.json())
);

export default getData;