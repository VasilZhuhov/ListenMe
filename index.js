const path = require('path')
const express = require('express')
const app = express()
const socketio = require('socket.io')
const fs = require('fs');
const db = require('./models/database');
const bodyParser = require('body-parser');
const session = require('express-session')

const user = db.models.User;
const song = db.models.Song;


const server = app.listen(3000, () => {
  console.log(`Listening on port ${server.address().port}`)
})

const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


io.on('connection', socket => {
  console.log('A new client has connected!');
  socket.on('play', async (data) => {
    let choosenSong = await song.findByTitle(data);
    let path = __dirname + `/songs/${data}.wav`;
    let fileBuffer = {};
    if(fs.existsSync(path)){
        fileBuffer = fs.readFileSync(path);
    }

    io.emit('song', fileBuffer);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected')
  });
})

app.get('/',  async (req, res) => {
    let songs = await song.getPage(0);
    res.render(path.join(__dirname, 'index.html'), {name: req.session.username, songs: songs});
});


app.get('/login', (req, res) => {
    res.render(path.join(__dirname + '/public' + '/login.html'), {error: null});
});

app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let u = await user.findByCredentials({name: username, password: password});
    if(u != null){
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/');
    }else{
        res.render(path.join(__dirname + '/public' + '/login.html'), {error: 'Wrong credentials!'});
    }
});

app.get('/register', (req, res) => {
    res.render(path.join(__dirname + '/public' + '/register.html'), {error: null});
});

app.post('/register', async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password; //encrypt it, most likely will stay like this, not in mood for this
    let u = await user.addUser({name: username, email: email, password: password});
    if(!u){
        res.render(path.join(__dirname + '/public' + '/register.html'), {error: 'User already exist!'});
    }else{
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/');
    }
});
