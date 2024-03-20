const express = require('express');
const linesend = require("./service/line");
const line = require('@line/bot-sdk');
const gemini = require("./service/gemini");
const dotenv = require('dotenv')

const app = express()
const env = dotenv.config()


const config = {
  channelAccessToken: `${process.env.ACCESS_TOKEN}`,
  channelSecret: `${process.env.SECRET_TOKEN}`
};


const client = new line.Client(config);
const NodeCache = require("node-cache");
const cache = new NodeCache();
const CACHE_IMAGE = "image_";
const CACHE_CHAT = "chat_";

app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events

    for (const event of events) {
      const userId = event.source.userId;

      switch (event.type) {
        case "message":
          if (event.message.type === "text") {
            const prompt = event.message.text;

            const cacheImage = cache.get(CACHE_IMAGE + userId);
            if (cacheImage) {
              const text = await gemini.multimodal(prompt, cacheImage);
              await linesend.reply(event.replyToken, [{ type: 'text', text: text }]);
            }
            else {
              const text = await gemini.textOnly(prompt)
              await linesend.reply(event.replyToken, [{ type: 'text', text: text }])
            }
            break;
          }

          if (event.message.type === "image") {
            const imagebinary = await linesend.getImageBinary(event.message.id)
            const imageBase64 = Buffer.from(imagebinary, 'binary').toString("base64");

            cache.set(CACHE_IMAGE + userId, imageBase64, 60);
            await linesend.reply(event.replyToken, [{ type: "text", text: "ระบุสิ่งที่ต้องการทราบจากภาพมาได้เลย" }]);
            break;

          }
          break;
      }
      res.end();
    }
  } catch (error) {
    res.status(500).end()
  }
})
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});
const PORT = process.env.PORT || 8099;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});