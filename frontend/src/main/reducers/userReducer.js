import { FETCH_USER_COMMENTS, FETCH_USER_SUGGESTED_POSTS,
     FETCH_USER_POSTS, RESET_USER, FETCH_GUEST } from "../actions/types";
const initialState = {
    isSignedIn: null,
    guest: null,
    posts: [],
    totalPosts: 0,
    suggestedPosts: [],
    comments: [],
    totalCredit: 0
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
        case RESET_USER:
            return {
                ...initialState
            };
        default:
            return state;
    }
}