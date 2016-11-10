import { createStore, applyMiddleware, compose } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from '../reducers/index';
import authMiddleware from '../middleware/authMiddleware';
import apiRequestMiddleware from '../middleware/apiRequestMiddleware';
import apiResponseMiddleware from '../middleware/apiResponseMiddleware';

/**
 * Creates a redux store with middleware and reducers using an initial state
 * @param  {object} initialState - Initial state for the store
 * @return {object} store - The created store
 */
export default function configureStore(initialState) {
  const store = compose(
    applyMiddleware(
      thunk,
      authMiddleware,
      apiRequestMiddleware,
      apiMiddleware,
      apiResponseMiddleware,
      createLogger()
    )
  )(createStore);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer);
    });
  }

  return store(reducer, initialState);
}
