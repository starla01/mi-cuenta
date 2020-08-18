import React, { useEffect, useState } from 'react';
import Profile from '../../components/profile/';
import AddressBox from '../../components/AddressBox';
import styles from './address.sass';
import EditAddress from '../../components/EditAddress';
import Message from '../../components/message';
import { ReactComponent as Location } from '../../components/icons/address-pin.svg';
import { Link } from 'react-router-dom';
import Icon from 'elektra-iconos';
import { ReactComponent as ArrowLeft } from '../../components/icons/arrow-left-slim.svg';

const AddressBoxi = ({ props, state, actions }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    actions.getDeliveryType();
  }, []);

  const states = state.__states;
  const { breakpoint, availableAddresses } = states;
  const newMessage = states.messageAddress.active;
  const editMessage = states.editAddress.active;
  const deleteMessage = states.deleteAddress.active;
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  let exFavorite = [];

  availableAddresses &&
    availableAddresses.filter((item) => {
      let beforeFav = item.isFavorite === true ? item.addressId : null;
      return exFavorite.push(beforeFav);
    });

  const elements =
    availableAddresses &&
    availableAddresses.map((item, index) => {
      return (
        <AddressBox
          key={item.addressId}
          addressName={item.addressId}
          addressType={item.addressType}
          isFavorite={item.isFavorite}
          city={item.city}
          complement={item.complement}
          neighborhood={item.neighborhood}
          number={item.number}
          postalCode={item.postalCode}
          accountId={item.accountId}
          receiverName={item.receiverName}
          accountName={item.accountName}
          reference={item.reference}
          street={item.street}
          state={item.state}
          beforeFav={exFavorite}
        />
      );
    });

  return (
    <div className={styles.container}>
      {isMobile && (
        <Link className={`${styles.title} ${styles.background}`} to={'./orders'}>
          <ArrowLeft className={styles.iconFill} width="28" height="33" />
          <Icon icon="userOutline" className={styles.user} width="25" height="25" />
          <span>Regresar a mis datos</span>
        </Link>
      )}
      {!isMobile && <Profile />}

      <section id={styles.containerList} className={styles[breakpoint]}>
        <div className={`${styles.orders} ${styles[breakpoint]}`}>
          <div className={`${styles.title} ${styles[breakpoint]}`}>
            <Location className={styles.iconFill} width="33" height="33" />
            <span>Mis direcciones</span>
          </div>
          <div className={styles.container}>
            {elements}
            <div
              onClick={() => {
                setShowPopup(true);
              }}
              id={styles.AddressDisplayUnit}
              className={styles[breakpoint]}>
              <div id={styles.iconPlus} className={styles[breakpoint]}>
                +
              </div>
              <div id={styles.addAddress} className={styles[breakpoint]}>
                <p>
                  <span className={styles.links}>Agregar nueva dirección de envío</span>
                </p>
              </div>
            </div>
          </div>

          <div />
        </div>
      </section>

      {showPopup && <EditAddress {...props} onClose={() => setShowPopup(false)} />}
      {newMessage && (
        <Message
          active={true}
          type="success"
          icon="check"
          title={'Tu dirección se agregó con éxito'}
        />
      )}
      {editMessage && (
        <Message
          active={true}
          type="success"
          icon="check"
          title={'Tu dirección fue actualizada con éxito'}
        />
      )}
      {deleteMessage && (
        <Message
          active={true}
          type="success"
          icon="check"
          title={'Tu dirección fue eliminada con éxito'}
        />
      )}
    </div>
  );
};

export default AddressBoxi;
