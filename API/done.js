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

            // Check if the status is "for-release"
            if (queueItem.status !== 'for-release') {
                return res.status(400).json({ message: 'Queue item is not yet for release' });
            }

            // Update the status to "done"
            queueItem.status = 'done';

            // Save the updated queue item
            await queueItem.save();

            // Delete the specific queue item from the database
            await QueueSchema.deleteOne({ queueNum });

            // Emit a socket.io event to notify clients of the update
            io.emit('queueUpdate', queueItem);

            res.status(200).json({ message: 'Queue item status set to "done"', queueItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    return router;
};
