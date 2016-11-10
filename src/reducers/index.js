import { combineReducers } from 'redux';
import auth from './auth';
import document from './document';
import notification from './notification';
import parameters from './parameters';
import permissions from './permissions';
import schedule from './schedule';
import tags from './tags';
import ui from './ui';
import user from './user';
import viewer from './viewer';

const rootReducer = combineReducers({
  auth,
  document,
  notification,
  parameters,
  permissions,
  schedule,
  tags,
  ui,
  user,
  viewer,
});

export default rootReducer;
