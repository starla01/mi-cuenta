import React, { createContext, useReducer, useEffect } from 'react';
import reducer from './reducer';
import actions from './actions';
import usedevice from 'usedevice';
import { orderForm } from '../../misc';

const { getOrderForm } = orderForm;

const breakpoints = [
  {
    name: 'largedesktop',
    min: 1150,
    max: Infinity
  },
  {
    name: 'desktop',
    min: 1020,
    max: 1150
  },
  {
    name: 'tablet',
    min: 860,
    max: 1020
  },
  {
    name: 'phone',
    min: 0,
    max: 860
  }
];

export const Context = createContext();

export default (props) => {
  const { breakpoint } = usedevice({ breakpoints });

  const [state, dispatch] = useReducer(reducer, {
    loggedIn: false,
    shippingData: {},
    clientProfileData: {},
    userProfileId: {},
    availableAddresses: [],
    selfService: {},
    cancelation: {},
    __states: {
      breakpoint,
      fetchCompleted: false,
      fetchCompletedUser: false,
      fetchCompletedOrders: false,
      shippingDataFetched: false,
      completedFetch: false,
      fecthCauses: false,
      message: {
        active: false
      },
      messageAddress: {
        active: false
      },
      editAddress: {
        active: false
      },
      deleteAddress: {
        active: false
      },
      responseError: {
        active: false
      }
    }
  });

  useEffect(() => {
    getOrderForm().then((order) => {
      dispatch({ type: 'SET_ORDER_FORM', payload: order });
      _actions.getDeliveryType(order);
    });
  }, []);

  useEffect(() => {
    dispatch({ type: 'SET_BREAKPOINT', payload: breakpoint });
  }, [breakpoint]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  const _actions = actions(dispatch, state);
  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        actions: _actions
      }}>
      {props.children}
    </Context.Provider>
  );
};
