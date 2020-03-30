import { testHook } from "../../utils/testingComponent"
import { useForm } from "../../hooks/form.hook"
import schema from '../../resource/schema'
import { act } from 'react-dom/test-utils'

describe('describe form hook', () => {

  const initialComponent = mockFn => {
    let component = {}

    testHook(() => {
      component = useForm({
        onSubmit: mockFn,
        initialState: schema,
        properties: schema.properties,
        fieldValidation: mockFn,
        setProperties: mockFn
      })
    })
    return { component, mockFn }
  }

  describe('describe changeField function', () => {
    let wrapper

    beforeEach(() => {

      wrapper = initialComponent(
        jest.fn().mockImplementationOnce((properties) => properties)
      )
    })

    it('change input value type: (string, integer, checked), changeFields - function', () => {

      const { mockFn, component } = wrapper

      let event = [
        {
          target: { value: '1', type: 'string', name: Object.keys(schema.properties)[ 0 ] },
          expectValue() {return this.target.value}
        },
        {
          target: { value: '1a', type: 'integer', name: Object.keys(schema.properties)[ 2 ] },
          expectValue() {return this.target.value.replace(/\D/g, '')}
        },
        {
          target: { checked: true, type: 'checkbox', name: Object.keys(schema.properties)[ 5 ] },
          expectValue() {return this.target.checked}
        },
      ]

      event.forEach((e) => {
        expect(mockFn.mock.calls.length).toBe(0)
        component.changeFields(e)
        expect(mockFn.mock.calls.length).toBe(1)

        expect(mockFn.mock.calls[ 0 ][ 0 ]).toEqual({
          ...schema.properties,
          [ e.target.name ]: { ...schema.properties[ e.target.name ], value: e.expectValue() }
        })

        mockFn.mockClear()
      })
    })

  })

  describe('describe sendForm', () => {
    let wrapper

    beforeEach(() => {

      wrapper = initialComponent(
        jest.fn()
          .mockImplementationOnce((properties) => true)
          .mockImplementationOnce((sendParams, copyProperties) => ({ sendParams, copyProperties }))
          .mockImplementationOnce((properties) => properties)
      )
    })

    afterEach(() => {
      wrapper.mockFn.mockClear()
    })

    it('test sendForm function if isValid = true', () => {

      const { mockFn, component } = wrapper
      act(() => component.sendForm({ preventDefault: () => {} }))

      const sendParams = {
        age: undefined,
        bio: undefined,
        firstName: 'Chuck',
        lastName: undefined,
        password: undefined,
        termsOfUse: true
      }

      expect(mockFn.mock.calls.length).toBe(3)
      expect(mockFn.mock.calls[ 0 ][ 0 ]).toEqual(schema.properties)
      expect(mockFn.mock.results[ 0 ].value).toBeTruthy()
      expect(mockFn.mock.calls[ 1 ][ 0 ]).toEqual(sendParams)
      expect(mockFn.mock.calls[ 1 ][ 1 ]).toEqual(schema.properties)
      expect(mockFn.mock.calls[ 2 ][ 0 ]).toEqual(schema.properties)
    })

    it('test sendForm function if isValid = false', () => {
      const { mockFn, component } = initialComponent(
        jest.fn().mockImplementationOnce((properties) => false)
      )
      act(() => component.sendForm({ preventDefault: () => {} }))

      expect(mockFn.mock.calls.length).toBe(1)
      expect(mockFn.mock.calls[ 0 ][ 0 ]).toEqual(schema.properties)
      expect(mockFn.mock.results[ 0 ].value).toBeFalsy()

      component.changeFields({
        target: { value: '1', type: 'string', name: Object.keys(schema.properties)[ 0 ] },
        expectValue() {return this.target.value}
      })
    })
  })
})
