const JWT_KEY = "secret";
const emailFormat =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const dateFormat =
  /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
const CURRENT_LIMIT = 5;
const CURRENT_PAGE = 1;

module.exports = {
  JWT_KEY,
  CURRENT_LIMIT,
  CURRENT_PAGE,
  emailFormat,
  dateFormat,
};
