import fs from "fs";
export const dv10Url = "https://cloudinary-dv10-api.vercel.app/api/list-media";
export const shadowHiveUrl = "https://shadowhive-api.vercel.app/api/list-media";

export const fetchCloudinaryImages = async (
  backendUrl: string
): Promise<string[]> => {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    const data = await response.json();
    const images = data.resources
      .filter((resource: { secure_url: string }) => resource.secure_url)
      .map((resource: { secure_url: string }) => resource.secure_url);

    return images;
  } catch (err) {
    console.error("Error fetching Cloudinary images:", err);
    return [];
  }
};

export const writeToTextFile = async (arr: string[], fileName: string) => {
  try {
    const fileString = arr.join("\n");
    fs.writeFileSync(fileName, fileString);
    console.log(`Images written to ${fileName}`);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};

const getImageList = (fileName: string) => {
  try {
    const data = fs.readFileSync(fileName, "utf8").split("\n");
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchMemes = async (
  fileName: string,
  num: number | null
): Promise<string> => {
  try {
    const images = getImageList(fileName);

    if (images.length) {
      const randomNum = num ?? Math.floor(Math.random() * images.length);
      let randomImg: string;

      if (randomNum < images.length) {
        randomImg = images[randomNum];
      } else {
        randomImg = "The image you're looking for does not exist";
      }

      if (!randomImg) throw new Error("File error.");

      return randomImg;
    } else {
      throw new Error("No images found in the Cloudinary folder.");
    }
  } catch (err) {
    console.error(err);
    return "No images available.";
  }
};
