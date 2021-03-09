import Axios from '../api/Axios';
import { SEARCH_POSTS, SEARCH_USERS } from './types';



export const searchPosts = (params) => async dispatch => {
    const res = await Axios.get(`/posts/search`, { params });
    dispatch({
        type: SEARCH_POSTS,
        payload: res.data.data
    })
}
export const searchUsers = (params) => async dispatch => {
    const res = await Axios.get(`/users/search`, { params });
    dispatch({
        type: SEARCH_USERS,
        payload: res.data.data
    })
}