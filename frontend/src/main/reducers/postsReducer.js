import { 
    CREATE_POST, RESET_POST, FETCH_POSTS, FETCH_HOT_POSTS, 
    TRIGGER_SEARCH_POSTS_ON, TRIGGER_SEARCH_POSTS_OFF, FETCH_POST, DELETE_POST, EDIT_POST 
} from '../actions/types';


const initialState = {
    entities: [],
    entity: null,
    updateSuccess: false,
    totalItems: 0,
    hotEntities: [],
    shouldSearchEntities: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_POST:
            return { ...state, entity: action.payload.data, updateSuccess: true };
        case DELETE_POST:
        case EDIT_POST:
            return { ...state, updateSuccess: true };
        case FETCH_POST:
            return { ...state, entity: action.payload};
        case FETCH_POSTS:
            return { 
                ...state, 
                entities: action.payload.data, 
                totalItems: action.payload.total
             };
        case FETCH_HOT_POSTS:
            return {
                ...state,
                hotEntities: action.payload.data
            }
        case TRIGGER_SEARCH_POSTS_ON:
            return {
                ...state,
                shouldSearchEntities: true
            }
        case TRIGGER_SEARCH_POSTS_OFF:
            return {
                ...state,
                shouldSearchEntities: false,
                updateSuccess: false
            }
        case RESET_POST: 
            return {
                ...initialState
            };
        default:
            return state;
    }
}