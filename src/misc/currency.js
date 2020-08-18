export default function currency(a) {
  var re = '\\d(?=(\\d{' + 3 + '})+' + (2 > 0 ? '\\.' : '$') + ')';
  return a.toFixed(Math.max(0, ~~2)).replace(new RegExp(re, 'g'), '$&,');
}
