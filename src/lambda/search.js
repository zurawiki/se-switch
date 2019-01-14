const isChinese = require('is-chinese')
const { stringify } = require("qs");

const BAIDU_ENGINE = ['https://www.baidu.com/s', 'wd']
const BING_ENGINE = ['https://cn.bing.com/search', 'q']
const GOOGLE_ENGINE = ['https://www.google.com/search', 'q']

function getEngine(searchQuery, ipAddress) {
  if (isChinese(searchQuery)) {
    // query is all Chinese characters
    return BAIDU_ENGINE;
  }

  // ip is China
  if (false) {
    return BING_ENGINE;
  }

  return GOOGLE_ENGINE;
}

function redirectToEngine([url, queryParamKey], query, callback) {
  callback(null, {
    statusCode: 302,
    headers: {
      'Location': url + stringify({ [queryParamKey]: query }, { addQueryPrefix: true }),
    },
    body: '',
  });
}

exports.handler = (event, context, callback) => {
  console.log(event, context);

  const { queryStringParameters } = event;
  const query = queryStringParameters['q'];

  const engine = getEngine(query, '')

  redirectToEngine(engine, query, callback)
};

