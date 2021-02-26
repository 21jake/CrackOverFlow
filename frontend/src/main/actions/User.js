import Axios from '../api/Axios';
import {
    REGISTER, FETCH_USER_COMMENTS, FETCH_USER_POSTS, FETCH_GUEST, 
    TRIGER_FETCH_USER_ON, TRIGER_FETCH_USER_OFF,
    FETCH_USER_SUGGESTED_POSTS, RESET_USER } from './types';

export const createUser = values => async (dispatch) => {
    const res = await Axios.post('/auth/register', values);
    dispatch({
        type: REGISTER,
        payload: res.data.user
    })
}

export const fetchGuest = (id) =>  async dispatch => {
    const res = await Axios.get(`/users/detail/${id}`);
    dispatch({
        type: FETCH_GUEST,
        payload: res.data.data
    })
}


export const fetchUserPosts = (userId, page) => async dispatch => {
    const res = await Axios.get(`/posts/user/${userId}?page=${page}`);
    dispatch({
        type: FETCH_USER_POSTS,
        payload: res.data.data
    })
}

export const fetchUserComments = userId => async dispatch => {
    const res = await Axios.get(`/comments/user/${userId}`);
    dispatch({
        type: FETCH_USER_COMMENTS,
        payload: res.data.data
    })
}

export const fetchSuggestedPosts = interestedTopics => async dispatch => {
    const res = await Axios.get(`/posts/search?topics=${interestedTopics}`);
    dispatch({
        type: FETCH_USER_SUGGESTED_POSTS,
        payload: res.data.data
    })
}

export const resetUser = () => ({
    type: RESET_USER
});

export const triggerSearchOff = () => ({
    type: TRIGER_FETCH_USER_OFF
});

export const triggerSearchOn = () => ({
    type: TRIGER_FETCH_USER_ON
});
