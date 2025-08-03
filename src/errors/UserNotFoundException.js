class UserNotFoundException extends Error {
    constructor() {
        super('User not found.')
        this.name = "UserNotFoundException"
    }
}

export default UserNotFoundException;