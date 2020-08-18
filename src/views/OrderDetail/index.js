import React, { useEffect } from 'react';
import queryString from 'query-string';
import styles from './orderDetail.sass';
import Profile from '../../components/profile/';
import ItemDetail from '../../components/itemDetail';
import Spinner from '../../components/Spinner/';
import { getStatus, currency } from '../../misc';
import { Link } from 'react-router-dom';
import { ReactComponent as Tag } from '../../components/icons/tag.svg';
import { ReactComponent as AddresPin } from '../../components/icons/address-pin.svg';
import { ReactComponent as Cash } from '../../components/icons/cash.svg';
import { ReactComponent as Shipping } from '../../components/icons/free-shipping.svg';
import { ReactComponent as Shippings } from '../../components/icons/my-shippings.svg';
import { ReactComponent as ArrowLeft } from '../../components/icons/arrow-left-slim.svg';
import { ReactComponent as Calendar } from '../../components/icons/calendar.svg';

// FIXME: cambiar a funciones dentro de misc
const formatDate = (date) => {
  date = new Date(date);
  var monthNames = [
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
    'Diciembre',
  ];
  var monthIndex = date.getMonth();

  return date.getDate() + ' de ' + monthNames[monthIndex] + ' del ' + date.getFullYear();
};

// FIXME: optimizar funcion
const paymentInfo = (payment) => {
  let referencia = '';
  switch (payment.paymentSystem) {
    case '510131':
    case '510141':
    case '510299':
      referencia = 'Pago en efectivo';
      break;
    case '201':
      referencia = 'Referencia para pago: ' + payment.tid;
      break;
    case '202':
    case '203':
      referencia = '';
      break;
    default:
      referencia = 'Terminación ' + payment.lastDigits;
      break;
  }
  return referencia;
};

const getOrderId = (search) => {
  const searchUrl = new URLSearchParams(search);
  return searchUrl.get('order');
};

const payments = ['204', '201', '510130', '510131', '510141', '510299', '915'];

const OrderDetail = ({ state, actions, props }) => {
  const orderId = (props.location.search && getOrderId(props.location.search)) || null;

  useEffect(() => {
    actions.getOrderDetail(orderId);
  }, []);

  if (!state.order) return <Spinner />;

  const order = state.order || {};
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  const orderStatus = getStatus(order.status, order.packageAttachment);

  // FIXME: anular condicion para procesar cancelaciones incluyendo MP
  const isEktProduct = order.items.every((items) => items.seller);
  const isTotalCancelation = order.shippingData.selectedAddresses.every(
    (address) => address.addressType === 'store'
  );
  const isStatusCancelable = orderStatus.index < 3;
  const isStatusCancelableStore = orderStatus.index < 4;
  const isPaymentCancelled = orderStatus.index >= 2;
  const [transaction = {}] = order.paymentData.transactions;
  const [payment = {}] = transaction.payments;
  const isMtcn = payments.includes(payment.paymentSystem);

  const { productsCancel = [] } = order.selfService;
  const availableCancel = (order.items.length === productsCancel.length && true) || false;

  let searchParams = {
    mtcn: isMtcn,
    order: orderId,
    isTotalCancelation,
  };

  if (isTotalCancelation) {
    searchParams.items = order.items.map(({ productId }) => productId);
  }

  const items = order.items.filter((item) => !item.isCanceled);
  const itemsCanceled = order.items.filter((item) => item.isCanceled);
  return (
    <div className={styles.container}>
      {!isMobile && <Profile />}
      <section className={`${styles.containerOrder} ${styles[breakpoint]}`}>
        <Link className={styles.title} to={'./orders'}>
          <ArrowLeft className={styles.iconFill} width="28" height="33" />
          <Shippings className={styles.iconFill} width="33" height="33" />
          <span>Regresar a mis pedidos</span>
        </Link>
        <div className={`${styles.descriptionsOrder} ${styles[breakpoint]} active`}>
          <div className={`${styles.statusTextOrder} ${styles[breakpoint]}`}>
            Estatus del pedido:
          </div>
          <div className={`${styles.labelStatus} ${styles[breakpoint]}`}>{orderStatus.text}</div>
        </div>
        <div className={styles.containerDescriptions}>
          <div className={`${styles.numberOrder}  ${styles[breakpoint]}`}>No. {orderId}</div>
          <div className={styles.containerDescriptionStatus}>
            <div className={styles.descriptionsOrderStatus}>
              <Calendar width="20" height="15" />
              <div className={styles.textStatus}>
                Fecha de compra <span>{formatDate(order.creationDate)}</span>
              </div>
            </div>
            {order.sellers.length === 1 && (
              <div className={styles.descriptionsOrderStatus}>
                <Tag width="20" height="20" />
                <div className={styles.textStatus}>
                  Vendido y enviado por{' '}
                  <span className={styles.underline}>{order.sellers[0].name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.descriptionDetail} ${styles[breakpoint]}`}>
          <div className={`${styles.headerDetail} ${styles[breakpoint]}`}>
            <Shipping width="48" height="48" />
            <div className={styles.headerText}>
              <div className={`${styles.headerDescription} ${styles[breakpoint]}`}>
                Tipo de entrega
              </div>
              <div className={styles.headerResum}>
                {order.shippingData.logisticsInfo[0].selectedSla}
              </div>
            </div>
          </div>
          <div className={`${styles.headerDetail} ${styles[breakpoint]}`}>
            <AddresPin width="48" height="44" />
            <div className={styles.headerText}>
              <div className={`${styles.headerDescription} ${styles[breakpoint]}`}>Dirección</div>
              <div className={`${styles.headerResum} ${styles.headerAddress}`}>
                <span>{order.shippingData.address.receiverName}</span>
                <p>
                  {order.shippingData.address.street}{' '}
                  {order.shippingData.address.complement !== null
                    ? ' - ' + order.shippingData.address.complement
                    : ''}
                  ,{order.shippingData.address.neighborhood},&nbsp; CP:&nbsp;
                  {order.shippingData.address.postalCode},&nbsp;
                  {order.shippingData.address.city},&nbsp;
                  {order.shippingData.address.state}
                </p>
              </div>
            </div>
          </div>
          <div className={`${styles.headerDetail} ${styles[breakpoint]}`}>
            <Cash width="48" height="48" />
            <div className={styles.headerText}>
              <div className={`${styles.headerDescription} ${styles[breakpoint]}`}>
                Forma de pago
              </div>
              <div className={styles.headerResum}>
                <strong>{order.paymentData.transactions[0].payments[0].paymentSystemName}</strong>
              </div>
              {!order.hitch && (
                <>
                  {payment.paymentSystem !== '203' && (
                    <div className={styles.headerResum}>
                      <span>Monto de pago</span>
                      <br />
                      <strong>$ {currency(order.value / 100)}.00</strong>
                    </div>
                  )}
                  <div className={styles.headerResum}>
                    <span>
                      Número de pagos:
                      <strong> {order.paymentData.transactions[0].payments[0].installments}</strong>
                    </span>
                  </div>
                  <div className={styles.headerResum}>
                    <strong>{paymentInfo(order.paymentData.transactions[0].payments[0])}</strong>
                  </div>
                </>
              )}
              {!!order.hitch.term && (
                <div className={styles.headerResum}>
                  <span>Semanas</span>
                  <br />
                  <strong>{order.hitch.term}</strong>
                </div>
              )}
              {!!order.hitch.weeklyPayment && (
                <div className={styles.headerResum}>
                  <span>Pago semanal</span>
                  <br />
                  <strong>${order.hitch.weeklyPayment} MXN</strong>
                </div>
              )}
              {!!order.hitch.amount && (
                <div className={styles.headerResum}>
                  <span>Pago de enganche</span>
                  <br />
                  <strong>${order.hitch.amount} MXN</strong>
                </div>
              )}
              {!!order.hitch.expired && (
                <div className={styles.headerResum}>
                  <span>Fecha límite de pago</span>
                  <br />
                  <strong>{order.hitch.expired}</strong>
                </div>
              )}
              {!!order.hitch.rap && (
                <div className={styles.headerResum}>
                  <span>Referencia de pago</span>
                  <br />
                  <span className={styles.reference}>{order.hitch.rap}</span>
                </div>
              )}
            </div>
          </div>
          {orderStatus && orderStatus.index < 6 && (
            <div className={styles.statusWraper}>
              <div className={`${styles.statusContainer} ${styles[breakpoint]}`}>
                <div
                  className={`${styles.statusBlock} ${styles[breakpoint]}  ${
                    orderStatus.index < 2 ? styles.active : styles.past
                  }`}>
                  <div className={`${styles.statusText} ${styles[breakpoint]}`}>
                    <span>Pedido confirmado</span>
                  </div>
                </div>
                <div
                  className={`${styles.centralBar} ${styles[breakpoint]} ${
                    orderStatus.index >= 2 ? styles.past : styles.gray
                  }`}
                />
                <div
                  className={`${styles.statusBlock} ${
                    orderStatus.index === 2
                      ? styles.active
                      : orderStatus.index > 2
                      ? styles.past
                      : styles.gray
                  }`}>
                  <div className={`${styles.statusText} ${styles[breakpoint]}`}>
                    <span>Pago confirmado</span>
                  </div>
                </div>
                <div
                  className={`${styles.centralBar} ${styles[breakpoint]} ${
                    orderStatus.index >= 3 ? styles.past : styles.gray
                  }`}
                />
                <div
                  className={`${styles.statusBlock} ${
                    orderStatus.index === 3
                      ? styles.active
                      : orderStatus.index > 3
                      ? styles.past
                      : styles.gray
                  }`}>
                  <div className={`${styles.statusText} ${styles[breakpoint]}`}>
                    <span>Preparando envío</span>
                  </div>
                </div>
                <div
                  className={`${styles.centralBar} ${styles[breakpoint]} ${
                    orderStatus.index >= 4 ? styles.past : styles.gray
                  }`}
                />
                <div
                  className={`${styles.statusBlock} ${
                    orderStatus.index === 4
                      ? styles.active
                      : orderStatus.index > 4
                      ? styles.past
                      : styles.gray
                  }`}>
                  <div className={`${styles.statusText} ${styles[breakpoint]}`}>
                    <span>Pedido Enviado</span>
                  </div>
                </div>
                <div
                  className={`${styles.centralBar} ${styles[breakpoint]} ${
                    orderStatus.index >= 5 ? styles.past : styles.gray
                  }`}
                />
                <div
                  className={`${styles.statusBlock} ${
                    orderStatus.index === 5 ? styles.active : styles.gray
                  }`}>
                  <div className={`${styles.statusText} ${styles[breakpoint]}`}>
                    <span>Pedido entregado</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {isStatusCancelableStore &&
          !isMtcn &&
          isEktProduct &&
          isTotalCancelation &&
          !isMobile &&
          !availableCancel && (
            <div className={styles.position}>
              <Link
                className={styles.buttonOrderDetail}
                to={`/cancelar-mi-pedido?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
        {isPaymentCancelled &&
          isMtcn &&
          isEktProduct &&
          isTotalCancelation &&
          isStatusCancelableStore &&
          !isMobile &&
          !availableCancel && (
            <div className={styles.position}>
              <Link
                className={styles.buttonOrderDetail}
                to={`/cancelar-mi-pedido?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
        {isEktProduct &&
          isStatusCancelable &&
          !isMtcn &&
          !availableCancel &&
          !isTotalCancelation &&
          !isMobile && (
            <div className={styles.position}>
              <Link
                className={styles.buttonOrderDetail}
                to={`/seleccionar-articulos?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
        {isPaymentCancelled &&
          isMtcn &&
          isEktProduct &&
          isStatusCancelable &&
          !isTotalCancelation &&
          !isMobile &&
          !availableCancel && (
            <div className={styles.position}>
              <Link
                className={styles.buttonOrderDetail}
                to={`/seleccionar-articulos?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
        {!!items.length && (
          <div className={styles.productsContainerGeneral}>
            {items.map((item) => (
              <ItemDetail key={item.id} {...{ ...item, breakpoint, orderStatus }} />
            ))}
          </div>
        )}
        {!!itemsCanceled.length && (
          <div className={`${styles.cancelItems} ${styles[breakpoint]}`}>
            Solicitud de cancelación
          </div>
        )}
        {!!itemsCanceled.length && (
          <div className={styles.productsContainerGeneral}>
            {itemsCanceled.map((item) => (
              <ItemDetail key={item.id} {...{ ...item, breakpoint, orderStatus, orderId }} />
            ))}
          </div>
        )}
        <div className={`${styles.totalOrder} ${styles[breakpoint]}`}>
          <div>
            Total <span>{` $${currency(order.value / 100)}`}</span>
          </div>
        </div>
        {isStatusCancelableStore &&
          !isMtcn &&
          isEktProduct &&
          isTotalCancelation &&
          isMobile &&
          !availableCancel && (
            <div className={`${styles.position} ${styles[breakpoint]}`}>
              <Link
                className={`${styles.buttonOrderDetail} ${styles[breakpoint]}`}
                to={`/cancelar-mi-pedido?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
        {isPaymentCancelled &&
          isMtcn &&
          isEktProduct &&
          isTotalCancelation &&
          isStatusCancelableStore &&
          isMobile &&
          !availableCancel && (
            <div className={`${styles.position} ${styles[breakpoint]}`}>
              <Link
                className={`${styles.buttonOrderDetail} ${styles[breakpoint]}`}
                to={`/cancelar-mi-pedido?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
        {isEktProduct &&
          isStatusCancelable &&
          !availableCancel &&
          !isTotalCancelation &&
          isMobile &&
          !isMtcn && (
            <div className={`${styles.position} ${styles[breakpoint]}`}>
              <Link
                className={`${styles.buttonOrderDetail} ${styles[breakpoint]}`}
                to={`/seleccionar-articulos?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
        {isPaymentCancelled &&
          isMtcn &&
          isEktProduct &&
          isStatusCancelable &&
          !isTotalCancelation &&
          isMobile &&
          !availableCancel && (
            <div className={styles.position}>
              <Link
                className={styles.buttonOrderDetail}
                to={`/seleccionar-articulos?${queryString.stringify(searchParams)}`}>
                Cancelar pedido
              </Link>
            </div>
          )}
      </section>
    </div>
  );
};

export default OrderDetail;
