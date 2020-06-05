import { Request, Response} from 'express'
import knex from '../database/connection'

interface  Ponto { 
     image: string;
     name: string ; 
     email: string; 
     whatsapp: string; 
     lat: number; 
     long: number ; 
     city: string ;
     uf: string ;
 
}


class pointcontroller { 
    async create (req : Request , res : Response  )  { 
        const {     
           name,
           email, 
           whatsapp ,
           city ,
           uf , 
           items 
            } = req.body
          const lat = req.body.latitude
          const long = req.body.longitude

    
            const trx = await knex.transaction()

            const latitude = Number(lat)
            const longitude = Number(long)
  
 console.log( name , latitude, longitude)
            const point = {
                image: req.file.filename ,  
                name,
                email, 
                whatsapp ,
                latitude, 
                longitude,
                city ,
                uf 
           
            }

            
        
            const insertedIds =   await trx('points').insert( point ,    'id' )
    
            const  point_id = insertedIds[0]
    
             const pointitems = items.split(',').map(( item:String) => Number(item.trim())).map( (item_id: Number ) => { 
                 
                 
                return { 
                    item_id, 
                    point_id

                    
                    
                }
          } )
    
        await trx('point_items').insert(pointitems)
               
       await   trx.commit()
    
             return res.json({
                 id: point_id ,  
                  ...point, 
        
             
            })
        
    }  

    async show(req : Request , res: Response ) { 
           const id = req.params.id
      
            const point = await knex('points').where('id', id).first()
            
            if (!point  ) { 
                 res.status(400).json('Erro : points not found ')


            }    
            
            const Serializedpoint =  {
                    ...point, 
                     item_url: `http://192.168.0.24:1000/uploads/${point.image}`
                }
           
        

          const items = await knex('items').join('point_items', 'items.id','=' , 'point_items.item_id')
         .where('point_items.point_id', id)
         .select('items.title')


            return res.json({ Serializedpoint , items })



    }
    

    async index( req: Request , res: Response ) { 

        const { city ,  uf ,  items } =  req.query; 
         
        const parseditems = String(items)
        .split(',')
        .map(item => Number( item.trim()))
       console.log(parseditems)
     
       const points = await knex('points')
       .join('point_items' , 'points.id' , '=' , 'point_items.point_id' )
         .whereIn('point_items.item_id', parseditems) 
         .where('uf' , String(uf) )
         .where('city' , String(city))
         .distinct()
         .select('points.*')



         const Serializedpoints = points.map( item => { 
            return {
                ...item, 
                 item_url: `http://192.168.0.24:1000/uploads/${item.image}`
            }
        } )
    
     
  


       
        return  res.json(Serializedpoints)
         
    }
     
}

export default pointcontroller