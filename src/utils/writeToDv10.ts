import fs from "fs";
export const dv10Url = "https://cloudinary-dv10-api.vercel.app/api/list-media";
export const shadowHiveUrl = "https://shadowhive-api.vercel.app/api/list-media";

type CloudinaryResource = {
  secure_url: string;
};

const isCloudinaryResource = (
  resource: unknown
): resource is CloudinaryResource =>
  typeof resource === "object" &&
  resource !== null &&
  "secure_url" in resource &&
  typeof resource.secure_url === "string";

export const fetchCloudinaryImages = async (
  backendUrl: string
): Promise<string[]> => {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    const data: unknown = await response.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("resources" in data) ||
      !Array.isArray(data.resources)
    ) {
      throw new Error("Cloudinary response did not contain a resources array");
    }

    return data.resources
      .filter(isCloudinaryResource)
      .map((resource) => resource.secure_url);
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
