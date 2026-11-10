import { Hono } from 'hono'
const app = new Hono()

async function authMiddleware(c: any, next: any) {
  //c here is ~ context of this request ~ request(req) and response(res) objects together
  if (c.req.header("Authorization")) {
    // Do validation
    next();
  } else {
    return c.text("You dont have access");
  }
}

app.get('/', (c) => {
  console.log(c); console.log(' ');
  console.log(c.req); console.log(' ');
  console.log(c.res);
  return c.text('Hello Hono get!')
})

app.post('/user', (c) => {
  return c.text('Hello Hono post!')
})

//Getting inputs from user
app.post('/', authMiddleware, async (c) => {
  const body = await c.req.json()
  console.log('body : ', body);
  console.log('Authorization header : ', c.req.header("Authorization"));
  console.log('Query parameter : ', c.req.query("param"));

  return c.text('Hello Hono!')
})

export default app
