import React from 'react'
import { useSchema } from "../../hooks/schema.hook"
import schema from '../../resource/schema'
import { testHook } from "../../utils/testingComponent"
import { mount } from 'enzyme'
import JsonParadiseSchema from "../../JsonParadiseSchema"

jest.mock('../../components/Form/Form', () => () => null)

describe('describe schema', () => {

  let schemaObj = {}

  beforeEach(() => {
    testHook(() => {
      schemaObj = useSchema(schema)
    })
  })

  it('test returned value without properties, setProperties, initialState', () => {

    expect(schema).toMatchSnapshot()

    const deleteObjKey = (list, obj) => list.forEach(key => delete obj[ key ])
    deleteObjKey([ 'properties', 'setProperties', 'initialState' ], schemaObj)

    Object.keys(schemaObj).forEach(key => expect(schemaObj[ key ]).toEqual(schema[ key ]))
  })

  it('test properties (set default /key=value/ if key is undefined)', () => {
    const { properties } = schemaObj
    Object.keys(properties).forEach(key => {
      let schemaProperties = JSON.parse(JSON.stringify(schema.properties))
      schemaProperties[ key ].value = schemaProperties[ key ].value || ''
      expect(properties[ key ]).toEqual(schemaProperties[ key ])
    })
  })
})

describe('describe schema error', () => {

  it('throw if Object keys initialState length > 0 and schema object keys length = 0', () => {
    spyOn(console, 'error')
    let component = mount(<JsonParadiseSchema schema={ schema } onSubmit={ () => {} }/>)
    expect(() => component.setProps({
      schema: {},
      onSubmit: () => {}
    })).toThrow("Failed prop type: The prop `properties` is marked as required in `N`, but its value is not `object`.")
  })

  it('return if schema object keys length = 0', () => {
    let schemaObj = {}

    testHook(() => {
      schemaObj = useSchema({})
    })

    const { description, initialState, properties, required, submitValue, title } = schemaObj

    expect(description).toBe('')
    expect(initialState).toEqual({})
    expect(properties).toEqual({})
    expect(required).toEqual([])
    expect(submitValue).toBe("")
    expect(title).toBe("")
  })

  it('throw when properties for value not set', () => {
    spyOn(console, 'error')

    expect(
      () => testHook(() => {
        schema.properties = {}
        useSchema(schema)
      })
    ).toThrow('Failed prop type: The prop `properties` is marked as required in `N`, but its value is not `object`.')
  })
})
