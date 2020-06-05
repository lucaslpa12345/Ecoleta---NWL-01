import React, { useEffect , useState , ChangeEvent , FormEvent } from 'react'
import './style.css'
import { Link  , useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios'
import Dropfzone from '../../component/dropzone'


import logo from  '../../assets/logo.svg'
  
  interface Item { 
       id: number; 
       title: string ;
       item_url: string;      
  }

  interface IBGELOCALSUF { 
       sigla: string, 
  }

  interface IBGELOCALSCITY { 
      nome: string 
       
  }
   

const CreatePoint = () => { 
    const [ items , setitems ] = useState<Item[]>([])
    const [ufs , setlocal] = useState<string[]>([])
    const [ selecteduf , setselectuf] =useState('0')
    const [citys , setcitys ] = useState<string[]>([])
    const [selectedcity, setselectedcity] = useState('0')
    const [inicial_position, set_inicial_position ] = useState<[number, number]>([0, 0])
    const [selected_position, set_selected_position ] = useState<[number, number]>([0, 0])
    const [ form_data , set_form_data] = useState({ 
         name:'' ,
         email: '', 
         whatsapp: '',
    })
    const [selected_item , set_selected_item  ] = useState<number[]>([])
    const [selected_file, set_selected_file] = useState<File>()
    const history = useHistory()
 
    useEffect(() => { 
          api.get('/items').then(response => setitems(response.data))

         
  } , [ ]  )

  useEffect(() => { 
      axios.get<IBGELOCALSUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => { const  ufs = response.data.map(uf =>  uf.sigla ); setlocal(ufs)  }    )
         
  }, [])

  useEffect(() => 
   {         
        if( selecteduf === '0') { 
            return 
        }

 axios.get<IBGELOCALSCITY[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selecteduf}/municipios`)
.then(response => { const  citys = response.data.map(uf =>  uf.nome );  setcitys(citys)  }  )

         
   } , [selecteduf]
  )



  
  useEffect( () => { 
       navigator.geolocation.getCurrentPosition( position =>  { 
             const {latitude , longitude  } = position.coords

             set_inicial_position([latitude,longitude])
       } )  
      
  } ,[] 
   )



 
  function handleselectUF(event : ChangeEvent<HTMLSelectElement> ) { 
     const uf =   event.target.value
        
     setselectuf(uf)

  }

  function handlselectCITY(event : ChangeEvent<HTMLSelectElement> ) { 
      const city = event.target.value
       
     setselectedcity(city)
  }

  function handle_map_click( event: LeafletMouseEvent  ) {
    

       set_selected_position([event.latlng.lat, event.latlng.lng])
       
  }

  function handle_input_change( event : ChangeEvent<HTMLInputElement> ) { 
  
     const  { name , value  } = event.target

     set_form_data({...form_data , [name]: value  })
      
         
  }
 function handle_select_item( id: number   ) { 
          const already_select =  selected_item.findIndex(item => item === id)
       
          if(already_select >= 0) {  
             const filter_items = selected_item.filter(item => item !== id )
             
             set_selected_item(filter_items)

               
          }
         else { 
            set_selected_item([ ...selected_item , id])
         }
        
 }
 
 async  function handle_submit(event: FormEvent ) { 
      event.preventDefault()

      const { name , email , whatsapp  } = form_data;  
      const uf = selecteduf;
      const city = selectedcity; 
      const [latitude, longitude] = selected_position; 
      const items = selected_item
 
 const data = new FormData()

     
  data.append ('name', name) 
  data.append ('email', email) 
  data.append ('whatsapp', whatsapp) 
  data.append ('uf', uf) 
  data.append('city' , name) 
  data.append ('latitude', String(latitude))
  data.append ('longitude', String(longitude))
  data.append('items' , items.join(','))
  if(selected_file){ 
      data.append('image' , selected_file)
  }
  

   api.post('points' , data) ; 
   alert('Ponto de coleta registrado!')
       
         history.push('/')
        
  }
        
       return  ( 
            <div  id='page-create-point' >
                 <header>
                      <img src={logo} alt="logo Ecoleta"/>
                      <Link 
                        to='/'
                       > <FiArrowLeft/> Voltar para home </Link>
                 </header>

                   <form action=''  onSubmit={ handle_submit } > 
                           <h1>Cadastro do <br/> ponto de coleta </h1>
                           
                           <Dropfzone  onFileUploaded={set_selected_file} />

                         <fieldset> 
                             <legend>
                             <h2> Dados </h2>
                             
                           
                              
                                 
                         </legend> 
                         <div className="field">
                                      <label htmlFor='name' > Nome da entidade  </label>
                                  <input type='text'  
                                      name='name' 
                                      id='name'
                                      onChange={ handle_input_change }
                                     />
                                 </div>
   
                              
                         </fieldset>

                         <fieldset> 
                             <legend>
                         
                                 <div className="field">
                                      <label htmlFor='email' > Email  </label>
                                      <input type='email'  
                                      name='email' 
                                      id='email'
                                      onChange={ handle_input_change }

                                     /> 
                                 </div>

                               
                                 
                         </legend> 
                                      
                              
                         </fieldset>
                         <fieldset> 
                             <legend>
                           
                                 <div className="field">
                                      <label htmlFor='whatsapp' > whatsapp </label>
                                  <input type='text'  
                                      name='whatsapp' 
                                      id='whatsapp' 
                                      onChange={ handle_input_change }
                                     /> 
                                 </div>
                                 
                         </legend> 
                                      
                              
                         </fieldset>

                         <fieldset> 
                                 <legend>
                                   <h2> Endereço  </h2>
                                      <span>Selecione o endereço no mapa </span>

                                  </legend>
          
                      <Map  center={[-15.64996, -47.7997981]}  zoom={15}   onclick={ handle_map_click } >
                      <TileLayer
             attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                       
            />       <Marker position={selected_position} />
                      </Map>


                                   <div className="field-group">
                        <div className="field">
                              
                                <label htmlFor="uf">Estado (UF) </label>
                                <select name="uf" id="uf" value={selecteduf}  onChange={  handleselectUF} >
                                    <option value="0"> Selecione uma UF</option> 
                                    { ufs.map( uf =>  
                                         <option key={uf} value={uf}> {uf} </option>
                                        ) }
                                </select>
                        </div>

                                   </div>
                                   
                                   <div className="field-group">
                        <div className="field">
                              
                                <label htmlFor="city">Cidade </label>
                                <select name="city" id="city" value={selectedcity} onChange={ handlselectCITY}  >
                                    <option value="0"> Selecione uma cidade   </option>
                                    { citys.map( city => <option key={city} value={city} > {city}</option> ) }
                                </select>
                        </div>

                                   </div>
                                 
                        </fieldset>



                      <   fieldset> 
                                         <legend>
                                       <h2> Itens de coleta  </h2>
                                       <span>Selecione um ou mais itens abaixo </span>
                                         </legend>

                                         <ul className='items-grid' >

                                             {  items.map(item => (
                                                 <li className={ selected_item.includes(item.id) ? 'selected' : '' } key={item.id}  onClick={ () =>  handle_select_item(item.id) } >
                                                 <img src={item.item_url} alt='imagem' /> 
                                                 <span>{ item.title} </span>
                                                 </li>

                                             )) }
                                                

                                               
                                                
                                                
                                         </ul>

                                          

                               
                           </fieldset>
                         <button type='submit' > 
                               Cadastrar ponto de coleta 
                         </button>

                       </form>

            </div>
       )
     
}

export default CreatePoint