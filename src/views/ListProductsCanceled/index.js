import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import Profile from '../../components/profile';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/Breadcrumb/';

import { currency } from '../../misc/';
import styles from './index.module.sass';

const ListProductsCanceled = ({ state, actions, props }) => {
  let totalCanceled = 0;
  const breakpoint = state.__states.breakpoint;
  const params = queryString.parse(window.location.search);
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  const [productsToCancel, setProductsToCancel] = useState([]);

  useEffect(() => {
    !state.order && actions.getOrderDetail(params.order);
  }, [params.order]);

  if (!state.order) return <Spinner />;

  const items = state.order.items.filter((item) => !item.isCanceled);
  const itemsCanceled = state.order.items.filter((item) => item.isCanceled);

  const handleSelected = (productId) => {
    const productIndex = productsToCancel.indexOf(productId);
    if (productIndex > -1) {
      productsToCancel.splice(productIndex, 1);
      return setProductsToCancel([...productsToCancel]);
    }
    return setProductsToCancel([...productsToCancel, productId]);
  };

  const handleSelectAll = () => {
    if (productsToCancel.length === items.length) return setProductsToCancel([]);
    const ids = items.map((item) => item.productId);
    return setProductsToCancel(ids);
  };

  const handleSelecPrice = () => {
    state.order.items.forEach((val) => {
      productsToCancel.forEach((sku) => {
        if (val.productId === sku) {
          totalCanceled += val.sellingPrice * parseInt(val.quantity);
        }
      });
    });
    return currency(totalCanceled / 100);
  };

  return (
    <div className={styles.container}>
      {!isMobile && <Profile />}
      <section className={`${styles.containerList} ${styles[breakpoint]}`}>
        <Breadcrumb type="selectProducts" order={params.order} />
        <div className={`${styles[breakpoint]} ${styles.containerItems}`}>
          <div className={`${styles[breakpoint]} ${styles.title}`}>
            <p>Selecciona el Producto que deseas cancelar</p>
            <div className={`${styles[breakpoint]} ${styles.selectAll}`}>
              <span className={styles.select}>Seleccionar todo</span>
              <input
                className={styles.cssinput}
                type="checkbox"
                id="checkAllProducts"
                name="checkAllProducts"
                checked={productsToCancel.length === items.length}
                onChange={() => handleSelectAll()}
              />
            </div>
          </div>
          {items.map(
            ({ id, imageUrl, detailUrl, name, quantity, sellingPrice, price, productId }) => {
              // TODO: mover a un componente y homologar en detalle y listado de cancelacion
              return (
                <div key={id} className={styles.item}>
                  <div className={`${styles[breakpoint]} ${styles.productDetail}`}>
                    <div>
                      <img src={imageUrl} alt={name} />
                    </div>
                    <div className={`${styles.description} ${styles[breakpoint]}`}>
                      <div className={`${styles.productName} ${styles[breakpoint]}`}>
                        <a href={detailUrl}>{name}</a>
                      </div>
                      <div className={`${styles.textDetail} ${styles[breakpoint]} `}>
                        <div className={`${styles[breakpoint]} ${styles.quantity}`}>
                          <span>
                            {quantity} pza{quantity > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className={`${styles.subtotal} ${styles[breakpoint]}`}>
                          Subtotal:
                          <span className={styles.selling}>
                            ${currency((sellingPrice / 100) * quantity)}
                          </span>
                        </div>
                        <div className={`${styles[breakpoint]} ${styles.checkBox}`}>
                          <input
                            className={styles.cssinput}
                            type="checkbox"
                            id="checkProduct"
                            name="checkProduct"
                            value={productId || ''}
                            onChange={() => handleSelected(productId)}
                            checked={productsToCancel.includes(productId)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
        {isMobile && (
          <div className={`${styles.priceSelectproducts} ${styles[breakpoint]}`}>
            Total a rembolsar: <span> $ {handleSelecPrice()}</span>
          </div>
        )}
        <div className={styles.wrapperButtons}>
          <Link to={`./order-detail?order=${params.order}`}>
            <div className={`${styles.disagreeButton} ${styles[breakpoint]}`}>
              No quiero cancelar
            </div>
          </Link>
          {!isMobile && (
            <div className={styles.priceSelectproducts}>
              Total a rembolsar: <span> $ {handleSelecPrice()}</span>
            </div>
          )}
          <Link
            className={`${(productsToCancel.length && styles.agreeButton) ||
              styles.agreeButtonDisable}  ${styles[breakpoint]}`}
            to={`/cancelar-mi-pedido?${queryString.stringify({
              ...params,
              items: productsToCancel
            })}`}>
            Siguiente
          </Link>
        </div>
        {!!itemsCanceled.length && (
          <div className={`${styles.cancelItems} ${styles[breakpoint]}`}>
            Solicitud de cancelación
          </div>
        )}

        <div className={`${styles[breakpoint]} ${styles.containerItems}`}>
          {itemsCanceled.map(
            ({
              id,
              imageUrl,
              detailUrl,
              name,
              quantity,
              price,
              productId,
              sellingPrice,
              folio
            }) => {
              // TODO: mover a un componente y homologar en detalle y listado de cancelacion
              return (
                <div key={id} className={styles.item}>
                  <div className={`${styles[breakpoint]} ${styles.productDetail}`}>
                    <div>
                      <img src={imageUrl} alt={name} />
                    </div>
                    <div className={styles.description}>
                      <div className={styles.productName}>
                        <a href={detailUrl}>{name}</a>
                      </div>
                      <div className={`${styles.textDetail} ${styles[breakpoint]} `}>
                        <div className={`${styles[breakpoint]} ${styles.quantity}`}>
                          <span>
                            {quantity} pza{quantity > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className={`${styles.subtotal} ${styles[breakpoint]}`}>
                          <span className={styles.selling}>
                            ${currency((sellingPrice / 100) * quantity)}
                          </span>
                        </div>
                        <div className={`${styles[breakpoint]} ${styles.checkBox}`}>
                          {(folio && <div>{folio}</div>) || (
                            <input
                              type="checkbox"
                              id="checkProduct"
                              name="checkProduct"
                              value={productId || ''}
                              onChange={() => handleSelected(productId)}
                              checked={productsToCancel.includes(productId)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
};

export default ListProductsCanceled;
