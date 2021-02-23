// POSTS ACTIONS
export const REGISTER = "REGISTER";
export const CREATE_POST = "CREATE_POST";
export const EDIT_POST = "EDIT_POST";
export const FETCH_POSTS = "FETCH_POSTS";
export const FETCH_HOT_POSTS = "FETCH_HOT_POSTS";
export const FETCH_POST = "FETCH_POST";
export const DELETE_POST = "DELETE_POST";
export const RESET_POST = "RESET_POST";
export const TRIGGER_SEARCH_POSTS_ON = "TRIGGER_SEARCH_POSTS_ON"  // Under some circumstances, we need to trigger the search again, eg: After creating a new post.
export const TRIGGER_SEARCH_POSTS_OFF = "TRIGGER_SEARCH_POSTS_OFF"

// COMMENTS ACTIONS
export const CREATE_COMMENT = "CREATE_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const FETCH_COMMENTS = "FETCH_COMMENTS";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const RESET_COMMENT = "RESET_COMMENT";
export const TRIGGER_FETCH_COMMENTS_ON = "TRIGGER_FETCH_COMMENTS_ON"  // Under some circumstances, we need to trigger the FETCH again, eg: After creating a new post.
export const TRIGGER_FETCH_COMMENTS_OFF = "TRIGGER_FETCH_COMMENTS_OFF"
