import axios from "./axios";

const userId = 101;

class ChatGPT {
  async getChatResponse({ message }) {
    const response = await axios.post(`/chat/${userId}`, { message });
    return response.data;
  }
}

const chat = new ChatGPT();

export default chat;
