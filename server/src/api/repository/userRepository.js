const pool = require('../../config/db');

const addUser = async(userId,name,picture)=> {
    const newUser = await pool.query("INSERT INTO users (user_id, display_name, picture_url) VALUES ($1,$2,$3) RETURNING *", [userId,name,picture]);
    return newUser.rows[0];
}

const getAllUser = async() => {
    const users = await pool.query(`
        SELECT 
        u.*, 
        COALESCE(m.message, NULL) AS last_message,
        COALESCE(sub.unread_count, 0) AS unread_count
        FROM users u
        LEFT JOIN (
        SELECT user_id, message, timestamp
        FROM (
            SELECT DISTINCT ON (user_id) *
            FROM messages
            ORDER BY user_id, timestamp DESC
        ) AS latest_messages
        ) m ON u.user_id = m.user_id
        LEFT JOIN (
            SELECT user_id, COUNT(*) FILTER (WHERE isread = false) AS unread_count
            FROM messages
            GROUP BY user_id
        ) sub ON u.user_id = sub.user_id;
    `);
    return users.rows;
}

const getUserById = async(userId) => {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    return user.rows[0];
}

module.exports = {addUser,getUserById,getAllUser};