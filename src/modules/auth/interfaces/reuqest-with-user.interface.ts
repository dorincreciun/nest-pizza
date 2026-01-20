import {JwtPayloadInterface} from "./jwt-payload.interface";
import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: JwtPayloadInterface
}