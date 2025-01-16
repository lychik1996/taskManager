import { Models } from 'node-appwrite';
export type TokenType = Models.Document & {userId:string, token:string}