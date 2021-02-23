import { combineReducers } from "redux";
import postsReducer from './postsReducer'
import commentsReducer from './commentsReducer'



export default combineReducers({
    post: postsReducer,
    comment: commentsReducer
})