/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

const express = require('express');
const router = express.Router();
const User = rewuire('../models/user');
const createToken = require('../helpers/createToken');

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.authenticate(req.body.username, req.body.password);
        if (user) {
            const token = createToken(user);
            return res.json({token});
        } else {
            throw new ExpressError("Invalid username/pw", 400);
        }
    } catch (e) {
        return next(e);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const user = await User.register(req.body);
        const token = createToken(user);
        return res.json({token});
    } catch (e) {
        return next(e);
    }
});

module.exports = router;