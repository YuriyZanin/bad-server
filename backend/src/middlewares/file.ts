import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import BadRequestError from '../errors/bad-request-error'
import { FILE_CONFIG } from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const uploadTempDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

fs.mkdirSync(uploadTempDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, uploadTempDir)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, uuidv4() + extname(file.originalname))
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    if (_req.headers['content-length'] === undefined) {
        return cb(new BadRequestError('Ошибка загрузки файла'))
    }

    const fileSize = parseInt(_req.headers['content-length'], 10)
    if (fileSize < FILE_CONFIG.minSize) {
        return cb(
            new BadRequestError(
                'Файл не удовлетворяет требованиям по минимальному размеру'
            )
        )
    }
    if (fileSize > FILE_CONFIG.maxSize) {
        return cb(
            new BadRequestError(
                'Файл не удовлетворяет требованиям по максимальному размеру'
            )
        )
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter })
