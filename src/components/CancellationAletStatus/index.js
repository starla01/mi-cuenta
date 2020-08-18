import React, { useContext, useEffect } from 'react';
import styles from './index.module.sass';
import { ReactComponent as Close } from '../../components/icons/blocked.svg';
import { Context } from '../../providers/account';
import TextContent from '../../components/TextContent';

const CancellationAlertStatus = (props) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;

  useEffect(() => {
    const cancelOnScapeKey = (e) => (e.key === 'Escape' && props.onClose()) || null;
    window.addEventListener('keyup', cancelOnScapeKey);
    return () => {
      window.removeEventListener('keyup', cancelOnScapeKey);
    };
  }, []);

  return (
    <section className={styles.wrapperPopUpNoCancellContainer}>
      <div className={`${styles.containerPopupNoCancel} ${styles[breakpoint]}`}>
        <div className={styles.top} />
        <div className={styles.downTop}>
          <div className={styles.left}>
            <div className={styles.leftBlock}>
              <Close />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rowPopup}>
              <div className={`${styles.popupTextBox} ${styles[breakpoint]}`}>
                <h1>
                  No se ha podido realizar la cancelación <br />
                  del pedido.
                </h1>
                <TextContent isSent={true} />
              </div>
            </div>
            <div className={styles.wrapCancel}>
              <div className={styles.cancelPopButtonDemo} onClick={props.onClose}>
                Cerrar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CancellationAlertStatus;
