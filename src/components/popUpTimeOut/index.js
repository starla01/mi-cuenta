import React, { useContext } from 'react';
import styles from './index.module.sass';
import { ReactComponent as Close } from '../../components/icons/check.svg';
import { Context } from '../../providers/account';

const PopUpTimeOut = (props) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
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
                <h1>¿Deseas cancelar tu pedido?</h1>
                <p className={styles.notificationMoreInfo}>
                  Tenemos los siguientes datos para la cancelación.
                </p>
                <p>
                  <ul>
                    <li>Nombre: Arisbeth Aremi</li>
                    <li>Fecha de nacimiento: 01/03/1987</li>
                    <li>Número de orden: v25567802ekt-01</li>
                  </ul>
                </p>
                <p className={styles.notificationMoreInfo}>
                  Selecciona alguna de las siguientes opciones.
                </p>
              </div>
            </div>
            <div className={styles.wrapCancel}>
              <div
                className={styles.cancelPopButtonDemo}
                onClick={() => {
                  console.log('Reintentar');
                }}>
                Reintentar cancelación
              </div>
              <div
                className={styles.cancelPopButtonDemo}
                onClick={() => {
                  console.log('Editar');
                }}>
                Editar datos para cancelación.
              </div>
              <div
                className={styles.cancelPopButtonDemo}
                onClick={() => {
                  window.location.href = `./orders`;
                }}>
                No cancelar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopUpTimeOut;
