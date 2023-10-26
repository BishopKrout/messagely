/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { ensureLoggedIn } = require('../middleware/auth');

// Get detail of a message
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        const message = await Message.get(req.params.id);
        return res.json({ message });
    } catch (e) {
        return next(e);
    }
});

// Post a message
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const message = await Message.create(req.body);
        return res.json({ message });
    } catch (e) {
        return next(e);
    }
});

// Mark a message as read
router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
    try {
        const message = await Message.markRead(req.params.id);
        return res.json({ message });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
