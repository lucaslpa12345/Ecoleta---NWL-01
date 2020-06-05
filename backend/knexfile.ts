import path from 'path'
import pg from 'pg'
pg.types.setTypeParser(20, 'text', parseInt)



 module.exports =  { 
        client: 'pg', 
        connection: {
          host : 'localhost',
          user : 'postgres',
          password : '123',
          database : 'nwlbooster'
        } 
        , 
     migrations : { 
           directory: path.resolve(__dirname , 'src' , 'database' , 'migrations' )
     }, 
     seeds : { 
        directory: path.resolve(__dirname , 'src' , 'database' , 'seeds' )
  }


     

}
