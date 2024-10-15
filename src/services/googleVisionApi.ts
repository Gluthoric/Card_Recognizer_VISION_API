import axios from 'axios';

const API_KEY = 'AIzaSyBHkqAsUNFkEyJH2xTYT_GULc9JmMOeFUo';
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export async function recognizeCardName(imageFile: File): Promise<string | null> {
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await axios.post(API_URL, requestBody);
    const textAnnotations = response.data.responses[0]?.textAnnotations;
    
    if (textAnnotations && textAnnotations.length > 0) {
      // Extract the card name from the recognized text
      // This is a simple example and might need to be improved based on the card layout
      const cardName = textAnnotations[0].description.split('\n')[0];
      return cardName;
    } else {
      console.warn('No text annotations found in the image');
      return null;
    }
  } catch (error) {
    console.error('Error recognizing card name:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}