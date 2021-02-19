import Axios from '../api/Axios';
import { REGISTER } from './types';

export const createUser = values => async (dispatch) => {
    const res = await Axios.post('/auth/register', values);
    dispatch({
        type: REGISTER,
        payload: res.data.user
    })
}