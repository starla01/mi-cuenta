const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

const completeTime = function(i) {
  i = Number(i);
  if (i < 10) i = '0' + i;
  return i;
};

export default function format(model, date, useMonthsInWords) {
  var d = completeTime(date.getDate());
  var M = completeTime(date.getMonth() + 1);
  var y = completeTime(date.getFullYear());

  if (useMonthsInWords) M = months[date.getMonth()];

  return model
    .replace('DD', d)
    .replace('MM', M)
    .replace('YYYY', y);
}
