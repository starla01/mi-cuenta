import React from 'react';
import Profile from '../../components/profile';
import styles from './index.module.sass';
import Breadcrumb from '../../components/Breadcrumb/';
import { ReactComponent as Line } from '../../components/icons/linea-roja.svg';
import { ReactComponent as Plane } from '../../components/icons/avion.svg';

const OrderCanceled = ({ state, actions, props }) => {
  const urlValue = props.location.pathname.split('/');
  const folioCancelled = urlValue[3];
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  const { firstName = '' } = state.clientProfileData;
  const { email = '' } = state.clientProfileData;
  const order = urlValue[2];

  return (
    <div id={styles.container}>
      {!isMobile && <Profile />}
      <div className={`${styles.containerCancelation} ${styles[breakpoint]}`}>
        <Breadcrumb type="canceled" order={order} />
        <div className={`${styles.orderCanceledBody} ${styles[breakpoint]}`}>
          <div className={`${styles.Cancelation} ${styles[breakpoint]}`}>
            <div className={`${styles.userData} ${styles[breakpoint]}`}>
              <div className={styles.name}>{firstName}</div>
              <div className={styles.description}>
                Tu solicitud de cancelación fue enviada, tu folio de seguimiento es:
              </div>
              <div className={`${styles.cancelId} ${styles[breakpoint]}`}>{folioCancelled}</div>
              <div className={styles.description}>
                Enviaremos la respuesta a <span>{email}</span> en un máximo de 3 horas
              </div>
            </div>
            <div className={`${styles.imageCancelation} ${styles[breakpoint]}`}>
              {isMobile && <Line className={`${styles.line} ${styles[breakpoint]}`} />}
              {!isMobile && <Plane className={`${styles.plane} ${styles[breakpoint]}`} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCanceled;
