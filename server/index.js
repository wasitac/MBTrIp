// express
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require("./models/User");
var cors = require('cors')
const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
// let corsOptions = {
//   origin: 'https://www.domain.com',
//   credentials: true
// }
app.use(cors());

//post요청 받기
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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

// chatGPT
app.post('/trip', async function (req, res) {
  const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
      {role: "system", content: "당신은 여행플래너 입니다. 질문자의 mbti를 포함한 정보를 입력받아 최적의 여행계획을 세워줄 수 있습니다. 질문자가 아직 여행지를 정하지 못했다면 여행지를 먼저 추천하고, 여행지가 정해졌다면 여행일수, 이동수단, 여행취향 등의 정보를 받아 여행 경로를 추천합니다. 여행 경로 또한 mbti정보를 고려해 수립해야하며, 방문하는 여행지 간의 이동경로가 최대한 효율적인 계획을 수립합니다."},
      {role: "user", content: "Hello world"},
      {role: "assistant", content: "Hello world"},
      {role: "user", content: "Hello world"}],
  });
  let info = completion.data.choices[0].message

  console.log(info);
  res.send(info);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

