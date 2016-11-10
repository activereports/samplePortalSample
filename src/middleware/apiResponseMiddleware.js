import { camelizeKeys } from 'humps';
import { showNotification } from '../actions/NotificationActionCreators';

const apiResponseMiddleware = store => next => action => {
  const payload = action.payload;
  const type = action.type;

  // Camelize response data
  if (type && payload) {
    Object.assign(action, {
      payload: camelizeKeys(payload, (key, convert) =>
        // Do not convert names starting with underscore
        key.charAt(0) === '_' ? `_${convert(key)}` : convert(key)
      ),
    });
  }

  // Handle ApiErrors
  if (payload && payload.constructor.name === 'ApiError') {
    if (payload.status >= 500 && payload.status < 600) {
      if (action.error) {
        store.dispatch(showNotification({
          message: payload.message || '',
          description: payload.response && payload.response.Error || '',
        }));
      }
    }
  }

  return next(action);
};

export default apiResponseMiddleware;
