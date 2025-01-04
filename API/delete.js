// deleteAll.js
const express = require('express');
const CounterSchema = require('../models/counter');
const CounterPSchema = require('../models/counterP');
const QueueSchema = require('../models/queueItem');

const router = express.Router();

module.exports = (io) => {
    router.delete('/', async (req, res) => {
        try {
            // Delete all counters
            await CounterSchema.deleteMany();

            // Delete all counterP items
            await CounterPSchema.deleteMany();

            // Delete all queue items
            await QueueSchema.deleteMany();

            // Emit a socket.io event to notify clients of the deletion
            io.emit('queueUpdate', { message: 'All counters and queue items deleted' });

            res.status(200).json({ message: 'All counters and queue items deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    return router;
};
