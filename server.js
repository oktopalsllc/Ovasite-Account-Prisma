require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const User = require("./models/users");

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

//Routes go here
app.get('/', (req,res) => {
    res.send('<h1>Welcome</h1>');
})

app.post('/signup', async (req,res)=> {
 try { 
    const { username, password, email, firstName, lastName } = req.body;

    // Create a new user instance
    const newUser = new User({
      username,
      password, // In a real application, hash and salt the password before saving
      email,
      firstName,
      lastName,
    });
    const savedUser = await newUser.save();

    // Respond with the saved user data
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});


app.post('/login', async (req,res)=>{
   try{
    const { username, password } = req.body;

    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
// Compare the provided password with the stored password (plaintext comparison)
    if (password === user.password) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
   }catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login' });
   }
});

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});


