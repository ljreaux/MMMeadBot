const backendUrl = "https://cloudinary-dv10-api.vercel.app/api/list-media";

export const fetchCloudinaryImages = async (): Promise<string[]> => {
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

export const dv10 = async (): Promise<string> => {
  try {
    const images = await fetchCloudinaryImages();

    if (images.length) {
      return images[Math.floor(Math.random() * images.length)];
    } else {
      throw new Error("No images found in the Cloudinary folder.");
    }
  } catch (err) {
    console.error(err);
    return "No images available.";
  }
};
