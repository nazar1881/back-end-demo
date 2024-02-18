import express, {Request, Response} from 'express'

const app = express()
const port = 3000

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
  courses: [
    {id: 1, title: 'front-end'},
    {id: 2, title: 'back-end'},
    {id: 3, title: 'automation qa'},
    {id: 4, title: 'devops'}
  ]
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World !!!')
})

app.get('/courses', (req: Request, res: Response) => {
  let foundCourses = db.courses;

  if(req.query.title) {
    foundCourses = foundCourses.filter( c => c.title.indexOf(req.query.title as string) > -1)
  }

  res.json(foundCourses)
})

app.get('/courses/:id', (req: Request, res: Response) => {
  const foundCourse = db.courses.find(c => c.id === +req.params.id)

  if(!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  
  res.json(foundCourse)
})

app.post('/courses', (req: Request, res: Response) => {
  if(!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const createadCourse = {
    id: +(new Date()),
    title: req.body.title
  }
  db.courses.push(createadCourse)
  res.status(HTTP_STATUSES.CREATED_201).json(createadCourse)
})

app.delete('/courses/:id', (req: Request, res: Response) => {
  const foundCourse = db.courses.find(c => c.id === +req.params.id)

  if(!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  } else {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/courses/:id', (req: Request, res: Response) => {
  if(!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return;
  }

  const foundCourse = db.courses.find(c => c.id === +req.params.id)

  if(!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  foundCourse.title = req.body.title;
  
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})