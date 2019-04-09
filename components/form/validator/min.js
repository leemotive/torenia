export default function({ value, params, message }) {
  if (!value) {
    return true;
  }

  if (Math.min(...[].concat(value)) < params) {
    return message;
  }
  return true;
}
