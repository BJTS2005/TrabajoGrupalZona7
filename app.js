import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
//import magnitudesRouter from './routes/magnitudes.js';
//import unidadesRouter from './routes/unidades.js';
//import indicadoresRouter from './routes/indicadores.js';
import campusRouter from './routes/campus.route.js';
import vehiculosRouter from './routes/vehiculos.route.js';
import shuttlesRouter from './routes/shuttles.route.js';
import infraTransRouter from './routes/infraTrans.route.js';
import eventosRouter from './routes/eventos.route.js';
import sitiosWebRouter from './routes/sitiosWeb.route.js';
import greenJobsRouter from './routes/greenJobs.route.js';
import cursosRouter from './routes/cursos.route.js';
import categoriasRouter from './routes/categorias.router.js';
import miembrosRouter from './routes/miembros.route.js';
import indicadoresRouter from './routes/indicadores.route.js';
import reportesRouter from './routes/reporte.route.js';
import authRouter from './routes/auth.route.js';
import { validateToken } from './middlewares/validarToken.middleware.js';

console.log("hola");

const app = express();

// view engine setup
app.set('views', path.join(path.resolve(), 'views')); // path.resolve() para __dirname en ES Modules
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extends: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), 'public')));


app.use('/inicio', authRouter);

app.use(validateToken);

app.use('/', indexRouter);
//app.use('/magnitudes', magnitudesRouter);
//app.use('/unidades', unidadesRouter);
//app.use('/indicadores', indicadoresRouter);
app.use('/campus', campusRouter);
app.use('/vehiculos', vehiculosRouter);
app.use('/shuttles', shuttlesRouter);
app.use('/infra-transporte', infraTransRouter);
app.use('/eventos-sostenibles',eventosRouter);
app.use('/sitiosWeb', sitiosWebRouter);
app.use('/greenJobs', greenJobsRouter);
app.use('/cursos', cursosRouter);
app.use('/categorias', categoriasRouter);
app.use('/miembros', miembrosRouter);
app.use('/indicadores', indicadoresRouter);
app.use('/reportes', reportesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).render('404.ejs');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
