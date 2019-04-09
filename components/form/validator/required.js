export default function({ value, params }) {
  return Boolean(!params || (value && value.length > 0));
}
