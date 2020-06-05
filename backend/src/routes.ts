import express, { Router } from 'express'
import knex  from './database/connection'
import multer from 'multer'
import config_multer from './multer/multer'
import { celebrate , Joi } from 'celebrate'

import pointscontroller from './controllers/pointsController'
import itemscontroller from './controllers/itemsController'




const routes = Router()
const upload = multer(config_multer)
const points = new pointscontroller
const items = new itemscontroller

routes.get('/items', items.index )
routes.post('/points' , upload.single('image') , 
  celebrate({
      body: Joi.object().keys({ 
            name: Joi.string().required(), 
            email: Joi.string().required(),
            whatsapp: Joi.number().required(), 
            latitude: Joi.number().required(), 
            longitude: Joi.number().required(), 
            city: Joi.string().required(), 
            uf: Joi.string().required().max(2), 
            items: Joi.string().required(), 
            
      })
       
  }) ,  
points.create)
routes.get('/points/:id' ,  points.show)
routes.get('/points' , points.index)


export default routes 