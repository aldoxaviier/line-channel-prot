const config = require("../../config/lineConfig");
const service = require("../service/webhookService");

// receive events from line
const receive = async (req, res) => {
    try {
        // handle events from line
        const result = await Promise.all( // promise.all to handle all events
            req.body.events.map(service.handleEvents)
        );
        // return result
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};




module.exports = {receive}