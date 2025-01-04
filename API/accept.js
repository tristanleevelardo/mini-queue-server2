// done.js
const express = require('express');
const QueueSchema = require('../models/queueItem');

const router = express.Router();

module.exports = (io) => {
    router.put('/:queueNum', async (req, res) => {
        try {
            const { queueNum } = req.params;

            // Find the queue item based on queueNum
            const queueItem = await QueueSchema.findOne({ queueNum });

            if (!queueItem) {
                return res.status(404).json({ message: 'Queue item not found' });
            }

            // Update the status to "done"
            queueItem.status = "for-release";

            // Save the updated queue item
            await queueItem.save();

            // Emit a socket.io event to notify clients of the update
            io.emit('queueUpdate', queueItem);

            res.status(200).json({ message: 'Queue item status set to "for-release" ', queueItem });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    return router;
};
