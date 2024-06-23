const express = require("express");
const cors = require('cors');
const { default: mongoose } = require("mongoose");
const app = express();
const User = require('./models/User.js');
const Post = require('./models/Post.js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const multer = require("multer");
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'JAISATGURUVITTHALVITTHALJS';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://kartikrameshchavan2003:TyldWozhdLdlGqh2@cluster0.s2hrtdd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res) => {

    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            return res.status(400).json('Wrong Credentials');
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username
                });
            });
        } else {
            res.status(400).json('Wrong Credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json('Internal Server Error');
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('okjs');
})

const uploadMiddleware = multer({ dest: 'uploads/' });
 

// photos uploading
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        const { title, summary, content } = req.body;

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        })

        res.json(postDoc);
    })

});





app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        if (newPath) {
            postDoc.cover = newPath;
        }

        // Save the updated document
        await postDoc.save();

        res.json(postDoc);
    });

});



app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})


app.listen(4000);

// kartikrameshchavan2003

// TyldWozhdLdlGqh2

// mongodb+srv://kartikrameshchavan2003:TyldWozhdLdlGqh2@cluster0.s2hrtdd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0