const config = require("../../config/lineConfig");
const service = require("../service/webhookService");

const receive = async (req, res) => {
    try {
        const result = await Promise.all(
            req.body.events.map(service.handleEvents)
        );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};




module.exports = {receive}