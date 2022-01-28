const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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


userSchema.pre('save', function( next ){
    var user = this;

    // 비밀번호가 변경되었을때만
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb) { //cb = callback
    var thisUser = this;

    // hash의 특성때문에 암호화된 코드를 복호화 할 수는 없다. 따라서 원래 패스워드를 암호화 한 후 비교하기.
    bcrypt.compare(plainPassword, thisUser.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;
    // jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    // user._id + 'secretToken' = token -> 'secretToken' -> user._id
    user.token = token;
    user.save(function(err, user) {
        if (err) return cb(err);
        cb(null, user);
    })

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    
    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function(err, user) {

            if (err) return cb(err);
            cb(null, user);
        })
    })
}

//Schema를 model로 감싸준다.
const User = mongoose.model('User', userSchema);

module.exports = { User } //이 모델을 다른 곳에서도 쓸 수 있게 export해준다