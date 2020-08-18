import React, { useState, useContext } from 'react';
import { Context } from '../../providers/account';
import styles from './index.module.sass';
import EditAddress from '../EditAddress';
//import Icon from 'elektra-iconos';

const AddressBox = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const {
    postalCode,
    addressName,
    city,
    neighborhood,
    number,
    street,
    //isFavorite,
    //beforeFav
  } = props;
  const id = addressName || '';
  const { actions, state } = useContext(Context);
  const __states = state.__states;
  const breakpoint = __states.breakpoint;

  return (
    <div id={styles.AddressDisplayUnit} className={styles[breakpoint]}>
      {/*<div className={styles.addressFavorite}>
        <div className={styles.favoriteIcon}>
          <Icon icon={(isFavorite && 'favorite') || 'favoriteOutline'} width="15" height="15" />
          {(isFavorite && (<span className={styles.favorite}>Dirección favorita</span>)) || null}
        </div>
      </div>*/}
      <div className={styles.ContentAdress}>
        <p>
          <span>{street.toUpperCase()} </span>
          <span>{number.toUpperCase()} </span>
        </p>
        <p>
          <span>{neighborhood.toUpperCase()} </span>
        </p>
        <p>
          <span> C.P.: {postalCode.toUpperCase()} -</span>
        </p>
        <p>
          <span>{city.toUpperCase()} -</span>
        </p>
      </div>
      <div className={styles.editar_boton}>
        <span
          className={styles.link}
          onClick={() => {
            setShowPopup(true);
          }}>
          Editar
        </span>

        <span
          className={styles.link}
          onClick={() => {
            const data = {
              address: {
                id: addressName
              }
            };
            if (!id) return;
            actions.deleteAddress(data.address.id);
          }}>
          Eliminar{' '}
        </span>
      </div>

      {/*isFavorite === false || isFavorite === undefined ? (
        <span
          className={styles.linkFavorite}
          onClick={() => {
            const exFavorite = beforeFav.find((idF) => idF != null);
            const ids = [addressName, exFavorite];
            if (!id) return;
            actions.updateFavorite(ids);
          }}>
          Establecer como Favorita{' '}
        </span>
      ) : null*/}

      {showPopup && <EditAddress {...props} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default AddressBox;
