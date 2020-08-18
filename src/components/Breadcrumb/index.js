import React, { useContext } from 'react';
import styles from './index.module.sass';
import { Context } from '../../providers/account';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../icons/arrow-left-slim.svg';
import { ReactComponent as Shippings } from '../icons/my-shippings.svg';

const Breadcrumb = (props) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  const statusCanceled = props.type;
  const isMobile = breakpoint === 'phone';

  return (
    <section>
      <div className={styles.backorder}>
        <Link className={styles.title} to={'/orders'}>
          <ArrowLeft className={styles.iconFill} width="28" height="33" />
          <Shippings className={styles.iconFill} width="33" height="33" />
          <span>Regresar a mis pedidos</span>
        </Link>
        {!isMobile && statusCanceled !== 'canceled' && (
          <div className={styles.title}>
            <ArrowLeft className={styles.iconFill} width="28" height="33" />
            <Link to={`./order-detail?order=${props.order}`}>
              <span>Cancelación</span>
            </Link>
          </div>
        )}
      </div>
      <div className={`${styles.titleBreadcrumb} ${styles[breakpoint]}`}>
        Solicitud de Cancelación
      </div>
      <div className={styles.breadcrumb}>
        <div>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'selectProducts' ||
              statusCanceled === 'canceled') &&
              styles.dotActive) ||
              styles.dot}`}
          />
        </div>
        <div
          className={`${((statusCanceled === 'startCancelation' || statusCanceled === 'canceled') &&
            styles.lineActive) ||
            styles.line} ${styles[breakpoint]}`}>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'selectProducts' ||
              statusCanceled === 'canceled') &&
              styles.labelActive) ||
              styles.label} ${styles[breakpoint]}`}>
            Selecciona
          </div>
        </div>
        <div>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'canceled') &&
              styles.dotActive) ||
              styles.dot}`}
          />
        </div>
        <div
          className={`${statusCanceled === 'canceled' ? styles.lineActive : styles.line} ${
            styles[breakpoint]
          }`}>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'canceled') &&
              styles.labelActive) ||
              styles.label} ${styles[breakpoint]}`}>
            Motivo de cancelación
          </div>
          <div
            className={`${(statusCanceled === 'canceled' && styles.labelEndActive) ||
              styles.labelEnd} ${styles[breakpoint]}`}>
            Cancelación enviada
          </div>
        </div>
        <div>
          <div className={(statusCanceled === 'canceled' && styles.dotActive) || styles.dot} />
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
