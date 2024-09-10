import {
  ConfigOptions,
  DeliveryType,
  ResourceType,
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary'
import { Payload, SanitizedCollectionConfig } from 'payload'
import streamifier from 'streamifier'

export class CloudinaryService {
  private config?: ConfigOptions
  private options?: UploadApiOptions
  private uploadResourceTypeHandler?: Function
  constructor(
    config?: ConfigOptions,
    options?: UploadApiOptions,
    uploadResourceTypeHandler?: Function,
  ) {
    this.config = config
    this.options = options
    this.uploadResourceTypeHandler = uploadResourceTypeHandler
  }
  async upload(
    filename: string,
    buffer: Buffer,
    payload: Payload,
    collectionConfig?: SanitizedCollectionConfig,
  ): Promise<UploadApiResponse> {
    console.log('FILE', filename)
    const _cfg = {
      ...this.config,
      api_key: this.config?.api_key || process.env.CLOUDINARY_API_KEY,
      api_secret: this.config?.api_secret || process.env.CLOUDINARY_API_SECRET,
      cloud_name: this.config?.cloud_name || process.env.CLOUDINARY_CLOUD_NAME,
      folder: this.config?.folder || process.env.CLOUDINARY_FOLDER,
    }

    cloudinary.config(_cfg)

    const type = checkFileType(filename)
    const _opts = {
      ...this.options,
    }
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          ..._opts,
          use_filename: true,
          resource_type: type,
          folder: this.config?.folder || process.env.CLOUDINARY_FOLDER,
        },
        (error: any, result: any) => {
          if (result) resolve(result)
          else reject(error)
        },
      )
      streamifier.createReadStream(buffer).pipe(uploadStream)
    })
    // return uploadPromise
  }
  async delete(
    public_id: string,
    options?: {
      resource_type?: ResourceType
      type?: DeliveryType
      invalidate?: boolean
    },
  ): Promise<any> {
    const _cfg = {
      ...this.config,
      api_key: this.config?.api_key || process.env.CLOUDINARY_API_KEY,
      api_secret: this.config?.api_secret || process.env.CLOUDINARY_API_SECRET,
      cloud_name: this.config?.cloud_name || process.env.CLOUDINARY_CLOUD_NAME,
    }

    cloudinary.config(_cfg)
    return cloudinary.uploader.destroy(public_id, options)
  }
}
// export function mediaManagement(
//   config?: ConfigOptions,
//   uploadApiOptions?: UploadApiOptions,
//   uploadResourceTypeHandler?: Function,
// ) {
//   const service = new CloudinaryService(config, uploadApiOptions, uploadResourceTypeHandler)
//   return (req: CloudinaryPluginRequest, _, next) => {
//     req.cloudinaryService = service
//     next()
//   }
// }

function checkFileType(fileName) {
  // Define arrays for video and image extensions
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm']
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp']
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma']

  console.log('FILE', fileName)
  // Extract the file extension from the file name
  const fileExtension = fileName.split('.').pop().toLowerCase()

  // Check if the file extension is in the video or image arrays
  if (videoExtensions.includes(fileExtension)) {
    return 'video'
  } else if (imageExtensions.includes(fileExtension)) {
    return 'image'
  } else {
    return 'raw'
  }
}
