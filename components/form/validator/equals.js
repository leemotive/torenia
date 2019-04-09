import utils from '../../utils/utils';

export default function({
  fullname,
  value,
  params,
  global = false,
  message,
  formData,
}) {
  if (!value) {
    return true;
  }
  const namepaths = fullname.split('.');
  namepaths.pop();
  const targetName = global ? params : namepaths.push(params).join('.');
  const target = utils.getPathNameData(formData, targetName);
  if (value != target) {
    return message;
  }
  return true;
}
