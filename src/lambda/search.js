const isChinese = require('is-chinese')
const maxmind = require('maxmind');
const path = require('path');
const { stringify } = require("qs");

const BAIDU_ENGINE = ['https://www.baidu.com/s', 'wd']
const BING_ENGINE = ['https://cn.bing.com/search', 'q']
const GOOGLE_ENGINE = ['https://www.google.com/search', 'q']

const GEOIP_DB = path.join('data', 'GeoLite2-Country.mmdb');




/** Memoize loading of geoIP library */
// let countryLookup = maxmind.openSync(GEOIP_DB);
let countryLookup = null;

function getEngine(searchQuery, ipAddress) {

  // To debug your problem
  console.log('TO DEBUG PROBLEM START');
  console.log(path.resolve(GEOIP_DB));
  console.log('TO DEBUG PROBLEM END');


  if (isChinese(searchQuery)) {
    // query is all Chinese characters
    return BAIDU_ENGINE;
  }

  // ip is China
  const country = countryLookup && ipAddress ? countryLookup.get(ipAddress) : null;
  console.log(ipAddress, country)
  if (country && country.country && country.country.iso_code && country.country.iso_code === 'CN') {
    return BING_ENGINE;
  }

  return GOOGLE_ENGINE;
}

function redirectToEngine([url, queryParamKey], query) {
  return {
    statusCode: 302,
    headers: {
      'Location': url + stringify({ [queryParamKey]: query }, { addQueryPrefix: true }),
    },
    body: '',
  };
}


exports.handler = async (event, context) => {
  const { queryStringParameters = {}, headers = {} } = event;
  const query = queryStringParameters['q'];
  const ip = headers['client-ip']
  const engine = getEngine(query, ip)

  return redirectToEngine(engine, query)
};
