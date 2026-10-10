export async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // File type check (video vs image)
  const isVideo = file.type.startsWith('video');
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? 'video' : 'image'}/upload`;

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.secure_url; // Direct fast CDN link
}