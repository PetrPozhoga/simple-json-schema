import { useState } from 'react'

export const useForm = ({ onSubmit, initialState, properties, setProperties, fieldValidation }) => {

  const [ isSend, setIsSend ] = useState(false)

  const changeFields = (event) => {
    let propertiesCopy = JSON.parse(JSON.stringify(properties))
    let currentProperty = propertiesCopy[ event.target.name ]
    currentProperty.value = properties[ event.target.name ].type === 'integer' ?
      event.target.value.replace(/\D/, '') : event.target.type === 'checkbox' ? event.target.checked : event.target.value
    propertiesCopy[ event.target.name ] = currentProperty
    setProperties(propertiesCopy)
    if (isSend) fieldValidation(propertiesCopy)
  }

  const sendForm = (e) => {
    e.preventDefault()
    setIsSend(true)
    let isValid = fieldValidation(JSON.parse(JSON.stringify(properties)))
    let copyProperties = JSON.parse(JSON.stringify(properties))
    if (isValid) {
      let sendParams = {}
      Object.keys(copyProperties).forEach(item => sendParams[ item ] = copyProperties[ item ].value)
      onSubmit(sendParams, copyProperties)
      setIsSend(false)
      setProperties(initialState.properties)
    }
  }

  return { changeFields, sendForm }
}
