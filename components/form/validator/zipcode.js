export default function({ value, message }) {
  if (!value) {
    return true;
  }

  if (!/^\d{6}$/.test(value)) {
    return message;
  }
  return true;
}
