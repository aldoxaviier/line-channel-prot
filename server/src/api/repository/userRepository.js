const pool = require('../../config/db');

const addUser = async(userId,name,picture)=> {
    const newUser = await pool.query("INSERT INTO users (user_id, display_name, picture_url) VALUES ($1,$2,$3) RETURNING *", [userId,name,picture]);
    return newUser.rows[0];
}

const getUserById = async(userId) => {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    return user.rows[0];
}

module.exports = {addUser,getUserById};