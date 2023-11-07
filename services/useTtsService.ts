import axios from 'axios';

// Define the interface for the parameters accepted by OpenAI's API
interface OpenAiAudioParams {
  model: string;
  input: string;
  voice: string;
}

/**
 * Fetches audio from OpenAI's text-to-speech service and returns an HTMLAudioElement.
 *
 * @param {string} text - The text to be converted into speech.
 * @param {string} apiKey - Your OpenAI API key.
 * @returns {Promise<HTMLAudioElement | null>} A promise that resolves to an HTMLAudioElement
 *          containing the audio representation of the input text, or null if an error occurs.
 */
export async function fetchAudioFromOpenAI(
  text: string,
  apiKey: string,
): Promise<HTMLAudioElement | null> {
  const params: OpenAiAudioParams = {
    model: 'tts-1',
    input: text.replace(/\n\n/g, '. ').replace(/\n-/g, '. '), // Simple fix to pause in-between bulletpoints
    voice: 'alloy',
  };

  return await axios
    .post('https://api.openai.com/v1/audio/speech', params, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      responseType: 'blob', // Set the expected response type to 'blob'
    })
    .then((response) => {
      const objectUrl = URL.createObjectURL(response.data);
      const audio = new Audio(objectUrl);
      return audio;
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log(error.response.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      return null; // Return null to indicate that an error occurred
    });
}

// Example usage:
// const apiKey = 'your-openai-api-key';
// fetchAudioFromOpenAI('Today is a wonderful day to build something people love!', apiKey)
//   .then(audio => {
//     if (audio) {
//       audio.play();
//     }
//   })
//   .catch(error => console.error('Failed to play audio:', error));
