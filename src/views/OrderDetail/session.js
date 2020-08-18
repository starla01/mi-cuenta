import jwt from 'jsonwebtoken';

const validateCookie = (callback) => {
  fetch('/api/sessions?items=*', { credentials: 'include' })
    .then((a) => a.json())
    .then((data) => {
      let clientCookie = '';
      if (
        data.namespaces &&
        data.namespaces.cookie &&
        data.namespaces.cookie.VtexIdclientAutCookie &&
        data.namespaces.cookie.VtexIdclientAutCookie.value
      ) {
        clientCookie = data.namespaces.cookie.VtexIdclientAutCookie.value;
      }

      const decodedCookie = jwt.decode(clientCookie);

      const usersession = [
        'gmondragon@elektra.com.mx',
        'imoralesv@elektra.com.mx',
        'ozaldivar@elektra.com.mx',
        'mmiguel@elektra.com.mx',
        'rguerrag@elektra.com.mx',
        'fcamargo@elektra.com.mx',
        'plabarta@elektra.com.mx',
        'econtrerasm@elektra.com.mx',
        'olga.ramirez@elektra.com.mx',
        'ppalaciosb@elektra.com.mx',
        'arisbeth.martinez@elektra.com.mx',
        'oscar.cardenas@elektra.com.mx'
      ];

      const exist = usersession.some((user) => JSON.stringify(decodedCookie).indexOf(user) > -1);
      return callback(exist || false);
    });
};

export default validateCookie;
