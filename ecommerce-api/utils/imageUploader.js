const cloudinary = require('cloudinary').v2


const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const imageUploader = (image) => {
    try {
        if(Array.isArray(image)){
            res.status(400)
            throw new Error('Only one image is valid')
        }

        if (!allowedMimeTypes.includes(image.mimetype)) {
            res.status(400);
            throw new Error("Invalid file type. Only JPEG, JPG, and PNG files are allowed");
        }

        const uploadedImage = cloudinary.uploader.upload(image.tempFilePath,(err,result) => {
            if(err){
                res.status(400)
                throw new Error('Error while uploading image, Please try again!')
            }
            return result
        })

        return uploadedImage
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = imageUploader