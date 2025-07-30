import { serve } from '@hono/node-server';
import app from './index';

serve(app, ({ port = 3000 }) => {
  console.log(`Hono server listening at http://localhost:${port}`);
});
