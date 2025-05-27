const pool = require('../../config/db');

const addMessage = async(id,userId,direction,msg,type) => {
    const newMessage = await pool.query("INSERT INTO messages (id,user_id,direction,message,timestamp,type) VALUES ($1,$2,$3,$4,NOW(),$5) RETURNING *", [id,userId,direction,msg,type]);
    return newMessage.rows[0];
}

const getAllMessage = async(userId) => {
    const message = await pool.query("SELECT * FROM messages WHERE user_id = $1", [userId]);
    return message.rows;
}

const getLastMessage = async(userId) => {
    const message = await pool.query("SELECT message FROM messages WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1", [userId]);
    return message.rows[0];
} 

const readStatus = async(messageId) => {
    const message = await pool.query("UPDATE messages set isread = true WHERE id = $1 RETURNING *", [messageId]);
    return message.rows[0];
}

module.exports = {addMessage,getAllMessage,getLastMessage,readStatus};