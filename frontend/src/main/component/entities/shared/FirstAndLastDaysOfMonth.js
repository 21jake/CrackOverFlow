

export const startingDay = () => {
    const curr = new Date();
    curr.setDate(curr.getDate() + 1);
    const startingDayOfTheMonth = new Date(curr.getFullYear(), curr.getMonth(), 1).toISOString().substr(0, 10);
    return startingDayOfTheMonth;
}

export const finalDay = () => {
    const curr = new Date();
    curr.setDate(curr.getDate() + 1);
    const finalDayOfTheMonth = new Date(curr.getFullYear(), curr.getMonth() + 1, 0).toISOString().substr(0, 10);
    return finalDayOfTheMonth;
}