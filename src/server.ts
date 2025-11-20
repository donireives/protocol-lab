import app from './app';
import { env } from './config/env';

const { port } = env;

app.listen(port, () => {
  console.log(`protocol-lab server is running at http://localhost:${port}`);
});
