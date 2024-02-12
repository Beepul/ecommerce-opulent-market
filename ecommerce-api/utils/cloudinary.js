const cloudinary = require('cloudinary').v2


const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const imageUploader = async (image,folderName) => {
    try {
        if(Array.isArray(image)){
            res.status(400)
            throw new Error('Only one image is valid')
        }

        if (!allowedMimeTypes.includes(image.mimetype)) {
            res.status(400);
            throw new Error("Invalid file type. Only JPEG, JPG, and PNG files are allowed");
        }

        const uploadOptions = { folder: folderName };

        const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath,uploadOptions)

        return uploadedImage
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// Helper function to extract public ID from Cloudinary URL
const getImagePublicId = (imageUrl) => {
    const parts = imageUrl.split('/')
    const publicId = parts[parts.length - 1].split('.')[0]
    return publicId
};

// Helper function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId,folderName) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        res.status(500)
        throw new Error(error)
    }
};

module.exports = {imageUploader,getImagePublicId,deleteImageFromCloudinary}