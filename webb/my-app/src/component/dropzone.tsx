import React, {useCallback , useState } from 'react'
import {useDropzone} from 'react-dropzone'
import   { FiUpload } from 'react-icons/fi'
import './style.css'

 interface props  { 
    onFileUploaded: (file: File) => void; 
 }


const Dropzone: React.FC<props> = ({onFileUploaded}) => {

   const [selected_file_url, set_selected_file_url] = useState('')
  

  const onDrop = useCallback(acceptedFiles => {
      const file = acceptedFiles[0]; 
      
      const fileurl= URL.createObjectURL(file)

      set_selected_file_url(fileurl)
      onFileUploaded(file)
     

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop , 
    accept: 'image/*'
})

  return (
    <div  className='dropzone' {...getRootProps()}>
      <input {...getInputProps()}accept='image/*'  />
       { selected_file_url ? <img className='img'  src={selected_file_url} alt='gm'/> 
              :  <p><FiUpload/>Selecione uma imagem para o local !!!</p>
        }
    </div>
  )
}

export default Dropzone