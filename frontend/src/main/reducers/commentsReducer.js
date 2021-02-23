import {
   CREATE_COMMENT, DELETE_COMMENT, FETCH_COMMENTS, RESET_COMMENT, EDIT_COMMENT,
   TRIGGER_FETCH_COMMENTS_OFF, TRIGGER_FETCH_COMMENTS_ON
} from '../actions/types';


const initialState = {
    entities: [],
    entity: null,
    updateSuccess: false, 
    totalItems: 0,
    shouldSearchEntities: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_COMMENT:
            return { ...state, entity: action.payload, updateSuccess: true };
        case FETCH_COMMENTS:
            return { ...state, entities: action.payload };
        case DELETE_COMMENT:
        case EDIT_COMMENT:
            return { ...state, updateSuccess: true };
        case TRIGGER_FETCH_COMMENTS_ON:
            return {
                ...state,
                shouldSearchEntities: true
            }
        case TRIGGER_FETCH_COMMENTS_OFF:
            return {
                ...state,
                shouldSearchEntities: false,
                updateSuccess: false
            }
        case RESET_COMMENT:
            return {
                ...initialState
            };
        default:
            return state;
    }
}