import { storage } from '@/lib/firebase';
import {
  ref,
  uploadBytes as firebaseUploadBytes,
  getDownloadURL,
  StorageReference,
} from 'firebase/storage';

/**
 * Uploads a blob to Firebase Storage.
 */
async function uploadToStorage(imageRef: StorageReference, blob: Blob) {
  return await firebaseUploadBytes(imageRef, blob);
}

/**
 * Uploads an image from a local URI to Firebase Storage.
 * @param uri - The local URI of the image.
 * @param name - The desired name of the file in Firebase Storage.
 * @param folder - The folder to upload the image in.
 * @returns An object with the download URL and file metadata.
 */
async function upload(
  uri: string,
  name: string,
  folder: string = 'images'
): Promise<{ downloadURL: string; metadata: any }> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const imageRef = ref(storage, `${folder}/${name}`);
  const result = await uploadToStorage(imageRef, blob);
  const downloadURL = await getDownloadURL(result.ref);
  const metadata = result.metadata;

  return { downloadURL, metadata };
}

export default {
  upload,
};
