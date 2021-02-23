import Axios from '../api/Axios';
import {
    CREATE_POST, RESET_POST,
    FETCH_POSTS, FETCH_POST,
    FETCH_HOT_POSTS, TRIGGER_SEARCH_POSTS_OFF, TRIGGER_SEARCH_POSTS_ON, 
    DELETE_POST, EDIT_POST
} from './types';
import { ToastSuccess } from '../../main/component/entities/shared/Toast'
import _ from "lodash";

export const createPost = values => async (dispatch) => {
    const res = await Axios.post('/posts/create', values);
    ToastSuccess(res.data.message)
    dispatch({
        type: CREATE_POST,
        payload: res.data.data
    })
}
export const editPost = values => async (dispatch) => {
    const res = await Axios.put('/posts/update', values);
    ToastSuccess(res.data.message)
    dispatch({
        type: EDIT_POST
    })
}

export const fetchHotPosts = () => async dispatch => {
    const res = await Axios.get('/posts/hotPosts');
    dispatch({
        type: FETCH_HOT_POSTS,
        payload: res.data
    })
}

export const fetchPosts = (fields, interestedTopics) => async (dispatch) => {
    let params;
    if (fields) params = JSON.parse(fields);
    params = _.pickBy(params);
    const requestUrl = `posts/search${interestedTopics ? `?topics=${interestedTopics}` : '?'}`;
    const res = await Axios.get(requestUrl, { params });
    dispatch({
        type: FETCH_POSTS,
        payload: res.data.data
    });
};

export const fetchPost = id => async (dispatch) => {
    const res = await Axios.get(`/posts/detail/${id}`);
    
    dispatch({
        type: FETCH_POST,
        payload: res.data.data
    })
}

export const deletePost = id => async dispatch => {
    const res = await Axios.delete(`/posts/delete/${id}`);
    ToastSuccess(res.data.message)
    dispatch({
        type: DELETE_POST,
    })
}

export const triggerSearchOff = () => ({
    type: TRIGGER_SEARCH_POSTS_OFF
});

export const triggerSearchOn = () => ({
    type: TRIGGER_SEARCH_POSTS_ON
});

export const resetPost = () => ({
    type: RESET_POST
});
