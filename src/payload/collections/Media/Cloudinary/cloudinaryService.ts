import {
  ConfigOptions,
  DeliveryType,
  ResourceType,
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary'
import { Payload } from 'payload'
import { SanitizedCollectionConfig } from 'payload/types'
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
    const _cfg = {
      ...this.config,
      api_key: this.config?.api_key || process.env.CLOUDINARY_API_KEY,
      api_secret: this.config?.api_secret || process.env.CLOUDINARY_API_SECRET,
      cloud_name: this.config?.cloud_name || process.env.CLOUDINARY_CLOUD_NAME,
    }

    cloudinary.config(_cfg)

    const _opts = {
      ...this.options,
    }

    var encoding = 'base64'
    var base64Data = buffer.toString('base64')
    var fileUri = 'data:' + 'application/octet-stream' + ';' + encoding + ',' + base64Data

    try {
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          var result = cloudinary.uploader
            .upload(fileUri, {
              invalidate: true,
            })
            .then((result) => {
              console.log(result)
              resolve(result)
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        })
      }

      const result: any = await uploadToCloudinary()

      return result
      // let imageUrl = result.secure_url

      // return NextResponse.json({ success: true, imageUrl: imageUrl }, { status: 200 })
    } catch (error) {
      console.log('server err', error)
      throw new Error(JSON.stringify(error))
      // return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 })
    }
    // return new Promise((resolve, reject) => {
    //   const uploadStream = cloudinary.uploader.upload_stream(
    //     {
    //       ..._opts,
    //     },
    //     (error: any, result: any) => {
    //       if (result) resolve(result)
    //       else reject(error)
    //     },
    //   )
    //   streamifier.createReadStream(buffer).pipe(uploadStream)
    // })
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
