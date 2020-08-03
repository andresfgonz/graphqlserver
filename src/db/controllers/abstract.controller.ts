import { Document, Model } from 'mongoose';

export class AbstractController<T extends Document> {
  constructor(protected model: Model<T, {}>) {
  }

  findbyId(documentId: string): Promise<T> {
    return this.model.findById(documentId).exec();
  }

  findAll(): Promise<T[]> {
    return this.model.find({}).exec();
  }

  findInArray(ids: string[]): Promise<T[]> {
    return this.model.find().exec();
  }

  create(document: Partial<T>): Promise<T> {
    return new this.model(document).save();
  }

  delete(documentId: string) {
    return this.model.findByIdAndDelete(documentId).exec();
  }
}
