import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ImagesService } from './images.service';
import { FileUpload } from 'graphql-upload';
import { ImageUpdateInput } from './dto';

@Resolver('Image')
export class ImagesResolver {
  constructor(private readonly imagesService: ImagesService) { }

  @Mutation('uploadImage')
  uploadImage(@Args({ name: 'file' }) file: FileUpload) {
    return this.imagesService.upload(file);
  }

  @Mutation('updateImage')
  updateImage(@Args('updateImageInput') input: ImageUpdateInput) {
    return this.imagesService.updateImage(input);
  }

  @Query('images')
  findAll() {
    return this.imagesService.findAll();
  }

  @Query('image')
  findOne(@Args('id') id: number) {
    return this.imagesService.findOne(id);
  }

  @Mutation('removeImage')
  remove(@Args('id') id: number) {
    return this.imagesService.remove(id);
  }
}
