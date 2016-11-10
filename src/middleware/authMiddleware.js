import { CALL_API } from 'redux-api-middleware';

const authMiddleware = ({ getState }) => next => action => {
  const token = getState().auth.token;

  // Add AuthToken header
  if (action[CALL_API] && token) {
    const callApiAction = action[CALL_API];
    Object.assign(
      callApiAction, {
        headers: {
          AuthToken: token,
          ...callApiAction.headers,
        },
      }
    );
  }

  return next(action);
};

export default authMiddleware;
