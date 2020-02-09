'use strict'

const User = use('App/Models/User')

class AuthController {

    async register({ request }) {
        const data = request.only(['name', 'email', 'password'])

        const user = await User.create(data)

        return user
    }

    async authenticate({ request, auth }) {
        const { email, password } = request.all()

        const token = await auth.attempt(email, password)
        const user = await User.findBy('email', email)

        return { ...(user.toJSON()), ...token }
    }
}

module.exports = AuthController
