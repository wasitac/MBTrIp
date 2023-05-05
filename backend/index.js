// openAI api
const { Configuration, OpenAIApi } = require("openai")
const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
// let corsOptions = {
//     origin: 'https://www.domain.com',
//     credentials: true
// }
app.use(cors());

//post요청 받기
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/trip', async function (req, res) {
  let{ userMessage, assistantMessage} = req.body

    let messages = [
      {role: "system", content: "당신은 여행기획자입니다. 이용자에게 여행지를 추천해주고, 여행지가 정해진 이용자에게는 여행 계획의 세워주는것이 당신의 일입니다. 당신의 여행계획은 이동경로가 효율적이고 관광지의 테마가 겹치지 않아야 합니다."},
      {role: "user", content: "당신은 여행기획자입니다. 이용자에게 여행지를 추천해주고, 여행지가 정해진 이용자에게는 여행 계획의 세워주는것이 당신의 일입니다. 당신의 여행계획은 이동경로가 효율적이고 관광지의 테마가 겹치지 않아야 합니다."},
      {role: "assistant", content: "안녕하세요! 여행기획자입니다. 이용자분께서 원하시는 여행 스타일에 따라 추천해드릴게요. 우선 일정과 이동수단 그리고 선호하는 여행 테마에 대해서 알려주세요. 또한, 함께 여행 하실 인원수도 알려주시면 더욱 정확한 추천이 가능합니다. 예를 들어, 2인이서 5일간의 여행을 계획하고 있으며, 자연과 역사적인 건축물을 볼 수 있는 여행이 더욱 좋을 것 같다고 생각하시면, 이에 맞는 여행지와 일정을 추천해드릴 수 있습니다. 그러면 이제부터 자세히 질문해보도록 할게요."},
    ]

    while (userMessage.length != 0 || assistantMessage.length != 0){
        if (userMessage.length != 0){
          messages.push(
            JSON.parse('{"role": "user", "content": "'+String(userMessage.shift()).replace(/\n/g,"")+'"}')
          )
        }
        if (assistantMessage.length != 0){
          messages.push(
            JSON.parse('{"role": "assistant", "content": "'+String(assistantMessage.shift()).replace(/\n/g,"")+'"}')
          )
        }
    }

    const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages
    });
    let info = completion.data.choices[0].message['content']

    res.json({"assistant" : info});
  });
  

app.listen(3000)

