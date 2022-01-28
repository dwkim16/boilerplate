const express = require('express') //express module 가져오기
const app = express() // 새로운 express app을 만들기
const port = 5000 // 서버 포트 넘버 (localhost:5000)
const { User } = require('./models/User');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

const config = require('./config/key');

// application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended: true})); deprecated
app.use(express.urlencoded({ extended: true}));

// application/json
//app.use(bodyParser.json()); deprecated
app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI
).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hi this is Server from Dowon')) // 출력!

app.get('/api/hello', (req, res) => { res.send("안녕하세요!") })

app.post('/api/users/register', (req, res) => {
    // 회원가입할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다


    const user = new User(req.body); //json 형식으로 body에 들어있음
    user.save((err, doc) => {
        if(err) return res.json({ success: false, err}) //json형식으로 에러메세지 보내줌
        return res.status(200).json({
            success: true
        })
    }) //mongoDB method

})

app.post('/api/users/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "There is no user assigned for this email."
            })
        } 
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {

            if(!isMatch)
                return res.json({ 
                    loginSuccess: false, 
                    message: "Password error." 
                });
            

            // 비밀번호가 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 쿠키, 로컬스토리지 등등에 저장 가능. 우리는 쿠키에다가 저장함.
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});


app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 왔다면 middleware를 다 통과한 것이다 -> Auth == true
    res.status(200).json({
        _id: req.user._id,
        // role = 0 -> 일반유저 not 0 -> admin
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,

    })

})

app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id },
      { token: "" }
      , (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
      })
  })



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

