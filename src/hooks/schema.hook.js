import { useState, useEffect } from 'react'

export const useSchema = schema => {

  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ required, setRequired ] = useState([])
  const [ properties, setProperties ] = useState({})
  const [ submitValue, setSubmitValue ] = useState('')
  const [ initialState, setInitialState ] = useState({})

  useEffect(() => {
    setSchema()
  }, [schema])

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
