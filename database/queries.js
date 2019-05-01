const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'garyguan',
//   host: 'localhost',
//   database: 'postgres',
//   port: 5432,
// })

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sidebar',
  password: 'a81884855',
  port: 5432,
  agent: false
})

// const createTable = (cb) => {
//   pool.query(
//   'CREATE TABLE IF NOT EXISTS info (ID SERIAL PRIMARY KEY, address VARCHAR(1200), neighborhood VARCHAR(145), crossStreet VARCHAR(160), parking VARCHAR(480), dinning VARCHAR(150), cuisines VARCHAR(40), hours VARCHAR(40), phone VARCHAR(40), website VARCHAR(40), payment VARCHAR(40), dress VARCHAR(40), chef VARCHAR(40), catering VARCHAR(380), privateFacilities VARCHAR(380))',
//   (error, results) => {
//     if (error) {
//       throw error
//     }
//     cb('create a table info')
//   })
// }

// const getSidebar = (cb) => {
//   pool.query('SELECT * FROM info ORDER BY id ASC', (error, results) => {
//     if (error) {
//       throw error
//     }
//     cb(results.rows);
//   })
// }

const getSidebarById = (id, cb) => {
  pool.query('SELECT * FROM sidebar where _id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    cb(results.rows);
  })
}

const createSidebar = (data, cb) => {
  const { name, address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities, costRange, description, rating, reviewCount, tags } = data
  pool.query('INSERT INTO restaurant (name) VALUES ($1)', [ name ], (error, results) => {
    if (error) {
      throw error
    }
      pool.query('INSERT INTO sidebar (address, neighborhood, "crossStreet", parking, dining, cuisines, hours, phone, website, payment, dress, chef, catering, "privateFacilities") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities], (error, results) => {
        if (error) {
          throw error
        }
        pool.query('INSERT INTO overview ("costRange", description, name, rating, "reviewCount", tags, cuisine) VALUES ($1, $2, $3, $4, $5, $6, $7)', [ costRange, description, name, rating, reviewCount, tags, cuisines ], (error, results) => {
          if (error) {
            throw error
          }
          cb('success');
      });
    });
  });
}

// const updateSidebar = (req, cb) => {
//   const id = parseInt(req.params.id)
//   const { address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities } = req

//   pool.query('UPDATE sidebar SET address = $1, neighborhood = $2, crossStreet = $3, parking = $4, dinning = $5, cuisines = $6, hours=$7, phone=$8, website=$9, payment=$10, dress=$11, chef=$12, catering=$13, privateFacilities=$14 WHERE id = $15',
//     [address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       cb(`User modified with ID: ${id}`)
//     }
//   )
// }

const deleteRestaurant = (id, cb) => {
  pool.query('DELETE FROM restaurant WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    cb(`User deleted with ID: ${id}`)
  })
}

const getOverviewById = (id, cb) => {
pool.query('SELECT * FROM overview where _id = $1', [id],(error, results) => {
    if (error) {
      throw error
    }
    cb(results.rows);
  })
}
  // pool.query('SELECT * FROM sidebar join overview on overview.id = sidebar.id WHERE sidebar.id = $1', [id], (error, results) => {

// const createOverview = (req, cb) => {
//   const { address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities } = req
//   pool.query('INSERT INTO overview (address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities], (error, results) => {
//     if (error) {
//       throw error
//     }
//     cb('success');
//   })
// }

// const updateOverview = (req, cb) => {
//   const id = parseInt(req.params.id)
//   const { address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities } = req

//   pool.query(
//     'UPDATE overview SET address = $1, neighborhood = $2, crossStreet = $3, parking = $4, dinning = $5, cuisines = $6, hours=$7, phone=$8, website=$9, payment=$10, dress=$11, chef=$12, catering=$13, privateFacilities=$14 WHERE id = $15',
//     [address, neighborhood, crossStreet, parking, dinning, cuisines, hours, phone, website, payment, dress, chef, catering, privateFacilities, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       cb(`User modified with ID: ${id}`)
//     }
//   )
// }

// const deleteOverview = (id, cb) => {
//   pool.query('DELETE FROM overview WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     cb(`User deleted with ID: ${id}`)
//   })
// }

module.exports = {
  getSidebarById,
  createSidebar,
  // updateSidebar,
  deleteRestaurant,
  getOverviewById,
  // createOverview,
  // updateOverview,
  // deleteOverview
}
