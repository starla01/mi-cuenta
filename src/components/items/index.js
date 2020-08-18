import React, { useContext } from 'react';
import { Context } from '../../providers/account';
import styles from './index.module.sass';
import { currency, amount, getStatus, getTrackingLink } from '../../misc/';

const Items = (props) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone';
  const {
    urlimg,
    urlproduct,
    items,
    qty,
    order,
    listPrice,
    productName,
    sellingPrice,
    itemIndex,
    deliveryEnd,
    deliveryStart
  } = props;
  const stats = (order && getStatus(order)) || null;
  const priceFinal = currency(amount(sellingPrice));
  const listPriceFinal = currency(amount(listPrice));

  let shippingEstimate;
  const seller = props.sellers;
  order.shippingData &&
    order.shippingData.logisticsInfo &&
    order.shippingData.logisticsInfo.forEach((prod, i) => {
      items[prod.itemIndex].logisticInfo = prod;
      if (prod) {
        shippingEstimate =
          (prod.slas.find((sla) => sla.id === prod.selectedSla) || {}).shippingEstimate || '';
        shippingEstimate = shippingEstimate.replace('bd', '');
      }
    });

  const allPackages =
    props.package.packages &&
    props.package.packages.map((pack, i) => {
      const trackingLink =
        pack.items.length && pack.items[0].itemIndex === itemIndex
          ? getTrackingLink(pack.courier, pack.trackingNumber)
          : null;
      return (
        <div key={i} className={styles.packageDetail}>
          {trackingLink !== null && stats.index !== 6 && (
            <>
              <div className={styles.delivered}>
                {(stats.index === 5 && 'Paquete entregado con ') || 'En proceso de entrega con '}
                <span>{pack.courier}</span> | No. Guía <span>{pack.trackingNumber}</span>
              </div>
              <a
                target="_blank"
                href={trackingLink}
                rel="noopener noreferrer"
                className={styles.buttonTrack}>
                Rastréalo aquí
              </a>
            </>
          )}
        </div>
      );
    });

  return (
    <div className={styles.wrapperProducts}>
      <div className={`${styles.product} ${styles[breakpoint]}`}>
        <div className={`${styles.image} ${styles[breakpoint]}`}>
          <img src={urlimg} alt={urlimg} />
        </div>
        <div className={`${styles.productDescription} ${styles[breakpoint]}`}>
          <div className={`${styles.nameProduct} ${styles[breakpoint]}`}>
            <a href={urlproduct}>{productName}</a>
          </div>
          <div className={styles.pza}>
            <span>{`(${qty} ${qty > 1 ? 'Piezas' : 'Pieza'})`}</span>
          </div>
          {!!deliveryStart && !!deliveryEnd && (
            <div className={styles.deliveryRanges}>
              {'Recíbelo entre '}
              {breakpoint !== 'desktop' && breakpoint !== 'largedesktop' && <br />}
              <strong>{`${deliveryStart} y ${deliveryEnd}`}</strong>
            </div>
          )}
          {(stats.index === 1 || stats.index === 0) && (
            <div className={styles.deliveryRanges}>
              {'Fecha de entrega: '}
              <strong>por confirmar</strong>
            </div>
          )}
          {isMobile && (
            <div className={styles.price}>
              <div className={styles.lastQty}>
                {priceFinal !== listPriceFinal ? listPriceFinal : null}
              </div>
              <div className={`${styles.qty} ${styles[breakpoint]}`}>{`$ ${priceFinal}`}</div>
            </div>
          )}
          {stats.index === 6 && <div className={styles.cancel}>Paquete cancelado</div>}
          {seller !== '1' && stats.index === 6 && (
            <div className={styles.seller}>
              Consultar <a href="/terminos-y-condiciones">políticas de seller</a> para conocer los
              posibles motivos
            </div>
          )}
          {allPackages}
        </div>
        {!isMobile && (
          <div className={styles.price}>
            <div className={styles.lastQty}>
              {priceFinal !== listPriceFinal ? listPriceFinal : null}
            </div>
            <div className={styles.qty}>${priceFinal}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
