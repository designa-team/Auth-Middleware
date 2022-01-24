import { verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export class SessionUser {
    constructor(public user?: string) {
    }

    get() {
        return this.user ? JSON.parse(this.user) : undefined;
    }
  }

declare global {
    namespace Express {
      interface Request {
        user: SessionUser
      }
    }
  }

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.user = new SessionUser();
    if (req.headers
        && req.headers.authorization
        && req.headers.authorization.startsWith("Bearer ")
        && process.env.JWT_SECRET) {
        const token = req.headers.authorization.slice(7, req.headers.authorization.length);
        verify(token, process.env.JWT_SECRET, function (err, decode) {
            if (!err) {
              req.user = new SessionUser(JSON.stringify(decode));
              next();
            } else {
                res.status(403).json({ message: "unauthorized" });
            }
        });
    } else {
        res.status(403).json({ message: "unauthorized" });
    }
}

module.exports = authMiddleware;