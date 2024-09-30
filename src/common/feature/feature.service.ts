import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature } from 'src/models/feature.entity';
import { Repository } from 'typeorm';
import { CommonDot } from './dto/common.dto';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async addFeature(commonDot: CommonDot) {
    try {
      const featureImages = new Feature();
      featureImages.image = commonDot.image;

      await this.featureRepository.save(featureImages);
      return {
        success: true,
        data: featureImages,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAllFeatures() {
    try {
      const images = await this.featureRepository.find();
      return {
        success: true,
        data: images,
      };
    } catch (error) {
      console.log(error.message);
    }
  }
}
