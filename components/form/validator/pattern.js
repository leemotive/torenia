export default function({ value, params, message }) {
  if (!value) {
    return true;
  }

  if (!params.test(value)) {
    return message;
  }
  return true;
}
