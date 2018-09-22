const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require('jwt-simple')

var User = require('./models/User.js')
var Post = require('./models/Post.js')
var auth = require('./auth.js')

mongoose.Promise = Promise

app.use(cors())

app.use(bodyParser.json())

app.get('/posts/:id', async (req, res) =>{
    var author = req.params.id
    var posts = await Post.find({author})
    res.send(posts)
})

// app.post('/post', auth.checkAuthenticated, (req, res) => {
//     console.log(JSON.stringify(req)  + 'yayyyy')
//     var postData = req.body
//     postData.author = req.userId
//     var post = new Post(postData)

//     post.save((err, result) => { 
//         if (err) {
//             console.error('Saving post error')
//             return res.status(500).send({message : 'Saving post error'})
//         }
//             res.sendStatus(200)
//     })
// })
app.post('/post', auth.checkAuthenticated, (req, res) => {
    var postData = req.body
    var post = new Post(postData)
    postData.author = req.userId
    var post = new Post(postData)
    post.save((err, result) => { 
        if (err) {
            console.error('Saving post error')
            return res.status(500).send({message : 'Saving post error'})
        }
            res.sendStatus(200)
    })
})

app.get('/users', async (req, res) =>{
    try{
        var users = await User.find({}, '-pwd -__v')
        res.send(users)
    } catch(error){
        console.error(error)
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req, res) =>{
    try{
        var user = await User.findById(req.params.id, '-pwd -__v')
        res.send(user)
        res.sendStatus(200)
    } catch(error){
        console.error(error)
        res.sendStatus(500)
    }
})

mongoose.connect('mongodb://test:tester1@ds117758.mlab.com:17758/local_library', {useNewUrlParser: true}, (err) => {
    if(!err)
        console.log('connected')

})

app.use('/auth', auth.router)

app.listen(3000)