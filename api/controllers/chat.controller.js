import Chat from "../models/chat.model.js";
import createError from "../utils/createError.js";

export const createChat = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    let chat = await Chat.findOne({
      participants: { $all: [req.userId, recipientId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.userId, recipientId],
        messages: []
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return next(createError(404, "Chat not found!"));

    chat.messages.push({ sender: req.userId, content });
    await chat.save();
    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.userId }).populate("participants", "username");
    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};