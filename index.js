const express = require('express') //express module 가져오기
const app = express() // 새로운 express app을 만들기
const port = 5000 // 서버 포트 넘버 (localhost:5000)
const { User } = require('./models/User');
const bodyParser = require("body-parser");

const config = require('./config/key');

// application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended: true})); deprecated
app.use(express.urlencoded({ extended: true}));

// application/json
//app.use(bodyParser.json()); deprecated
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI
).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hi this is Server from Dowon')) // Hello World 출력!

app.post('/register', (req, res) => {
    // 회원가입할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다


    const user = new User(req.body) //json 형식으로 body에 들어있음
    user.save((err, doc) => {
        if(err) return res.json({ success: false, err}) //json형식으로 에러메세지 보내줌
        return res.status(200).json({
            success: true
        })
    }) //mongoDB method

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

