import {
    FETCH_USER_COMMENTS, FETCH_USER_SUGGESTED_POSTS, TRIGER_FETCH_USER_OFF, TRIGER_FETCH_USER_ON,
    FETCH_USER_POSTS, RESET_USER, FETCH_GUEST
} from "../actions/types";
const initialState = {
    isSignedIn: null,
    guest: null,
    posts: [],
    totalPosts: 0,
    suggestedPosts: [],
    comments: [],
    totalCredit: 0,
    shouldSearchEntities: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_POSTS:
            return {
                ...state,
                posts: action.payload.posts?.data,
                totalCredit: action.payload.totalCredit,
                totalPosts: action.payload.posts?.total,
            }
        case FETCH_GUEST:
            return {
                ...state,
                guest: action.payload
            }
        case FETCH_USER_COMMENTS:
            return {
                ...state,
                comments: action.payload.data
            }
        case FETCH_USER_SUGGESTED_POSTS:
            return {
                ...state,
                suggestedPosts: action.payload.data
            }
        case TRIGER_FETCH_USER_ON:
            return {
                ...state,
                shouldSearchEntities: true
            }
        case TRIGER_FETCH_USER_OFF:
            return {
                ...state,
                shouldSearchEntities: false
            }
        case RESET_USER:
            return {
                ...initialState
            };
        default:
            return state;
    }
}