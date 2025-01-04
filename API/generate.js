const express = require('express');
const QueueSchema = require('../models/queueItem');
const Counter = require('../models/counter');
const CounterP = require('../models/counterP');

const router = express.Router();

module.exports = (io) => {
  router.get('/', async (req, res) => {
    try {
      const {priority} = req.query;

      if (priority === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
      }
 
      let newQueueItem;

      if (priority === 'true') {
        
        let counterP = await CounterP.findOne();

        if (!counterP) {
          // Initialize the counter if it doesn't exist
          counterP = new CounterP({ value: 0 });
          await counterP.save();
        }
  
        counterP.value += 1;
        await counterP.save();
        
        const formattedQueueNumP = `P${counterP.value.toString().padStart(3, '0')}`;

        newQueueItem = new QueueSchema({
          windowNum: "",
          queueNum: formattedQueueNumP,
          status: "raw",
          priority,

        });

        // Save the newQueueItem
        await newQueueItem.save();
      }

      if (priority === 'false') {

        // Get the current counter value and increment it
        let counter = await Counter.findOne();
  
        if (!counter) {
          // Initialize the counter if it doesn't exist
          counter = new Counter({ value: 0 });
          await counter.save();
        }
  
        counter.value += 1;
        await counter.save();
  
        // Format the queueNum with the determined prefix and leading zeros
        const formattedQueueNum = `${counter.value.toString().padStart(3, '0')}`;
  
        newQueueItem = new QueueSchema({
          windowNum: "",
          queueNum: formattedQueueNum,
          status: "raw",
          priority,
        });

        // Save the newQueueItem
        await newQueueItem.save();
      }

      // Emit a socket.io event to notify clients of the update
      io.emit('queueUpdate', newQueueItem);

      res.status(201).json({ message: 'Queue item added successfully', queueItem: newQueueItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  return router;
};
