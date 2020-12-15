// combineReducers  用于对多个reducers进行合并

import { combineReducers } from 'redux'

import notifications from './notifications'

import user from './user'

export default combineReducers({
    notifications,
    user
})