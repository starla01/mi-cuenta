import React, { useEffect, useState, useContext } from 'react';
import styles from './index.module.sass';
import TextField from '../textField/';
import DropDown from '../dropDown';
import inputMethods from '../../hooks/useInputForm';
import { Context } from '../../providers/account';
import fetchNeighborhoods from './fetchNeighborhoods';
import Button from '../../components/button/';
import { ReactComponent as Close } from '../../components/icons/close.svg';
import saveAddress from './saveAddress';

const { useInputForm, validateData } = inputMethods;

const EditAddress = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const { actions, state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  const id = props.addressName || '';
  const orderId = state.orderFormId;
  const receiverName = useInputForm({
    name: 'receiverName',
    value: props.receiverName || '',
    min: 1,
    max: 91
  });
  const street = useInputForm({
    name: 'street',
    value: props.street || '',
    min: 1,
    max: 26
  });
  const number = useInputForm({
    name: 'number',
    value: props.number || '',
    min: 1,
    max: 5
  });
  const complement = useInputForm({
    name: 'complement',
    value: props.complement || '',
    fieldType: 'OPTIONAL',
    min: 0,
    max: 5
  });
  const postalCode = useInputForm({
    name: 'postalCode',
    value: props.postalCode || '',
    fieldType: 'POSTALCODE'
  });
  const neighborhood = useInputForm({
    name: 'neighborhood',
    value: props.neighborhood || '',
    fieldType: 'Colonia'
  });
  const reference = useInputForm({
    name: 'reference',
    value: props.reference || '',
    fieldType: 'Referencia',
    min: 2,
    max: 36
  });

  const postalCodeValue = postalCode.input.value;
  const [neighborhoods, setNeighborhoods] = useState([]);

  useEffect(
    () => {
      if (postalCodeValue.length === 5) {
        fetchNeighborhoods(postalCodeValue).then((neighborhoods) => {
          setNeighborhoods(neighborhoods);
          if (!neighborhoods.length)
            postalCode.setData((data) => ({
              ...data,
              error: 'Por favor introduce un código postal válido'
            }));
        });
      }
    },
    [postalCodeValue]
  );

  return (
    <section className={styles.wrapperPopUpContainer}>
      <div className={`${styles.containerPopup} ${styles[breakpoint]}`}>
        <div className={styles.headerPop}>
          {(postalCodeValue && !!postalCodeValue.length && (
            <>
              <span> Editar dirección</span>
            </>
          )) || (
              <>
                <span> Agregar nueva dirección de envío</span>
              </>
            )}
          <Close onClick={props.onClose} />
        </div>
        <div className={styles.containerForm}>
          <div className={`${styles.rowPopup} ${styles[breakpoint]}`}>
            <TextField label="Nombre de quien recibe:*" input={receiverName.input} />
          </div>
          <div className={`${styles.rowPopup} ${styles[breakpoint]}`}>
            <TextField label="Calle:*" input={street.input} />
          </div>
          <div className={`${styles.rowPopup} ${styles[breakpoint]} ${styles.mobileTextField}`}>
            <TextField label="Referencia de envío (Ejemplos: Torre B, fachada azul, entre calles...)" input={reference.input} />
          </div>
          <div className={`${styles.rowPopup} ${styles[breakpoint]}`}>
            <TextField label="Numero exterior*" input={number.input} />
            <TextField label="No. interior" input={complement.input} />
            <TextField label="Código postal:*" input={postalCode.input} />
          </div>

          {!!neighborhoods.length && (
            <>
              <div className={`${styles.row} ${styles.full} ${styles[breakpoint]}`}>
                <DropDown label="Colonia *" input={neighborhood.input}>
                  <option value={0}>Selecciona una opción</option>
                  {neighborhoods.map(({ name }, key) => {
                    return (
                      <option value={name} key={key}>
                        {name}
                      </option>
                    );
                  })}
                </DropDown>
              </div>
              <div className={`${styles.rowPopup} ${styles[breakpoint]}`}>
                <TextField
                  label="Municipio / Delegación"
                  input={{
                    id: 'city',
                    name: 'city',
                    value: neighborhoods[0].city,
                    disabled: true
                  }}
                />
                <TextField
                  label="Estado"
                  input={{
                    id: 'state',
                    name: 'state',
                    value: neighborhoods[0].state,
                    disabled: true
                  }}
                />
              </div>
              <div className={styles.radio} />
            </>
          )}
        </div>
        <div className={`${styles.footerPop} ${styles[breakpoint]}`}>
          <div
            className={`${styles.cancelarPopButton} ${styles[breakpoint]}`}
            onClick={props.onClose}>
            Cancelar
          </div>
          <Button
            onClick={() => {
              const form = validateData([
                postalCode,
                street,
                number,
                complement,
                neighborhood,
                receiverName,
                reference
              ]);
              if (!form || !neighborhoods.length) return;
              const data = {
                address: {
                  ...form,
                  city: neighborhoods[0].city,
                  state: neighborhoods[0].state,
                  addressType: 'residential',
                  country: 'MEX',
                  geoCoordinates: [],
                  postalCodeIsValid: true,
                  useGeolocationSearch: false
                },
                clearAddressIfPostalCodeNotFound: true
              };

              if (id) data.address.addressId = id;

              actions.sendAttachment(orderId, 'shippingData', data).then((order) => {
                const addressResponse = order.shippingData.address;
                if (!id || !addressResponse.street) {
                  const addressId = addressResponse.addressId;
                  data.address.addressId = addressId;
                  actions
                    .sendAttachment(orderId, 'shippingData', {
                      ...data,
                      logisticsInfo: order.shippingData.logisticsInfo.map((data) => {
                        return { ...data, selectedSla: 'Envío domicilio' };
                      })
                    })
                    .then((order) => {
                      saveAddress({
                        id: addressId,
                        type: localStorage.ektDeliveryType,
                        openTextField: null
                      }).then(() => {
                        actions.pushAddress({
                          ...data.address,
                          addressId,
                          type: localStorage.ektDeliveryType
                        });
                      });
                    });
                } else {
                  actions.setSelectedAddress({
                    ...data.address,
                    type: localStorage.ektDeliveryType
                  });
                }
                props.onClose();
              });
            }}>
            Guardar
          </Button>
          {showPopup && <EditAddress {...props} onClose={() => setShowPopup(false)} />}
        </div>
      </div>
    </section>
  );
};

export default EditAddress;
