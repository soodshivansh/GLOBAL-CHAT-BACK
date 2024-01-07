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





// Define the Message model
const messageSchema = new mongoose.Schema({
  text: String,
  owner: String,
});

const Message = mongoose.model('Message', messageSchema);

// Define the User model
const userSchema = new mongoose.Schema({
  Name: String,
  Password: String,
});

const User = mongoose.model('User', userSchema);








// Route to send messages
app.post("/sendmessages", (req, res) => {
  let { content, owner } = req.body;

  // Create a new message instance
  let message = new Message({ text: content, owner: owner  });

  console.log("Message received!");

  message.save()
    .then((savedMessage) => {
      res.status(200).json(savedMessage);
    })
    .catch(error => {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});






// Route to sign up users
app.post("/signup", (req, res) => {
  let { name, password } = req.body;

  // Create a new user instance
  let user = new User({ Name: name, Password: password });

  user.save()
    .then((savedUser) => {
      res.status(200).json(savedUser);
    })
    .catch(error => {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});







// Route to sign in users
app.post("/signin", (req, res) => {
  const { name, password } = req.body;

  // Find user by name
  User.findOne({ "Name": name })
    .then((user) => {
      if (!user) {
        console.log('User not found for name: ' + name); // Log a more generic message
        return res.status(403).json({ error: "Name not found" });
      }

      // Compare passwords
      if (password === user.Password) {
        console.log("User found for name: " + user.Name);
        res.status(200).json({ name: user.Name });
      } else {
        console.log("Incorrect password for user: " + user.Name);
        res.status(403).json({ error: "Incorrect password" });
      }
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});









// Route to get all messages
app.get('/getmessages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
  console.log('Server is running on port -> ' + PORT);
});
