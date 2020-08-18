import React from 'react';
import styles from './itemDetail.sass';
import { Link } from 'react-router-dom';
import { currency } from '../../misc/';

const ItemDetail = ({
  name,
  imageUrl,
  quantity,
  detailUrl,
  breakpoint,
  orderStatus,
  price,
  folio,
  isCanceled,
  isTotalCancelation,
  sellingPrice,
  orderId,
  deliveryEnd,
  deliveryStart
}) => {
  return (
    <div className={`${styles.productsContainerIndividual} ${styles[breakpoint]}`}>
      <div className={`${styles.productDetail} ${styles[breakpoint]}`}>
        <div className={styles.image}>
          <img src={imageUrl} alt={name} />
        </div>
        <div
          className={`${(isCanceled && styles.descriptionCanceled) || styles.description} ${
            styles[breakpoint]
          }`}>
          <div
            className={`${(isCanceled && styles.nameProductCanceled) || styles.nameProduct} ${
              styles[breakpoint]
            }`}>
            <a href={detailUrl}>{name}</a>
            <br />
            {!!deliveryStart && !!deliveryEnd && (
              <p className={styles.deliveryRanges}>
                {'Recíbelo entre '}
                <strong>{`${deliveryStart} y ${deliveryEnd}`}</strong>
              </p>
            )}
          </div>
          <div
            className={`${(isCanceled && styles.textDetailCanceled) || styles.textDetail} ${
              styles[breakpoint]
            }`}>
            <span
              className={`${(isCanceled && styles.quantityCanceled) || styles.quantity} ${
                styles[breakpoint]
              }`}>
              {quantity} pza{quantity > 1 ? 's' : ''}
            </span>
            <div
              className={`${(isCanceled && styles.subtotalTextCanceled) || styles.subtotalText} ${
                styles[breakpoint]
              }`}>
              {(isCanceled && (
                <Link to={`./order-canceled/${orderId}/${folio}`}>
                  <span>{folio}</span>
                </Link>
              )) || (
                <span className={styles.textBlack}>
                  ${currency((sellingPrice / 100) * quantity)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {orderStatus.index === 5 && (
        <div className={`${styles.trackingProduct} ${styles[breakpoint]}`}>
          <div className={`${styles.delivered} ${styles[breakpoint]}`}>
            <div className={`${(folio && styles.circleCancel) || styles.circle}`}>
              <span className={`${(folio && styles.sendGray) || styles.send}`}>Enviado</span>
            </div>
            <div
              className={`${(folio && styles.lineCanceled) || styles.line} ${styles[breakpoint]}`}
            />
            <div
              className={`${(folio && styles.circle2Canceled) || styles.circle2} ${
                styles[breakpoint]
              }`}>
              {(folio && (
                <span className={`${(folio && styles.sendGray) || styles.send}`}>En proceso</span>
              )) || <span>Entregado</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
