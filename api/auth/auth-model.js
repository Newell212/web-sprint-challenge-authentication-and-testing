const db = require('../../data/dbConfig')

module.exports = {
    findBy,
    add,
    findById
}


function findBy(filter) {
    return db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where(filter)
}

async function add(user) {
    return await db('users').insert(user).then((id) => {
        return db('users').where('id', id).first()
      })
    // const [id] = await db('users').insert(user)
    // return findById(id)
}

function findById(id) {
    return db('users as u')
    .select('u.id', 'u.username')
    .where('u.id', id)
    .first()
}
