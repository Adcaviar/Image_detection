const express = require("express");
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");
const axios = require("axios");

const app = express();
app.use(express.json()); // 👈 支持 JSON 请求体

let _model;

app.post("/Ai_Img", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.send({ code: -1, msg: '请提供图片 URL', data: {} });
  }

  try {
    // 下载图片，响应为 ArrayBuffer 类型
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const image = await tf.node.decodeImage(response.data, 3); // 解码为 RGB 图像

    const predictions = await _model.classify(image);
    image.dispose();

    res.send({ code: 0, msg: "success", data: predictions });
  } catch (err) {
    console.error(err);
    res.send({ code: -1, msg: "图片处理失败", data: {} });
  }
});

const load_model = async () => {
  _model = await nsfw.load('file://./web_model/', { size: 299 }); // 确保模型路径正确
};

load_model().then(() => {
  app.listen(3006, () => {
    console.log("Service running on http://localhost:3006");
  });
});
