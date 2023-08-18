const db = require('../../data/dbConfig')

module.exports = {
    findBy,
    add,
    findById
}


function findBy(filter) {
    const user =  db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where(filter)
    .first()
    .then((value) => {
        return value
    })
    return user
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
    // const [id] = await db('users').insert(user)
    // return findById(id)
}

function findById(id) {
    return db('users as u')
    .select('u.id', 'u.username')
    .where('u.id', id)
    .first()
}
