import React, { useContext, useEffect } from 'react';
import styles from './index.module.sass';
import { ReactComponent as Close } from '../../components/icons/blocked.svg';
import { Context } from '../../providers/account';
import TextContent from '../../components/TextContent';

const CancellationNotAllowed = (props) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  const orderId = props.order;

  useEffect(() => {
    const cancelOnScapeKey = (e) => (e.key === 'Escape' && props.onClose()) || null;
    window.addEventListener('keyup', cancelOnScapeKey);
    return () => {
      window.removeEventListener('keyup', cancelOnScapeKey);
    };
  }, []);

  if (!state.__states.showServiceError) return null;

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
                <TextContent isSent={false} />
              </div>
            </div>
            <div className={styles.wrapCancel}>
              <div
                className={styles.cancelPopButtonDemo}
                // Se había enviado el orderId pero este flujo cambiará
                onClick={() => {
                  window.location.href = `./orders?order=${orderId}`;
                  //actions.closeModal();
                }}>
                Cerrar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CancellationNotAllowed;
