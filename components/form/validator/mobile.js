export default function({ value, message }) {
  if (!value) {
    return true;
  }

  if (!/^1\d{10}$/.test(value)) {
    return message;
  }
  return true;
}
