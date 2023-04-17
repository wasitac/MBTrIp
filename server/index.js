// express
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('야호')
})

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요 ~")
})

app.post('/api/users/register', (req, res) => {
  //회원가입에 필요한 정보들을 클라이언트에서 가져와 데이터베이스에 넣어준다.
  
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  //이메일이 데이터베이스에 있는지 확인
  User.findOne({email: req.body.email}, (err, user)=> {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      })
    }

  //비밀번호가 맞는지 확인
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch)
      return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
    
    //비밀번호가 맞다면 토큰을 생성하기
    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);

      //토큰을 저장한다.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})


app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""}
    , (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// openAI api
const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion() {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "How are you today?",
    });
    console.log(completion.data.choices[0].text);
}
