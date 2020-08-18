import React, { useState } from 'react';
import queryString from 'query-string';
import Profile from '../../components/profile';
import styles from './index.module.sass';
import CancelationOffline from '../../components/CancelationOffline';
import CancellationAlertStatus from '../../components/CancellationAletStatus';
import { getStatus } from '../../misc';

const CancelOrders = ({ state, props }) => {
  const url = queryString.parse(window.location.search);
  const orderId = url.order;
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  const status = getStatus(orderId) || null;
  const valueStatus = status.index;
  const [showNoCancel, setNoCancel] = useState(true);

  return (
    <div id={styles.container}>
      {!isMobile && <Profile />}
      <section className={`${styles.containerCancelation} ${styles[breakpoint]}`}>
        <CancelationOffline history={props.history} orderId={orderId} />
      </section>
      {valueStatus >= 2 && showNoCancel && (
        <CancellationAlertStatus onClose={() => setNoCancel(false)} />
      )}
    </div>
  );
};

export default CancelOrders;
