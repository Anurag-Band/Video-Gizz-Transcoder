import multer from 'multer'
import { v4 as uuid } from 'uuid'

const multerConfig = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./uploads/`)
        },
        filename: function (req, file, cb) {
            const fileExtension = file.originalname.split('.').pop()
            cb(null, `${Date.now()}-${uuid()}.${fileExtension}`)
        },
    })

    const upload = multer({ storage })

    return upload
}

export const uploader = (fields) => {
    return (req, res, next) => {
        const upload = multerConfig()

        let isUploaded;

        if (Array.isArray(fields)) {
            // Handle multiple fields
            isUploaded = upload.fields(fields)
        } else {
            // Handle single field for backward compatibility
            isUploaded = upload.single(fields)
        }

        isUploaded(req, res, function (error) {
            if (error) {
                return res
                    .status(400)
                    .json({ error: error.message ?? 'File upload failed!' })
            }
            next()
        })
    }
}
