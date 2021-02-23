import Axios from '../api/Axios';
import {
    FETCH_COMMENTS, EDIT_COMMENT, DELETE_COMMENT,
     CREATE_COMMENT, TRIGGER_FETCH_COMMENTS_OFF, TRIGGER_FETCH_COMMENTS_ON, RESET_COMMENT
} from './types';
import { ToastSuccess } from '../../main/component/entities/shared/Toast'

export const createComment = value => async dispatch => {
    const res = await Axios.post('comments/create', value);
    ToastSuccess(res.data.message);
    dispatch({
        type: CREATE_COMMENT, 
        payload: res.data.data
    })
}

export const fetchPostComments = postId => async dispatch => {
    const res = await Axios.get(`/comments/post/${postId}`);
    dispatch({
        type: FETCH_COMMENTS,
        payload: res.data.data
    })
}

export const editComment = value => async dispatch => {
    const res = await Axios.put('/comments/update', value);
    ToastSuccess(res.data.message);
    dispatch({
        type: EDIT_COMMENT
    })
}

export const deleteComment = id => async dispatch => {
    const res = await Axios.delete(`/comments/delete/${id}`);
    ToastSuccess(res.data.message);
    dispatch({
        type: DELETE_COMMENT
    })
}
export const triggerFetchOff = () => ({
    type: TRIGGER_FETCH_COMMENTS_OFF
});

export const triggerFetchOn = () => ({
    type: TRIGGER_FETCH_COMMENTS_ON
});

export const resetComment = () => ({
    type: RESET_COMMENT
});