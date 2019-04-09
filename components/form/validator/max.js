export default function({ value, params, message }) {
  if (!value) {
    return true;
  }

  if (Math.max(...[].concat(value)) > params) {
    return message;
  }
  return true;
}
