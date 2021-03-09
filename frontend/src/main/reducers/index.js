import { combineReducers } from "redux";
import postsReducer from './postsReducer'
import commentsReducer from './commentsReducer'
import userReducer from './userReducer'
import searchReducer from './searchReducer'


export default combineReducers({
    post: postsReducer,
    comment: commentsReducer,
    user: userReducer,
    search: searchReducer
})