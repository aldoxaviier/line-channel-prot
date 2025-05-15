const pool = require('../../config/db');

const addMessage = async(id,userId,msg) => {
    const newMessage = await pool.query("INSERT INTO messages (id,user_id,direction,message,timestamp) VALUES ($1,$2,'in',$3,NOW()) RETURNING *", [id,userId,msg]);
    return newMessage.rows[0];
}

module.exports = {addMessage}