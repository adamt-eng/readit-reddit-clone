export const fakeAuth = (req, res, next) => {
    req.user.id = '69345c85481669617584618c'
    next();
}