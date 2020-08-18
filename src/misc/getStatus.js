export default function getStatus(status, items = { packages: [] }) {
  switch (status) {
    case 'payment-pending':
    case 'waiting-for-seller-confirmation':
      return { index: 0, text: 'Pago por confirmar' };

    case 'authorize-fulfillment':
    case 'window-to-cancel':
    case 'ready-for-handling':
    case 'handling':
      return { index: 3, text: 'Preparando envío' };

    case 'handling-shipping':
      return { index: 4, text: 'Enviado' };

    case 'invoiced':
      if (!items.packages.length) return { index: 4, text: 'Enviado' };
      const carrierFinished = items.packages.filter((pack) => (pack.courierStatus || {}).finished);
      return (
        (items.packages.length === carrierFinished.length && { index: 5, text: 'Entregado' }) || {
          index: 4,
          text: 'Enviado'
        }
      );

    case 'cancel':
    case 'canceled':
      return { index: 6, text: 'Cancelado' };

    case 'payment-approved':
    case 'waiting-for-seller-decision':
    default:
      return { index: 1, text: 'Confirmado' };
  }
}
