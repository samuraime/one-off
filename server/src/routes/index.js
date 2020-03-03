import Router from 'koa-router';
import kgHandler from './kg';

const router = new Router();

router.post('/kg', kgHandler);

const routes = router.routes();

export default routes;
