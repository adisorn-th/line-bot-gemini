**สร้าง LINE Bot สำหรับใช้กับ Gemini ด้วย Node.js**

**บทนำ**
Gemini เป็นกระดานซื้อขายสกุลเงินดิจิทัลซึ่งช่วยให้ผู้ใช้ซื้อ ขาย และจัดเก็บสินทรัพย์ดิจิทัล LINE Bot เป็นบอทแชทที่สามารถโต้ตอบกับผู้ใช้บนแพลตฟอร์ม LINE บทความนี้จะแนะนำขั้นตอนโดยละเอียดในการสร้าง LINE Bot สำหรับใช้กับ Gemini โดยใช้ Node.js

**ขั้นตอนที่ 1: สร้างบัญชี LINE Developer**
เข้าสู่เว็บไซต์ LINE Developer (https://developers.line.biz/) และสร้างบัญชีใหม่

**ขั้นตอนที่ 2: สร้าง LINE Bot ใหม่**
หลังจากเข้าสู่ระบบแล้ว คลิกที่ "Create a LINE Bot" แล้วกรอกรายละเอียดที่จำเป็น เช่น ชื่อและคำอธิบายของ Bot

**ขั้นตอนที่ 3: เตรียม API Keys**
ไปที่ Gemini และสร้างคีย์ API คู่ (API Key และ API Secret) คลิกที่ "Account" จากนั้น "API" และ "Create Key Pair"

**ขั้นตอนที่ 4: ติดตั้ง Node.js และแพ็คเกจ**
ติดตั้ง Node.js จากเว็บไซต์อย่างเป็นทางการ (https://nodejs.org/) จากนั้นติดตั้งแพ็คเกจที่จำเป็นโดยใช้คำสั่งต่อไปนี้:

```
npm install --save line-bot-sdk gemini-api
```

**ขั้นตอนที่ 5: เขียนโค้ด**
สร้างไฟล์ JavaScript ใหม่และเขียนโค้ดต่อไปนี้:

```
const { LineBot } = require("line-bot-sdk");
const { Client } = require("gemini-api");

// สร้าง Line Bot
const bot = new LineBot({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

// สร้างไคลเอ็นต์ Gemini
const gemini = new Client({
  key: process.env.GEMINI_API_KEY,
  secret: process.env.GEMINI_API_SECRET,
});

// จัดการข้อความ
bot.on("message", async (event) => {
  // Check if message is from LINE group
  if (event.source.type !== "group") {
    return;
  }

  // Get balance and reply with result
  const balance = await gemini.getAccountBalance();
  event.reply(`Your Gemini balance is:\n${balance}`);
});

// รับฟังอีเวนต์
bot.listen({}, () => {
  console.log("LINE Bot is listening on port 3000");
});
```

**ขั้นตอนที่ 6: ตั้งค่าตัวแปรสภาพแวดล้อม**
แทนที่ `process.env.LINE_CHANNEL_ACCESS_TOKEN`, `process.env.LINE_CHANNEL_SECRET`, `process.env.GEMINI_API_KEY` และ `process.env.GEMINI_API_SECRET` ด้วยค่าจริงที่คุณได้รับจาก LINE และ Gemini

**ขั้นตอนที่ 7: เริ่มต้น Bot**
รัน Bot โดยใช้คำสั่งต่อไปนี้:

```
node index.js
```

**ข้อสรุป**
ด้วยขั้นตอนเหล่านี้ คุณจะสามารถสร้าง LINE Bot ที่สามารถโต้ตอบกับผู้ใช้บนแพลตฟอร์ม LINE และทำการซื้อขายบน Gemini ได้ โดยใช้ API อย่างเป็นทางการของ Gemini
