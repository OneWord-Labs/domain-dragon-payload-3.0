import { Field, PayloadRequest } from 'payload/types'
import { CloudinaryService } from './cloudinaryService'

export declare type PluginConfig = {
  cloudinaryFields: Array<string | Partial<Field>>
}

export declare type CloudinaryPluginRequest = PayloadRequest & {
  cloudinaryService: CloudinaryService
}
