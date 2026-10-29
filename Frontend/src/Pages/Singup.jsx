import React from 'react'
import Template from '../Component/Template'
const Singup = ({setIsloggin}) => {
  return (
    <Template 
    title= "User Registration"
    desc1= "Create a new account quickly."
    desc2= "Fill in your basic details to get started."
    // image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s"
    formtype= "singup"
    setIsloggin={setIsloggin}
    
    />
  )
}

export default Singup