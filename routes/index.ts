import * as express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const router = express.Router();

interface IViewResponse {
    view: string
    data?: object
}

type ParamsFunction = (req: Request, res: Response, next?: NextFunction) => any[]
type ControllerFunction = (...args: any[]) => Promise<IViewResponse>

/**
 * Handles controller execution and responds to user.
 * This way controllers are not attached to the API.
 * @param promise Controller Promise.
 * @param params (req) => [params, ...].
 */
const controllerHandler = (promise: ControllerFunction, params: ParamsFunction) => async (req: Request, res: Response, next?: NextFunction) => {
    const boundParams = params ? params(req, res, next) : [req, res, next];
    try {
        const result = await promise(...boundParams);
        return res.render(result.view, result.data);
    } catch (error) {
        return res.status(500) && next(error);
    }
};

// Convenient short-hand version
const c = controllerHandler;


export default router;
