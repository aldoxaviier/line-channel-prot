const userRepository = require('../repository/userRepository');


const getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUser();
        res.json(users);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = { getAllUsers };