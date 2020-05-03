import {IRussiaTotal} from './interface';

const getData = (url = 'https://yastat.net/s3/milab/2020/covid19-stat/data/data_struct_1.json?ts=1587573816'): Promise<{russia_stat_struct: {data: { info: IRussiaTotal}}}> => (
  fetch(url).then(result => result.json())
);

export default getData;