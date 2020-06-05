import Knex from 'knex' 

export async function seed( knex : Knex )
 { 
    await   knex('items').insert([ 
           {title: 'lâmpadas' , image: 'lampadas.svg' } , 
           {title: 'Pilhas e Baterias' , image: 'baterias.svg' } , 
           {title: 'Papéis e Papelão' , image: 'papeis-papelao.svg' } , 
           {title: 'Resíduos Eletrônicos' , image: 'eletronicos.svg' } , 
           {title: 'Reasíduos Orgânicos' , image: 'organicos.svg' } , 
           {title: 'lampadas' , image: 'lampadas.svg' } , 
           {title: 'Óleo de Cozinha' , image: 'oleo.svg' } , 

      ])
 }