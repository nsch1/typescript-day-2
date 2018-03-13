import 'reflect-metadata'
import {createKoaServer, Action} from "routing-controllers"
import PageController from "./pages/controller"
import UserController from './users/controller'
import LoginsController from './logins/controller'
import {verify} from './jwt'
import setupDb from './db'

const port = process.env.PORT || 4000

const app = createKoaServer({
   controllers: [
     PageController,
     UserController,
     LoginsController
   ],
   authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const [ , token ] = header.split(' ')
      return !!(token && verify(token))
    }

    return false
  }
})

setupDb()
  .then(_ => {
    app.listen(port, () => console.log(`Listening on port ${port}`))
  })
  .catch(err => console.error(err))