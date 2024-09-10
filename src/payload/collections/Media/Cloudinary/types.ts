import { Field, PayloadRequest } from 'payload'
import { CloudinaryService } from './cloudinaryService'

export declare type PluginConfig = {
  cloudinaryFields: Array<string | Partial<Field>>
}

export declare type CloudinaryPluginRequest = PayloadRequest & {
  cloudinaryService: CloudinaryService
}
