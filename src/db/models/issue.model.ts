import { Schema, model, Document } from 'mongoose';
import { Issue } from '@appTypes';

export interface IssueModel extends Issue, Document {}

const issueSchema = new Schema({
  name: { type: String, required: true },
});

export const IssueModel = model<IssueModel>('issue', issueSchema);
