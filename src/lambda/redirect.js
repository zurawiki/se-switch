const { stringify } = require("qs");

exports.handler = function (event, context, callback) {
  const { queryStringParameters } = event;
  console.log(event);
  callback(null, {
    statusCode: 302,
    body: '',
    headers: {
      'Location': 'https://www.google.com/?' + stringify(queryStringParameters),
    }
  });
};
