import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './JsonParadiseSchema.scss'
import Form from "./components/Form/Form"

function JsonParadiseSchema({ schema, onSubmit }) {

  const [ isSend, setIsSend ] = useState(false)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ required, setRequired ] = useState([])
  const [ properties, setProperties ] = useState({})
  const [ submitValue, setSubmitValue ] = useState('')
  const [ initialState, setInitialState ] = useState({})

  useEffect(() => {
    setSchema()
  }, [ schema ])

  const changeFields = (event) => {
    let currentProperty = JSON.parse(JSON.stringify(properties[ event.target.name ]))
    currentProperty.value = properties[ event.target.name ].type === 'integer' ?
      event.target.value.replace(/\D/, '') : event.target.type === 'checkbox' ? event.target.checked : event.target.value
    let propertiesCopy = { ...properties, [ event.target.name ]: currentProperty }
    setProperties(propertiesCopy)
    if (isSend) fieldValidation(propertiesCopy)
  }

  const setSchema = () => {
    try {
      let propertiesErrorMessage = 'Failed prop type: The prop `properties` is marked as required in `N`, but its value is not `object`.'
      if (!Object.keys(schema).length && Object.keys(initialState).length > 0) throw propertiesErrorMessage
      else if (!Object.keys(schema).length) return
      else {
        let { title, description, required, properties, submitValue } = JSON.parse(JSON.stringify(schema))
        if (!!properties && Object.keys(properties).length > 0) {
          Object.keys(properties).forEach(key => properties[ key ].value = properties[ key ].value || '')
          let initialState = { title, description, required, properties }
          setInitialState(initialState)
          setTitle(title)
          setDescription(description)
          setRequired(required)
          setProperties(properties)
          setSubmitValue(submitValue)
        }
        else throw propertiesErrorMessage
      }
    } catch (err) {
      throw err
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
    return !Object.keys(propertiesCopy).some(item => !!propertiesCopy[ item ].errorMessage)
  }

  const sendForm = (e) => {
    e.preventDefault()
    setIsSend(true)
    let isValid = fieldValidation(JSON.parse(JSON.stringify(properties)))
    let copyProperties = JSON.parse(JSON.stringify(properties))
    if (isValid) {
      let sendParams = {}
      Object.keys(copyProperties).forEach(item => {
        delete copyProperties[ item ].errorMessage
        sendParams[ item ] = copyProperties[ item ].value
      })
      onSubmit(sendParams, copyProperties)
      setIsSend(false)
      setProperties(initialState.properties)
    }
  }

  return (
    <div className="react-simple-json-schema">
      <div className='container'>
        { title ? <h1>{ title }</h1> : null }
        { description ? <h2>{ description }</h2> : null }
        { !!Object.keys(properties).length &&
        <Form changeFields={ changeFields } submitValue={ submitValue } sendForm={ sendForm }
              required={ required } properties={ properties }/> }
      </div>
    </div>
  )
}

JsonParadiseSchema.propTypes = {
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default JsonParadiseSchema