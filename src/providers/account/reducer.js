export default (state, action) => {
  switch (action.type) {
    case 'SET_BREAKPOINT':
      return {
        ...state,
        __states: { ...state.__states, breakpoint: action.payload }
      };
    case 'MESSAGE':
      return {
        ...state,
        __states: { ...state.__states, ...action.payload, message: { active: true } }
      };
    case 'NEWMESSAGE':
      return {
        ...state,
        __states: { ...state.__states, ...action.payload, messageAddress: { active: true } }
      };
    case 'EDIT_MESSAGE':
      return {
        ...state,
        __states: { ...state.__states, ...action.payload, editAddress: { active: true } }
      };
    case 'DELETE_ADDRESS':
      return {
        ...state,
        __states: { ...state.__states, ...action.payload, deleteAddress: { active: true } }
      };
    case 'CLEAR_MESSAGE':
      return {
        ...state,
        __states: {
          ...state.__states,
          ...action.payload,
          message: { active: false },
          messageAddress: { active: false },
          editAddress: { active: false },
          deleteAddress: { active: false }
        }
      };
    case 'DATA_PROFILE':
      const { clientProfileData } = action.payload;
      return {
        ...state,
        clientProfileData,
        __states: { ...state.__states, fetchCompletedUser: true }
      };
    case 'SET_INITIAL_DATASESSION':
      const { loggedIn } = action.payload;
      return {
        ...state,
        loggedIn,
        __states: { ...state.__states, fetchCompleted: true }
      };
    case 'SET_ORDERS_LIST':
      return {
        ...state,
        pages: action.payload.paging,
        shippments: action.payload.shippments,
        __states: { ...state.__states, fetchCompletedOrders: true }
      };
    case 'RELOAD_ORDERS':
      return {
        ...state,
        shippments: null,
        __states: { ...state.__states, fetchCompletedOrders: false }
      };
    case 'GET_ORDER_DETAIL':
      const canceledProducts = action.payload.selfService.productsCancel.map(
        ({ productId }) => productId
      );
      const order = {
        ...action.payload,
        items: action.payload.items.map((item) => {
          const indexCancel = canceledProducts.indexOf(item.productId);
          const isCanceled = indexCancel > -1;
          const folio =
            (isCanceled &&
              action.payload.selfService.productsCancel[indexCancel]['folioCancelation']) ||
            '';
          const { isTotalCancelation } = action.payload.selfService || null;
          return { ...item, isCanceled, folio, isTotalCancelation };
        })
      };
      const isPartialCancelation = (action.payload.shippingData.selectedAddresses || []).every(
        ({ addressType }) => addressType === 'residential'
      );
      return { ...state, order, isPartialCancelation };
    case 'GET_ORDER_LIST':
      return { ...state, orderList: action.payload.list };
    case 'GET_ADDRESS':
      return { ...state, availableAddresses: action.payload };
    case 'SET_ADDRESS_TYPES':
      return {
        ...state,
        __states: { ...state.__states, ...action.payload, shippingDataFetched: true }
      };
    case 'FETCHING_SHIPPING_DATA':
      return {
        ...state,
        __states: { ...state.__states, shippingDataFetched: action.payload }
      };
    case 'SET_ORDER_FORM': {
      const order = action.payload;
      const __states = {
        ...state.__states,
        completedFetch: true,
        fetchCompleted: true
      };
      return {
        ...state,
        ...order,
        __states
      };
    }
    case 'CAUSES':
      const { selfService } = action.payload.data.viewer;
      const __states = {
        ...state.__states,
        fecthCauses: true
      };
      return {
        ...state,
        selfService,
        __states
      };
    case 'PUSH_ADDRESS':
      const address = action.payload;
      return {
        ...state,
        __states: {
          ...state.__states,
          ...action.payload,
          selectedAddress: address,
          availableAddresses: [...state.__states.availableAddresses, address],
          shippingDataFetched: true,
          messageAddres: { active: true }
        }
      };
    case 'SET_SELECTED_ADDRESS': {
      const address = action.payload;
      const availableAddresses = state.__states.availableAddresses.map((el) => {
        if (el.addressId === address.addressId) return address;
        else return el;
      });
      return {
        ...state,
        __states: {
          ...state.__states,
          availableAddresses,
          selectedAddress: address,
          shippingDataFetched: true
        }
      };
    }
    case 'REMOVE_ADDRESS': {
      const address = action.payload;
      let data = [...state.__states.availableAddresses];
      const result = data.filter((data) => data.addressId !== action.payload);
      return {
        ...state,
        __states: {
          ...state.__states,
          ...action.payload,
          selectedAddress: address,
          availableAddresses: result,
          shippingDataFetched: true
        }
      };
    }
    case 'UPDATE_FAVORITE_ADDRESS': {
      const ids = action.payload;
      const availableAddresses = state.__states.availableAddresses.map((el) => {
        if (el.addressId === ids[0] ? (el.isFavorite = true) : (el.isFavorite = false)) return el;
        else return el;
      });
      return {
        ...state,
        __states: {
          ...state.__states,
          availableAddresses,
          selectedAddress: address,
          shippingDataFetched: true
        }
      };
    }
    case 'UPDATE_CANCELATION_DATA': {
      const cancelation = action.payload;
      return {
        ...state,
        cancelation: { cancelation }
      };
    }
    case 'SHOW_SERVICE_ERROR':
      return {
        ...state,
        __states: { ...state.__states, showServiceError: action.payload }
      };
    default:
      return state;
  }
};
