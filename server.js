require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  autoIndex: true,
});

// Move the model definition outside the route handler
const Message = mongoose.model('Message', { text: String });

app.post("/sendmessages", (req, res) => {
  let { content } = req.body;

  // Create a new message instance
  let message = new Message({ text: content });

  console.log("message recieved !");

  message.save()
    .then((u) => {
      res.status(200).json(u);
    })
    .catch(error => {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

const messageSchema = new mongoose.Schema({
    text: String,
  });
  
const Messages = mongoose.model('Messages', messageSchema);

app.get('/getmessages', async (req, res) => {

    try {
      const messages = await Messages.find();
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  });

app.listen(process.env.PORT || 4000, () => {
  console.log('listening on port -> ' + process.env.PORT);
});
