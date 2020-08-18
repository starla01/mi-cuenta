import queryString from 'query-string';
import { fetchGraph, orderForm, format } from '../../misc';

const { setOrderForm } = orderForm;

const fetchSelfService = (id, transactionId = '') => {
  return fetchGraph({
    query: `query selfService($id: String, $transactionId: String) {
      viewer {
        hitch(transactionId: $transactionId) {
          expired
          rap
          amount
          term
          weeklyPayment
        }
        selfService(id: $id) {
          causes {
            id
            name
          }
          productsCancel{
            folioCancelation
            cancellable
            productId
          }
          isTotalCancelation
        }
      }
    }`,
    variables: { id, transactionId }
  }).catch(console.trace);
};

function fetchOrder({ orderId }) {
  return fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT_V2, {
    mode: 'cors',
    method: 'POST',
    credentials: 'omit',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      query: `query getOrder($orderId: String) {
        viewer {
          order(orderId: $orderId) {
            orderId
            products(formatDate: "DD MMMM") {
              deliveryEnd
              deliveryStart
              productId
              name
            }
          }
        }
      }`,
      variables: { orderId }
    })
  }).then((r) => r.json());
}

export default (dispatch, state) => ({
  getOrders: () => {
    const params = queryString.parse(window.location.search) || {};
    fetch(`/api/oms/user/orders?per_page=5&page=${params.page || 0}`, { credentials: 'include' })
      .then((res) => res.json())
      .then(({ paging = {}, list = [] }) => {
        // create fetchers
        const fetchedOrders = list.map(({ orderId }) => {
          return fetch(`/api/oms/user/orders/${orderId}`, {
            credentials: 'include'
          }).then((response) => response.json());
        });

        const fetchOrderTimes = list.map(fetchOrder);

        // fetching all orders
        return Promise.all(fetchedOrders)
          .then((shippments) => {
            return Promise.all(fetchOrderTimes)
              .then((orderTimes) => {
                const orders = orderTimes.map(({ data }) => {
                  const { orderId, products } = data.viewer.order;
                  return { orderId, products };
                });
                shippments = shippments.map((shippment) => {
                  const { products = [] } = orders.find(
                    ({ orderId }) => orderId === shippment.orderId
                  );

                  const items = shippment.items.map((item) => {
                    const { deliveryEnd, deliveryStart } = products.find(
                      ({ productId }) => productId === item.productId
                    );

                    return {
                      ...item,
                      deliveryEnd,
                      deliveryStart
                    };
                  });

                  return { ...shippment, items };
                });
                dispatch({ type: 'SET_ORDERS_LIST', payload: { shippments, paging } });
              })
              .catch((error) => {
                console.trace(error);
                dispatch({ type: 'SET_ORDERS_LIST', payload: { shippments, paging } });
              });
          })
          .catch((error) => {
            console.trace(error);
          });
      });
  },
  reloadOrders: () => {
    dispatch({ type: 'RELOAD_ORDERS' });
  },
  getOrderDetail: (orderId) => {
    fetch(`/api/oms/user/orders/${orderId}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((order) => {
        const [{ transactionId = null }] = order.paymentData.transactions;
        fetchSelfService(orderId, transactionId).then((response = {}) => {
          const { selfService = {}, hitch = {} } = response.data.viewer;
          fetchOrder({ orderId })
            .then((orderTime) => {
              order = {
                ...order,
                items: order.items.map((item) => {
                  const { deliveryStart, deliveryEnd } = orderTime.data.viewer.order.products.find(
                    ({ productId }) => productId === item.productId
                  );
                  return {
                    ...item,
                    deliveryStart,
                    deliveryEnd
                  };
                })
              };
              dispatch({ type: 'GET_ORDER_DETAIL', payload: { ...order, selfService, hitch } });
            })
            .catch((error) => {
              console.trace(error);
              dispatch({ type: 'GET_ORDER_DETAIL', payload: { ...order, selfService, hitch } });
            });
        });
      });
  },
  sendAttachment: (orderId, attachmentID, attachmentData) => {
    return setOrderForm(orderId, attachmentID, attachmentData).then((order) => {
      dispatch({ type: 'SET_ORDER_FORM', payload: order });
      return order;
    });
  },
  pushAddress: (address, message) => {
    dispatch({
      type: 'PUSH_ADDRESS',
      payload: address
    });
    dispatch({ type: 'NEWMESSAGE', payload: message });
    const autInterval = setInterval(() => {
      clearInterval(autInterval);
      dispatch({ type: 'CLEAR_MESSAGE' });
    }, 1500);
  },
  setSelectedAddress: (selectedAddress, message) => {
    dispatch({
      type: 'SET_SELECTED_ADDRESS',
      payload: selectedAddress
    });
    dispatch({ type: 'EDIT_MESSAGE', payload: message });
    const autInterval = setInterval(() => {
      clearInterval(autInterval);
      dispatch({ type: 'CLEAR_MESSAGE' });
    }, 1500);
  },
  getDeliveryType: (order, avoidWaiting) => {
    const _order = order || state;
    const orderId = _order.orderFormId;
    let availableAddresses, selectedAddress;

    try {
      availableAddresses = _order.shippingData.availableAddresses || [];
      selectedAddress = _order.shippingData.address;
    } catch (e) {
      availableAddresses = [];
    }

    const ids = availableAddresses.map((address) => address.addressId);
    if (!ids.length) {
      return dispatch({ type: 'FETCHING_SHIPPING_DATA', payload: true });
    }
    dispatch({ type: 'FETCHING_SHIPPING_DATA', payload: !!avoidWaiting });
    return fetchGraph({
      query: `query addresses ($ids: [String]){
        viewer {
          addressList(ids: $ids) {
            id
            type
            openTextField
            isFavorite
          }
        }
      }`,
      variables: { ids }
    }).then((res) => {
      const selectedDeliveryType = localStorage.ektDeliveryType;
      const isShipping = selectedDeliveryType === 'SHIPPING';
      let newSelectedAddress = null;
      let addresses = [];

      try {
        const types = res.data.viewer.addressList || [];
        availableAddresses
          .forEach((address) => {
            const ektDeliveryType = types.find((type) => type.id === address.addressId);
            if (ektDeliveryType) {
              const { type, openTextField, isFavorite } = ektDeliveryType;
              const newAddress = { ...address, type, openTextField, isFavorite };
              if (
                selectedAddress.addressId === address.addressId &&
                type === selectedDeliveryType
              ) {
                newSelectedAddress = newAddress;
                if (
                  isShipping &&
                  (!_order.openTextField || (_order.openTextField && _order.openTextField.value))
                ) {
                  setOrderForm(orderId, 'openTextField', {});
                } else if (!isShipping && openTextField) {
                  setOrderForm(orderId, 'openTextField', {
                    value: openTextField
                  });
                }
              }
              addresses.push(newAddress);
            }
          })
          .then((message) => {
            dispatch({ type: 'MESSAGE', payload: message });
            const autInterval = setInterval(() => {
              clearInterval(autInterval);
              dispatch({ type: 'CLEAR_MESSAGE' });
            }, 1500);
          });
      } catch (e) {}
      return dispatch({
        type: 'SET_ADDRESS_TYPES',
        payload: {
          selectedAddress: newSelectedAddress,
          availableAddresses: (addresses || []).sort((a, b) => {
            if (a.addressId > b.addressId) return 1;
            else if (a.addressId < b.addressId) return -1;
            else return 0;
          })
        }
      });
    });
  },
  updateFavorite: (ids) => {
    let type = 'SHIPPING';
    let openTextField = null;
    let isFavorite = false;
    for (let i = 0; i < ids.length; i++) {
      i === 1 ? (isFavorite = false) : (isFavorite = true);
      let id = ids[i];
      fetchGraph({
        query: `mutation saveAddress(
          $id: String
          $type: String
          $openTextField: String
          $isFavorite:Boolean
        ) {
          address(id: $id, type: $type, openTextField: $openTextField, isFavorite:$isFavorite) {
            id
            type
            openTextField
            isFavorite
          }
        }`,
        variables: { id, type, openTextField, isFavorite }
      });
    }
    dispatch({
      type: 'UPDATE_FAVORITE_ADDRESS',
      payload: ids
    });
  },

  deleteAddress: (addressName) => {
    fetch(`/no-cache/account/address/delete/${addressName}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: null
    })
      .then((address) => {
        fetchGraph({
          query: `mutation  (
              $id: String
              $type: String
              $openTextField: String
            ) {
              address(id: $id, type: $type, openTextField: $openTextField) {
                id
                type
                openTextField
              }
            }`,
          variables: { id: addressName }
        });
      })
      .then((availableAddresses) => {
        return dispatch({
          type: 'REMOVE_ADDRESS',
          payload: addressName
        });
      })
      .then((message) => {
        dispatch({ type: 'DELETE_ADDRESS', payload: message });
        const autInterval = setInterval(() => {
          clearInterval(autInterval);
          dispatch({ type: 'CLEAR_MESSAGE' });
        }, 1500);
      });
  },
  sendProfile: (datastream, orderId, message) => {
    const { firstName, lastName, email, phone } = datastream;
    setOrderForm(orderId, 'clientProfileData', { firstName, lastName, email, phone }).then(
      (orderForm) => {
        dispatch({ type: 'DATA_PROFILE', payload: orderForm });
        dispatch({ type: 'MESSAGE', payload: message });
        const autInterval = setInterval(() => {
          clearInterval(autInterval);
          dispatch({ type: 'CLEAR_MESSAGE' });
        }, 1500);
      }
    );
  },
  setBreakpoint: (breakpoint) => {
    dispatch({ type: 'SET_BREAKPOINT', payload: breakpoint });
  },
  closeModal: () => {
    dispatch({ type: 'SHOW_SERVICE_ERROR', payload: false });
  },
  cancelationOrder: (data) => {
    const { orderId, items, aplyMtcn = false, fields } = data;
    const { comments = '', cause, mtcnName = '', mtcnBirthday = '' } = fields;
    const stringDate = mtcnBirthday.toString();
    const time = new Date(stringDate);
    return fetchGraph({
      query: `mutation selfServiceCancelations($comments: String, $cause: String, $mtcnName: String, $mtcnBirthday: String, $orderId: String, $aplyMtcn: Boolean, $items: [String]) {
          selfService(comments: $comments, cause: $cause, mtcnName: $mtcnName, mtcnBirthday: $mtcnBirthday, orderId: $orderId, aplyMtcn: $aplyMtcn, items: $items) {
            cancelation{
              id
              description
            }
          }
        }`,
      variables: JSON.stringify({
        comments,
        cause,
        mtcnName,
        mtcnBirthday: format('YYYY-MM-DD', time, false),
        orderId,
        aplyMtcn,
        items
      })
    });
  },
  getCauses: (id) => {
    fetchSelfService(id).then((selfService) => {
      return dispatch({ type: 'CAUSES', payload: selfService });
    });
  }
});
