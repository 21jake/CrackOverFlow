
export const checkUserLoggedIn = (user) => {
    if (user && user.fname) {
        return true;
    } else {
        return false;
    }
}