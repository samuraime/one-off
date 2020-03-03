import Router from 'koa-router';
import body from 'koa-body';
import kgHandler from './kg';

const router = new Router();

router.use(body());
router.post('/kg', kgHandler);

const routes = router.routes();

export default routes;
