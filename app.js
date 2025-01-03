import { Application, Session } from "./deps.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { allowCORS } from "./middlewares/cors.js";
import { router } from "./routes/routes.js";
import { createAdmin } from "./services/createAdmin.js";

const app = new Application();
app.use(Session.initMiddleware());

app.use(allowCORS);
app.use(errorMiddleware);
app.use(authMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(router.routes());

await createAdmin();

app.listen({ port: 7777 });
