'use strict'

class AppController {

    index({ auth }) {
        const { id, username, email } = auth.user

        return { 
            message: 'Welcome to API', 
            user: {
                id, 
                username, 
                email
            } 
        };
    }
}

module.exports = AppController
