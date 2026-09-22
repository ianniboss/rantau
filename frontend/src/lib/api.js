import axios from 'axios';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Uploads to Emergent object storage via the FastAPI backend; returns an absolute file URL.
export async function uploadFile(file, uid) {
  const form = new FormData();
  form.append('file', file);
  form.append('uid', uid || 'anonymous');
  const { data } = await axios.post(`${BACKEND_URL}/api/upload`, form);
  return { ...data, url: `${BACKEND_URL}${data.url}` };
}
