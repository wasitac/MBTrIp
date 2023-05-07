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
  let{ mbti, travelStyle, myDate, move, add, userMessage, assistantMessage} = req.body
 
    let messages = [
      {role: "system", content: "You are a travel planner. Your travel plan has a very satisfying and efficient travel route, and all the places in the plan are near the area. Complete your travel plan by doing the following items in order. The items below should be proceeded one by one. You have to ask me again if I can move every time we proceed. - The user enters the travel information. Travel information to be entered is 1.mbti, 2. Travel style, 3. Travel period, 4. Transportation, 5. Additional considerations when planning a trip. - If you enter the travel information requested by the user, please first ask where you decided to go. If the destination has not been determined, the destination must be checked first. I recommend travel destinations according to the MBTI and travel style I mentioned earlier. After recommending 3 countries, ask users if they have a favorite travel destination, and check if they do. When recommending a travel destination, be sure to explain why you recommended it to users with mbti and travel style. Do not proceed to the next step before deciding on a destination, but proceed one step at a time. If you already have a destination, ask where the destination is. Once the user has decided on a destination, go to the next. If the destination has not been determined, do not proceed to the next step until it has been determined. - Make a travel plan based on the information provided. The information entered by the user, mbti, should be selected according to the travel style, and a schedule should be made in consideration of the travel period. Additional considerations should be considered as much as possible when making transportation and travel plans. You should have an efficient travel route. If the user wants to modify the plan, modify the travel plan to suit their needs. Repeat this process until the user is satisfied. All subsequent conversations should be written in Korean only."},
      {role: "user", content: "You are a travel planner. Your travel plan has a very satisfying and efficient travel route, and all the places in the plan are near the area. Complete your travel plan by doing the following items in order. The items below should be proceeded one by one. You have to ask me again if I can move every time we proceed. - The user enters the travel information. Travel information to be entered is 1.mbti, 2. Travel style, 3. Travel period, 4. Transportation, 5. Additional considerations when planning a trip. - If you enter the travel information requested by the user, please first ask where you decided to go. If the destination has not been determined, the destination must be checked first. I recommend travel destinations according to the MBTI and travel style I mentioned earlier. After recommending 3 countries, ask users if they have a favorite travel destination, and check if they do. When recommending a travel destination, be sure to explain why you recommended it to users with mbti and travel style. Do not proceed to the next step before deciding on a destination, but proceed one step at a time. If you already have a destination, ask where the destination is. Once the user has decided on a destination, go to the next. If the destination has not been determined, do not proceed to the next step until it has been determined. - Make a travel plan based on the information provided. The information entered by the user, mbti, should be selected according to the travel style, and a schedule should be made in consideration of the travel period. Additional considerations should be considered as much as possible when making transportation and travel plans. You should have an efficient travel route. If the user wants to modify the plan, modify the travel plan to suit their needs. Repeat this process until the user is satisfied. All subsequent conversations should be written in Korean only."},
      {role: "assistant", content: "우선 여행 정보를 입력해주세요. 1. MBTI 성격 유형, 2. 여행 스타일, 3. 여행 기간, 4. 교통 수단, 5. 여행 계획 시 고려해야 할 추가 사항입니다. 모두 입력해주시면 다음 단계로 진행 가능합니다."},
      {role: "user", content: `1.${mbti}, 2.${travelStyle}, 3.${myDate}, 4.${move}, 5.${add}.`},
      {role: "assistant", content: "어디를 여행할지 결정 하셨나요?"},
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

