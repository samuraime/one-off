import Koa from 'koa';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import routes from './routes';

const app = new Koa();
const { PORT } = process.env;

app.use(helmet());
app.use(cors());
app.use(routes);

app.listen(PORT);
console.log('Listening on port %d', PORT);
