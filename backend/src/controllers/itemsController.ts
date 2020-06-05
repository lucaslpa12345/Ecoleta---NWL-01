import {Request , Response } from 'express'
import knex from '../database/connection'

class itemsconstrollers { 
    
           


        async index(req: Request , res : Response )  { 
            const items = await knex('items').select('*')
            const Serializeditems = items.map( item => { 
                return {
                     id: item.id ,
                     title: item.title, 
                     item_url: `http://192.168.0.24:1000/uploads/${item.image}`
                }
            } )
        
             res.json(Serializeditems)
        }


     


}

export default itemsconstrollers