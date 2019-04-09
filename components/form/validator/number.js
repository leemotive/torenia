import int from './int';
import float from './float';

export default function(args) {
  const { value, message } = args;
  if (!value) {
    return true;
  }

  if (int(args) !== true && float(args) !== true) {
    return message;
  }
  return true;
}
