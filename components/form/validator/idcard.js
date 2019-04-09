export default function({ value, message }) {
  if (!value) {
    return true;
  }

  let valid = true;
  value = String(value);

  valid = /^\d{17}[\d|x|X]$/.test(value);
  if (valid) {
    let year, month, day;
    year = +value.slice(6, 10);
    month = +value.slice(10, 12);
    day = +value.slice(12, 14);

    if (month > 12 || month < 1 || day > daysInMonth(month, year)) {
      valid = false;
    }
  }

  let sum = value
    .slice(0, -1)
    .split('')
    .reduce((s, c, i) => s + 2 ** (17 - i) * c, 0);
  sum = Math.abs((sum % 11) - 12) % 11;
  valid =
    sum == value.charAt(17) ||
    (value.charAt(17).toUpperCase() == 'X' && sum == 10);

  return valid || message;
}

function daysInMonth(month, year) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return (Math.ceil(Math.abs(month - 7.5)) % 2) + 30;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
