import { storage } from '@/lib/firebase';
import { ref, uploadBytes as firebaseUploadBytes, getDownloadURL, StorageReference } from 'firebase/storage';

async function uploadBytes(ImageRef: StorageReference, blob: Blob) {
    return await firebaseUploadBytes(ImageRef, blob);
}

async function upload(uri: string, name: any, stringParam: any): Promise<{ downloadURL: string, metadata: any }> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ImageRef = ref(storage, `images/${name}`);
    const result = await uploadBytes(ImageRef, blob);
    const downloadURL = await getDownloadURL(result.ref);
    const metadata = result.metadata;

    return { downloadURL, metadata };
}

export default {
    upload,
};

