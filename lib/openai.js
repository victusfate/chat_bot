import axios from 'axios'
import config from './config.js'


class OpenAI {
  static countTokens = (text) => {
    // This is a simplified token counting approach
    // It may not be accurate for all languages and edge cases
    const words = text.split(/\s+/);
    let tokenCount = 0;

    words.forEach((word) => {
      const wordLength = word.length;
      tokenCount += Math.ceil(wordLength / 4) + 1;
    });

    return tokenCount;
  }

  static askOpenAI = async (aMessages) => {
    try {
      // console.log({aMessages: aMessages})
      if (OpenAI.countTokens(JSON.stringify(aMessages)) > 4000) {
        return 'Prompt length exceeds max';
      }
      const url = 'https://api.openai.com/v1/chat/completions'
      const response = await axios.post(url, {
        messages: aMessages,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
        model: 'gpt-3.5-turbo'
      }, {
        headers: {
          'Authorization': `Bearer ${config.openai.key}`,
          'Content-Type': 'application/json',
        },
      });
      
      // return response.data.choices[0].text.trim();
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error in askOpenAI:', error);
      return 'An error occurred while processing your request.';
    }
  }
}

export default OpenAI