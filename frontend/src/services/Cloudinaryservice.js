
const CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET1 = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET1;
const UPLOAD_PRESET2 = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET2;

export async function subirImagen(file, folder, type) {
    if (!CLOUD_NAME || !UPLOAD_PRESET1 || !UPLOAD_PRESET2){
        throw new Error('Faltan configuraciones de env.');
    }

    const formData = new FormData();
    formData.append('file', file);
    if ( type === 'noticias'){
        formData.append('upload_preset', UPLOAD_PRESET1);
    }else {
        formData.append('upload_preset', UPLOAD_PRESET2);
    }
    if (folder) formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{
        method: 'POST',
        body: formData
    });

    if(!response.ok){
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || 'Error al subir imagen');
    }

    const data = await response.json();
    return data.secure_url;
}

export async function subirImagenes(files, folder, type) {
    return Promise.all(files.map((file) => subirImagen(file,folder,type)));
}