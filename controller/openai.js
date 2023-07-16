const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const options = require("./../config");

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

exports.openai = async (req, res) => {
  try {
    let input = req.body.messages,
      index = Number(req.body.index);

    if(index === 3) {
      let optionsSplit = options[index - 1]["brief"].split("5");
    
      input = optionsSplit[0] + "5 " + input.toLowerCase() + "-related"  + optionsSplit[1];

    }else {
      input = options[index -1]['brief'] + " " + input.toLowerCase();
    }

    console.log("=========>", JSON.stringify(input))
    // return;
    let data = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `${input}`,
        },
      ],
    });

    let configData = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      data: data,
    };

    let result = [];

    axios
      .request(configData)
      .then((response) => {
       
        if (
          response.data &&
          response.data.choices &&
          response.data.choices.length
        ) {
          response.data.choices.map((e, i) => {
            result.push({ message: (e.message.content) });
          });
        }
        return res.send({
          status: 200,
          message: "Response from chatGPT",
          data: result,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};
