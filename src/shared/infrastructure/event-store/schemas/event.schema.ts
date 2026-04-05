import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class EventDocument {
  @Prop()
  streamId: string;

  @Prop()
  type: string;

  @Prop()
  position: number;

  @Prop({ type: SchemaTypes.Mixed })
  data: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);
EventSchema.index({ streamId: 1, position: 1 }, { unique: true });
