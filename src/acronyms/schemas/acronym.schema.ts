import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AcronymDocument = Acronym & Document;

@Schema()
export class Acronym {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  description: string;
}

export const AcronymSchema = SchemaFactory.createForClass(Acronym);