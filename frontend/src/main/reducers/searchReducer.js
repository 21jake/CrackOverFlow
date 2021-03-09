import { SEARCH_USERS, SEARCH_POSTS } from '../actions/types';

const initialState = {
    postsEntities: [],
    usersEntities: [],
    totalItems: 0,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_USERS:
            return { 
                ...state, 
                usersEntities: action.payload.data,
                totalItems: action.payload.total
            }
        case SEARCH_POSTS:
            return {
                ...state,
                postsEntities: action.payload.data,
                totalItems: action.payload.total
            }
        default:
            return state;
    }
}