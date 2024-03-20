const Gemini = function (Gemini) { };
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv')
const env = dotenv.config()
const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);
//const context = require("../utils/context");

Gemini.textOnly = async (prompt) => {
  // console.log("prompt",genAI)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  // console.log("result",result.response.text())
  return result.response.text();
}

// Gemini.textOnlyWithContext = async (prompt) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//   const parts = [{
//     text: "ตอบคำถามโดยอ้างอิง Conference นี้เท่านั้น\n" + JSON.stringify(context.lct23_json)
//   }];
//   const result = await model.generateContent([prompt, ...parts]);
//   return result.response.text();
// }

Gemini.multimodal = async (prompt, base64Image) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const mimeType = "image/png";
  const imageParts = [{
    inlineData: { data: base64Image, mimeType }
  }];
  const result = await model.generateContent([prompt, ...imageParts]);
  return result.response.text();
}

Gemini.chat = async (cacheChatHistory, prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chatHistory = [
    {
      role: "user",
      parts: "ตอบคำถามเฉพาะที่เกี่ยวกับงาน Conference นี้เท่านั้น โดยคำตอบให้อ้างอิงข้อมูลอีเวนท์ของ CSV: ชื่อผู้บรรยาย, เวลา, หัวข้อ\n" + context.lct23_csv
    },
    {
      role: "model",
      parts: "สวัสดีครับ ผมชื่อตี๋ ผมเป็นผู้จัดงาน LINE CONFERENCE THAILAND 2023 ครับ"
    }
  ];
  if (cacheChatHistory.length > 0) {
    chatHistory.push(...cacheChatHistory);
  }
  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(prompt);
  return result.response.text();
}

module.exports =  Gemini;