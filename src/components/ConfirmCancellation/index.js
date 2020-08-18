import React, { useContext, useEffect } from 'react';
import styles from './index.module.sass';
import { ReactComponent as Close } from '../../components/icons/close.svg';
import { Context } from '../../providers/account';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';

const ConfirmCancellation = ({ onClose, onConfirmation, isFetched, order }) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  useEffect(() => {
    const cancelOnScapeKey = (e) => (e.key === 'Escape' && onClose()) || null;
    window.addEventListener('keyup', cancelOnScapeKey);
    return () => {
      window.removeEventListener('keyup', cancelOnScapeKey);
    };
  }, []);

  return (
    <section className={styles.wrapperPopUpContainer}>
      <div className={`${styles.containerPopup} ${styles[breakpoint]}`}>
        <div className={styles.headerPop}>
          <span>Confirmar cancelación</span>
          <Close onClick={onClose} />
        </div>

        <div className={`${styles.rowPopup} ${styles[breakpoint]}`}>
          {(isFetched && 'Solicitando cancelación.') ||
            '¿Estás seguro que quieres solicitar la cancelación de tus productos?'}
        </div>

        {(isFetched && <Spinner />) || (
          <div className={`${styles.footerPop} ${styles[breakpoint]}`}>
            <Link to={`./order-detail?order=${order}`}>
              <div
                className={`${styles.cancelPopButton} ${styles.active} ${styles[breakpoint]}`}
                onClick={onClose}>
                No quiero cancelar
              </div>
            </Link>
            <div onClick={onConfirmation} className={`${styles.cancelPopButton} ${styles.acept}`}>
              Si
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConfirmCancellation;
