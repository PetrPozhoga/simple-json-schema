export const useValidation = ({ setProperties, required }) => {

  const checkRequiredField = (propertiesCopy) => {

    required.forEach(propertyName => {
      let currentProperty = propertiesCopy[ propertyName ]
      let errorMessage = 'Field ' + currentProperty.title + ' is required'
      if (!(!!currentProperty.value)) {
        propertiesCopy[ propertyName ] = {
          ...currentProperty,
          errorMessage
        }
      }
      else {
        if (currentProperty.errorMessage === errorMessage) delete propertiesCopy[ propertyName ].errorMessage
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
        if (currentProperty.value && currentProperty.value.length >= currentProperty.minLength) {
          delete propertiesCopy[ propertyName ].errorMessage
        }
        else propertiesCopy[ propertyName ] = { ...currentProperty, errorMessage }
      }
    })
    setProperties(propertiesCopy)
    return propertiesCopy
  }

  const fieldValidation = (properties) => {
    let propertiesCopy = checkRequiredField(JSON.parse(JSON.stringify(properties)))
    return !Object.keys(propertiesCopy).some(item => !!propertiesCopy[ item ].errorMessage)
  }

  return { fieldValidation, checkRequiredField }
}
