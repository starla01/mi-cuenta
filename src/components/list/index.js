import React, { useContext } from 'react';
import styles from './index.module.sass';
import Items from '../../components/items/';
import { Link } from 'react-router-dom';
import { Context } from '../../providers/account';
import { currency, format, amount, getStatus } from '../../misc/';
import { ReactComponent as Tag } from '../../components/icons/tag.svg';
import { ReactComponent as Cash } from '../../components/icons/cash.svg';
import { ReactComponent as Calendar } from '../../components/icons/calendar.svg';

const List = (props) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone';
  const { date, item, orderNumber, order, total, seller } = props;
  const orderStatus = getStatus(order.status, order.packageAttachment);
  const time = new Date(date);
  const creationDate = format('DD de MM de YYYY', time, true);

  const elementsItem = item.map((items, index) => {
    return (
      <Items
        key={index}
        itemIndex={index}
        urlimg={items.imageUrl}
        urlproduct={items.detailUrl}
        price={items.price}
        qty={items.quantity}
        listPrice={items.listPrice}
        sellingPrice={items.sellingPrice}
        productName={items.name}
        package={order.packageAttachment}
        items={order.items}
        order={order}
        sellers={items.seller}
        deliveryEnd={items.deliveryEnd}
        deliveryStart={items.deliveryStart}
        orderStatus={orderStatus}
      />
    );
  });
  return (
    <section className={`${styles.containerOrders} ${styles[breakpoint]}`}>
      {!isMobile && (
        <div className={`${styles.containerTop} ${styles[breakpoint]}`}>
          <div className={styles.orderNumber}>
            <div>No. {orderNumber}</div>
          </div>
          <div
            className={`${
              orderStatus.index === 6 ? styles.wrapperOrderCancel : styles.wrapperOrder
            }  ${styles[breakpoint]}`}>
            <div className={styles.labelShipment}>
              <div
                className={`${
                  orderStatus.index === 6 ? styles.labelStatusCancel : styles.labelStatus
                }`}>
                {orderStatus.text}
              </div>
            </div>
            <Link to={`./order-detail?order=${orderNumber}`}>
              <div className={styles.buttonOrderDetail}>Ver detalle del pedido</div>
            </Link>
          </div>
        </div>
      )}
      {isMobile && (
        <div className={styles.wrapperStatusMb}>
          <div className={`${styles.order} ${styles[breakpoint]}`}>
            <div className={styles.number}>No. {orderNumber}</div>
            <div
              className={`${
                orderStatus.index === 6 ? styles.labelStatusCancel : styles.labelStatus
              }`}>
              {orderStatus.text}
            </div>
            <Link to={`./order-detail?order=${orderNumber}`}>
              <div className={styles.wrapperButonMb}>
                <div className={styles.buttonOrderDetailMb}>Ver detalle del pedido</div>
              </div>
            </Link>
          </div>
          <div className={styles.totals}>
            <div className={styles.descriptionMb}>
              <div>Vendido y enviado por:</div>
              <span className={styles.decoration}>{seller[0].name}</span>
            </div>
            <div className={styles.descriptionMb}>
              <div>Fecha de pedido:</div>
              <span>{creationDate}</span>
            </div>
            <div className={styles.descriptionMb}>
              <div>Total:</div>
              <span>{`$ ${currency(amount(total))}`}</span>
            </div>
          </div>
        </div>
      )}
      <div className={styles.containerBottom}>
        {!isMobile && (
          <div className={styles.summary}>
            <div className={styles.description}>
              <div className={styles.wrapperSvg}>
                <Tag width="23" height="23" />
              </div>
              <div className={styles.information}>
                <div>Vendido y enviado por:</div>
                <div className={styles.thick}>
                  <span>{seller[0].name}</span>
                </div>
              </div>
            </div>
            <div className={styles.description}>
              <div className={styles.wrapperSvg}>
                <Calendar width="15" height="15" />
              </div>
              <div className={styles.information}>
                <div>Fecha de pedido:</div>
                <div className={styles.thick}>{creationDate}</div>
              </div>
            </div>
            <div className={styles.description}>
              <div className={styles.wrapperSvg}>
                <Cash width="22" height="22" />
              </div>
              <div className={styles.information}>
                <div>Total:</div>
                <div className={styles.thick}>{`$ ${currency(amount(total))}`}</div>
              </div>
            </div>
          </div>
        )}
        <div className={`${styles.products} ${styles[breakpoint]}`}>{elementsItem}</div>
      </div>
    </section>
  );
};

export default List;
