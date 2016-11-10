import { CALL_API } from 'redux-api-middleware';
import { pascalizeKeys } from 'humps';

const apiRequestMiddleware = () => next => action => {
  const callApiAction = action[CALL_API];

  if (callApiAction) {
    // Add AJAX header
    callApiAction.headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      ...callApiAction.headers,
    };

    // Transform body to JSON string
    const { body } = callApiAction;
    if (body && typeof body !== 'string') {
      callApiAction.body = JSON.stringify(pascalizeKeys(body));
    }
  }

  return next(action);
};

export default apiRequestMiddleware;
