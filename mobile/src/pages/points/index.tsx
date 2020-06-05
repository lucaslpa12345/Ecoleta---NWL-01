import React , { useState , useEffect} from 'react'
import  Constants   from 'expo-constants'
import { View , StyleSheet , TouchableOpacity, Text , ScrollView , Image , Alert } from 'react-native'
import { Feather as Icon  } from '@expo/vector-icons'
import {  useNavigation , useRoute } from '@react-navigation/native'
import MapView , {  Marker } from 'react-native-maps'
import {  SvgUri } from 'react-native-svg'
import api from '../../services/api'
import * as Location  from 'expo-location'

interface Item { 
     id: number;
     title: string; 
     item_url: string
}

interface Point { 
      id:number ;
      name: string ; 
      image: string; 
      item_url: string; 
      latitude: number; 
      longitude: number; 
      items: { 
           title: string; 
      }[]

}

interface  Params{ 
     uf: string , 
     city: string, 
}

const Points = () => { 
    const navigate = useNavigation()
    const [ items , set_items] = useState<Item[]>([])
    const [ seleted_items, set_selected_items ] = useState<number[]>([]) 
    const [points , set_points] = useState<Point[]>([])
    const routes = useRoute()

    

   useEffect(() => console.log(points.map(i=> i.id))   , [points])

    const routeparams = routes.params as Params
    

    const [initial_position, set_initial_position] = useState<[number,number]>([0, 0])


 useEffect(() => { 
       async function  load_position() { 
              const { status } = await Location.requestPermissionsAsync()
               
              if (status !== 'granted') { 
                   Alert.alert('Acesso negado' , 'Parece você não nos deu permissão para acessar sua localização !!!')
                   return 
                   
              }

              const location = await Location.getCurrentPositionAsync()

              const { latitude , longitude } = location.coords

              set_initial_position([latitude,longitude])
       }

       load_position()
 }, [])

  useEffect(() => { 
       api.get('items').then(response => set_items(response.data))  
                         
       
        
  } , []) 

  useEffect(() => { 
      api.get('points' , { 
           params: { 
                city: routeparams.city ,
                uf: routeparams.uf ,
                items: seleted_items

      }
      }).then(response =>   set_points(response.data)   )
        
  }  , [seleted_items])
   





    function handle_navigate_back() { 
         navigate.navigate('Home')
    }
    function handle_navigate_to_detail(id: number ) { 
         navigate.navigate('Details',{ point_id: id })
    }
    function handle_select_item(id: number ) {
        const already_select = seleted_items.findIndex(item => item === id ) 
        
        if (already_select >= 0) { 
            
            const filter_item = seleted_items.filter(item =>  item !== id )
        
            set_selected_items(filter_item)
        }

         else { 
            
            set_selected_items([...seleted_items , id ]) 

            }
         }  
         
   


    return ( 
        <>
         <View style={ styles.container}> 
                 
                  <TouchableOpacity onPress={ handle_navigate_back } > 
                        <Icon  name='arrow-left' size={24} color='#34cb79' /> 
                  </TouchableOpacity>
                  <Text style={ styles.title } > Bem vindo  </Text>
                  <Text style={ styles.description }  > Encontre no mapa um ponto de coleta .   </Text>
                  <View style={styles.mapContainer }>
                     { initial_position[0] !== 0 && (  <MapView style={styles.map} 
                       loadingEnabled={initial_position[0]===0}
                       initialRegion={{ 
                           latitude: initial_position[0],
                             longitude:  initial_position[1],
                             latitudeDelta: 0.015 , 
                             longitudeDelta: 0.015 

                      }} >  
                       { points.map(point => ( 
                             <Marker  key={String( point.id) }  coordinate={{ 
                                latitude: Number(point.latitude) ,
                                longitude:  Number(point.longitude)
                           }} 
                            
                            onPress={ () =>  handle_navigate_to_detail(point.id) }  
    
                            style={styles.mapMarker} > 
                            <View  style={styles.mapMarkerContainer} > 
                             <Image style={styles.mapMarkerImage} source={{uri: point.item_url }} /> 
                             <Text style={styles.mapMarkerTitle } >{point.name} </Text>
                             </View>
                            </Marker>
    
                       )) 
                        
                        
                        }
                      </MapView >
) 
                        }
                  </View>
         </View>
         <View style={styles.itemsContainer}> 
         <ScrollView horizontal showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{paddingHorizontal: 20}}  
            > 
             {  items.map( item => ( 
                    <TouchableOpacity key={ String(item.id)} 
                     style={[styles.item, seleted_items.includes(item.id) ? styles.selectedItem : {}  ]} 
                      onPress={() =>  handle_select_item(item.id) } 
                        activeOpacity={0.7}
                       > 
                    <SvgUri width={42} height={42} uri={item.item_url} />
                    <Text style={styles.itemTitle} > {item.title} </Text>
                     </TouchableOpacity>
             ) ) }
            
         </ScrollView  >
         </View>
          </>   
     )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points