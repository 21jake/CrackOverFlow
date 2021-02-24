import { combineReducers } from "redux";
import postsReducer from './postsReducer'
import commentsReducer from './commentsReducer'
import userReducer from './userReducer'

export default combineReducers({
    post: postsReducer,
    comment: commentsReducer,
    user: userReducer
})