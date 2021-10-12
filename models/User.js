const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // struct 같이 모델의 어떤 정보들이 들어가는지 필드 작성
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //Space를 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0 //User: 0, Admin: 1
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})

//Schema를 model로 감싸준다.
const User = mongoose.model('User', userSchema)

module.exports = { User } //이 모델을 다른 곳에서도 쓸 수 있게 export해준다