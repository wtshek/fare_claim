import { user } from '../utils/localForageInstance'
async function auth({ store, redirect }) {
  // TODO: auth logic
  const jwt = await user.getItem('jwt-token')

  if (!jwt) {
    return redirect('/login')
  }

  // need to fix the index page
}

export default auth
