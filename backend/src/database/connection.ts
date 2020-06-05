
import pg from 'pg'
pg.types.setTypeParser ( 1700 , 'text' , parseFloat )
import knex from 'knex'  ;
import path from 'path'


const connection =  knex({ 
     
      client: 'pg', 
      connection: {
        host : 'localhost',
        user : 'postgres',
        password : '123',
        database : 'nwlbooster'
      }

})

export default connection