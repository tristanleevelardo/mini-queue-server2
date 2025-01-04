// getStatus.js
const express = require('express');
const QueueSchema = require('../models/queueItem');

const router = express.Router();

module.exports = (io) => {
    router.get('/', async (req, res) => {
        try {
            const { status } = req.query;

            if (!status) {
                return res.status(400).json({ message: 'Status parameter is required' });
            }

            // Find all items with the specified status
            const queueItems = await QueueSchema.find({ status });

            res.status(200).json({ queueItems });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    return router;
};
