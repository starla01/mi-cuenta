export default function getTrackingLink(courier, code) {
  switch (courier) {
    case 'DHL':
      return 'http://www.dhl.com.mx/es/express/rastreo.html?AWB=' + code;
    case 'PAQUETEXPRESS':
    case 'Paquetexpress':
      return 'https://cc.paquetexpress.com.mx/track/webpage/history.xhtml?rastreo=' + code;
    case 'ESTAFELTL':
    case 'ESTAFEPAQ':
    case 'AWiqLKLIJ3d1ZHCpHo2x':
      return 'http://www.estafeta.com/';
    case 'PALEX':
      return 'http://palex.mx/#rastreo';
    case 'FEDEX':
    case 'FEDEX1':
    case 'FEDEX2':
    case 'FEDEX3':
      return 'https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=' + code;
    default:
      return null;
  }
}
