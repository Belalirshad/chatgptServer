const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const options = require("./../config");

const configuration = new Configuration({
  apiKey: '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',
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

    // console.log("======>", apiKey);
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
           // Handle API error response
    if (error.response) {
      if (error.response.status === 401) {
        // Handle 401 Unauthorized Error
        if (error.response.data && error.response.data.error) {
          res.status(401).send({ message: error.response.data.error });
        } else {
          res.status(401).send({ message: "Unauthorized: Please check your API credentials." });
        }
      } else {
        // Handle other errors with status code and data from API
        res.status(error.response.status).send({ message: error.response.data });
      }
    } else {
      // Handle other errors (network, client, etc.)
      res.status(500).send({ message: "Something went wrong. Please try again later." });
    }
      });
  } catch (err) {
    console.log(err)
    return res.status(500).send({ status: 500, message: err.message });
  }
};
