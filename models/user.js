/** User class for message.ly */
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { useRouteError } = require("react-router-dom");


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO user(username, password, first_name, last_name, phone, join_at)
       VALUES ($1, $2, $3, $4 ,$5, current_timestamp)
       RETURNING username, password, first_name, last_name, phone`,
       [username, hashedPassword, first_name, last_name, phone]
    );
    return result.rows[0];
   }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    return user && await bcrypt.compare(password, user.password);
   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    await db.query(
      `UPDATE users SET last_login_at = current_timestamp WHERE username = $1`,
      [username]
    );
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    const result = await db.query(
      `SELECT username, first_name. last_name, phone FROM users`

    );
    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if(!user) {
      throw new Error(`No such user: ${username}`);
    }
    return user;
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
      const result = await db.query(
          `SELECT id, to_username, body, sent_at, read_at 
           FROM messages WHERE from_username = $1`,
          [username]
      );
      return result.rows.map(msg => ({
          id: msg.id,
          to_user: msg.to_username,
          body: msg.body,
          sent_at: msg.sent_at,
          read_at: msg.read_at
      }));
   }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(
      `SELECT id, from_username, body, sent_at, read_at 
       FROM messages WHERE to_username = $1`,
      [username]
  );
  return result.rows.map(msg => ({
      id: msg.id,
      from_user: msg.from_username,
      body: msg.body,
      sent_at: msg.sent_at,
      read_at: msg.read_at
  }));
   }
}

module.exports = User;