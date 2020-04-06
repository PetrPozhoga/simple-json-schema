import { useValidation } from "../../hooks/validation.hook"
import schema from '../../resource/schema'
import { testHook } from "../../utils/testingComponent"

describe('describe validation hook', () => {

  const mountComponent = (required, mockFn) => {
    let component = null
    testHook(() => {
      component = useValidation({
        required,
        setProperties: mockFn
      })
    })
    return component
  }

  test('validation failed', () => {
    const mockFn = jest.fn().mockImplementationOnce((properties) => properties)
    const component = mountComponent(schema.required, mockFn)
    let fieldValidation = component.fieldValidation(schema.properties)
    expect(fieldValidation).toBeFalsy()
  })

  test('test required and length fields', () => {
    const mockFn = jest.fn().mockImplementationOnce((properties) => properties)
    const component = mountComponent(schema.required, mockFn)
    let copyProperties = JSON.parse(JSON.stringify(schema.properties))
    delete copyProperties.confirmPassword
    let checkRequiredField = component.checkRequiredField(JSON.parse(JSON.stringify(copyProperties)))

    copyProperties.lastName.errorMessage = 'Field Last name is required'
    copyProperties.password.errorMessage = 'The Password field must be at least ' + copyProperties.password.minLength + ' characters'
    expect(checkRequiredField).toEqual(copyProperties)

    let validationKeys = [ 'lastName', 'password' ]

    validationKeys.forEach(key => {
      copyProperties[ key ].value = key

      checkRequiredField = component.checkRequiredField(JSON.parse(JSON.stringify(copyProperties)))

      delete copyProperties[ key ].errorMessage
      expect(checkRequiredField).toEqual(copyProperties)
    })

    let fieldValidation = component.fieldValidation(copyProperties)
    expect(fieldValidation).toBeTruthy()
  })

  test('test confirmPassword field', () => {
    const mockFn = jest.fn().mockImplementationOnce((properties) => properties)
    const component = mountComponent([ "password" ], mockFn)
    let copyProperties = JSON.parse(JSON.stringify(schema.properties))
    copyProperties = { password: copyProperties.password, confirmPassword: copyProperties.confirmPassword }
    copyProperties.password.value = '1234'
    let checkRequiredField = component.checkRequiredField(JSON.parse(JSON.stringify(copyProperties)))
    const error = "Password and Confirm password do not match"

    copyProperties.confirmPassword.errorMessage = error
    copyProperties.password.errorMessage = error
    expect(checkRequiredField).toEqual(copyProperties)

    copyProperties.confirmPassword.value = '1234'
    checkRequiredField = component.checkRequiredField(JSON.parse(JSON.stringify(copyProperties)))
    console.log(checkRequiredField)

    delete copyProperties.confirmPassword.errorMessage
    delete copyProperties.password.errorMessage
    expect(checkRequiredField).toEqual(copyProperties)

  })
})
