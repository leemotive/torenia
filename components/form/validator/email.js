export default function({ value, message }) {
  if (!value) {
    return true;
  }

  if (!/^\w+@(\w+\.)+\w+$/.test(value)) {
    return message;
  }
  return true;
}
