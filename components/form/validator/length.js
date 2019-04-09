export default function({ value, params, message }) {
  if (!value) {
    return true;
  }

  if (value.length !== params) {
    return message;
  }
  return true;
}
