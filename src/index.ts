import { verify } from 'jsonwebtoken'
import type { RequestHandler } from 'express'

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
        user?: SessionUser
      }
    }
  }

const authMiddleware: RequestHandler = (req, res, next) => {
    req.user = new SessionUser();
    if (req.headers
        && req.headers.authorization
        && req.headers.authorization.startsWith("Bearer ")
        && process.env.JWT_SECRET) {
        const token = req.headers.authorization.slice(7, req.headers.authorization.length);
        verify(token, process.env.JWT_SECRET, function (err: unknown, decode: unknown) {
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

export default authMiddleware;
