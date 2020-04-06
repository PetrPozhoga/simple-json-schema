import { useState, useEffect, useCallback } from 'react'

export const useSchema = schema => {

  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ required, setRequired ] = useState([])
  const [ properties, setProperties ] = useState({})
  const [ submitValue, setSubmitValue ] = useState('')
  const [ initialState, setInitialState ] = useState({})

  useEffect(() => {
    setSchema()
  }, [ schema ])

  const setSchema = () => {
    try {
      let propertiesErrorMessage = 'Failed prop type: The prop `properties` is marked as required in `N`, but its value is not `object`.'
      if (!Object.keys(schema).length && Object.keys(initialState).length > 0) throw propertiesErrorMessage
      else if (!Object.keys(schema).length) return
      else {
        let validatePropsErrorMessage = validateSchemaProperties(propertiesErrorMessage)
        if (validatePropsErrorMessage !== null) throw validatePropsErrorMessage
        updateProperties()
      }
    } catch (err) {
      throw err
    }
  }

  const validateSchemaProperties = useCallback((propertiesErrorMessage) => {
    let { properties } = JSON.parse(JSON.stringify(schema))
    let propertiesKey = Object.keys(properties)
    let errorMessage = null
    if (!!properties && propertiesKey.length > 0) {
      const confirmPassword = propertiesKey.filter(item => properties[ item ].type === 'confirmPassword')
      if (confirmPassword && confirmPassword.length) {
        errorMessage = confirmPassword.length > 1 ? 'Failed prop type: `confirmPassword` is unique' :
          !propertiesKey.some(item => properties[ item ].type === 'password') ?
            'Failed prop type: `password` is required if there is a `confirmPassword`' :
            propertiesKey.filter(item => properties[ item ].type === 'password').length > 1 ?
              'Failed prop type: `password` is unique if there is a `confirmPassword`' : null
      }
    }
    else errorMessage = propertiesErrorMessage
    return errorMessage
  }, [ properties ])

  const updateProperties = () => {
    let { title, description, required, properties, submitValue } = JSON.parse(JSON.stringify(schema))

    Object.keys(properties).forEach(key => properties[ key ].value = properties[ key ].value || '')
    let initialState = { title, description, required, properties }
    setInitialState(initialState)
    setTitle(title)
    setDescription(description)
    setRequired(required)
    setProperties(properties)
    setSubmitValue(submitValue)
  }

  return {
    title,
    description,
    required,
    properties,
    setProperties,
    submitValue,
    initialState
  }
}
