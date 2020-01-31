import React, { useEffect, useState } from 'react'
import { asyncGetSchema } from "./requests"
import Form from "./components/Form"
import './App.scss'

function App() {

  const [ isSend, setIsSend ] = useState(false)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ required, setRequired ] = useState([])
  const [ properties, setProperties ] = useState({})
  const [ initialState, setInitialState ] = useState({})

  const changeFields = (event) => {
    let currentProperty = JSON.parse(JSON.stringify(properties[ event.target.name ]))
    currentProperty.value = properties[ event.target.name ].type === 'integer' ?
      event.target.value.replace(/\D/, '') : event.target.type === 'checkbox' ? event.target.checked : event.target.value
    let propertiesCopy = { ...properties, [ event.target.name ]: currentProperty }
    setProperties(propertiesCopy)
    if (isSend) fieldValidation(propertiesCopy)
  }

  const getSchema = async () => {
    try {
      let res = await asyncGetSchema()
      if (res.status !== 200 || !res.data) return false
      else {
        let { title, description, required, properties } = res.data
        Object.keys(properties).forEach(key => properties[ key ].value = properties[ key ].value || '')
        let initialState = { title, description, required, properties }
        setInitialState(initialState)
        setTitle(title)
        setDescription(description)
        setRequired(required)
        setProperties(properties)
      }
    } catch (err) {
      console.log(err, 'getSchema')
    }
  }

  const checkRequiredField = (propertiesCopy) => {
    required.forEach(propertyName => {
      let currentProperty = propertiesCopy[ propertyName ]
      let errorMessage = 'Field ' + currentProperty.title + ' is required'
      if (currentProperty.value && (currentProperty.value.length || typeof currentProperty.value === "boolean"))
        propertiesCopy[ propertyName ] = {
          ...currentProperty,
          errorMessage: currentProperty.errorMessage === errorMessage ? '' : currentProperty.errorMessage
        }

      else {
        propertiesCopy[ propertyName ] = { ...currentProperty, errorMessage }
      }
    })
    setProperties(propertiesCopy)
    return checkMinLength(propertiesCopy)
  }

  const checkMinLength = (propertiesCopy) => {
    Object.keys(propertiesCopy).forEach(propertyName => {
      let currentProperty = propertiesCopy[ propertyName ]
      let errorMessage = 'The ' + currentProperty.title + ' field must be at least ' + currentProperty.minLength + ' characters'

      if (currentProperty.minLength) {
        if (currentProperty.value && currentProperty.value.length >= currentProperty.minLength) propertiesCopy[ propertyName ] = {
          ...currentProperty,
          errorMessage: ''
        }
        else propertiesCopy[ propertyName ] = { ...currentProperty, errorMessage }
      }
    })
    setProperties(propertiesCopy)
    return propertiesCopy
  }

  const fieldValidation = (properties) => {
    let propertiesCopy = checkRequiredField(properties)
    return !Object.keys(propertiesCopy).some(item => !!propertiesCopy[item].errorMessage)
  }

  const sendForm = (e) => {
    e.preventDefault()
    setIsSend(true)
    let isValid = fieldValidation(JSON.parse(JSON.stringify(properties)))
    if (isValid) {
      setIsSend(false)
      setProperties(initialState.properties)
    }
  }

  useEffect(() => {
    getSchema()
  }, [])

  return (
    <div className="App">
      <div className='container'>
        <h1>{ title }</h1>
        <h2>{ description }</h2>
        { properties && required &&
        <Form changeFields={ changeFields } sendForm={ sendForm }
              required={ required } properties={ properties }/> }
      </div>
    </div>
  )
}

export default App
