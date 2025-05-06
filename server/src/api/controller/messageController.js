const config = require("../../config/lineConfig");

const send = async(req,res) => {
    try {
        const {message} = req.body;
        config.client.pushMessage("Ua01d445653d2669d792cf977188b6116",{
            type: 'text',
            text: message
        })
        res.json("berhasil");
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {send}