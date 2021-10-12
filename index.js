const express = require('express') //express module 가져오기
const app = express() // 새로운 express app을 만들기
const port = 5000 // 서버 포트 넘버 (localhost:5000)
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dwkim16:rlaehdnjs2@boilerplate.s0uf5.mongodb.net/boilerplate?retryWrites=true&w=majority'
).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World!')) // Hello World 출력!

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

