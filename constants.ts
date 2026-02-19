const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

/** Maximum image upload size in bytes (5 MB), matching backend limit. */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export { emailRegex, BASE_URL, WEB_CLIENT_ID, IOS_CLIENT_ID, MAX_IMAGE_SIZE };
