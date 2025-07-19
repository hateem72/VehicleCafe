import 'dotenv/config';
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadToImageKit = async (file) => {
  try {
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `parking-${Date.now()}.jpg`,
      folder: "/vehiclecafe"
    });
    return { url: result.url, publicId: result.fileId };
  } catch (err) {
    throw new Error("Image upload failed!");
  }
};