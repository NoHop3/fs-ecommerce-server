import { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IGetUserAuthInfoRequest extends Request {
  user?: any
}

export const hasWriteAccess = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user.hasWriteAccess) {
    next()
  } else {
    res.status(400).json({
      message:
        'Operation unsuccessful, you are not allowed to write to the database!',
    })
  }
}
