export default function({ value, message }) {
  if (!value) {
    return true;
  }
  const num = Number(value);
  if (
    isNaN(num) ||
    value.endsWith('.') ||
    String(value) === String(num.toFixed(0))
  ) {
    return message;
  }
  return true;
}
