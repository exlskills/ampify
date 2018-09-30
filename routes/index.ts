import * as express from 'express';
import { getCourseSectionCard } from '../controllers/course-section-cards';
import { Request, Response, NextFunction } from 'express';
import {fromUrlId} from "../utils/url-ids";
import {getGQLToken} from "../lib/anon";
import GqlApi from "../lib/gql-api";

const router = express.Router();
let gqlToken = '';
let gqlClient: GqlApi = null;

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
const gqlBaseControllerHandler = (promise: ControllerFunction, params: ParamsFunction) => async (req: Request, res?: Response, next?: NextFunction) => {
    if (!gqlToken) {
        gqlToken = await getGQLToken()
    }
    if (!gqlClient) {
        gqlClient = new GqlApi(gqlToken)
    }
    const initialParams = params ? params(req, res, next) : [req, res, next];
    let boundParams = [gqlClient]
    boundParams.push(...initialParams)
    try {
        const result = await promise(...boundParams);
        return res.render(result.view, result.data);
    } catch (error) {
        return res.status(500) && next(error);
    }
};

// Convenient short-hand version
const gc = gqlBaseControllerHandler;

router.get('/health-check', (req, res) => res.sendStatus(200))
router.get('/amp/learn-:locale/courses/:course/units/:unit/sections/:section/card/:card', gc(getCourseSectionCard, req => [req.params.locale, fromUrlId('Course', req.params.course), fromUrlId('CourseUnit', req.params.unit), req.params.unit, fromUrlId('UnitSection', req.params.section), req.params.section, fromUrlId('SectionCard', req.params.card)]))

export default router;
