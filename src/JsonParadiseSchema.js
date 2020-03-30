import React from 'react'
import PropTypes from 'prop-types'
import './JsonParadiseSchema.scss'
import Form from "./components/Form/Form"
import { useSchema } from './hooks/schema.hook'
import { useValidation } from './hooks/validation.hook'
import { useForm } from "./hooks/form.hook"

function JsonParadiseSchema({ schema, onSubmit }) {

  const {
    title,
    description,
    required,
    properties,
    setProperties,
    submitValue,
    initialState,
  } = useSchema(schema)

  const { fieldValidation } = useValidation({setProperties, required})
  const { changeFields, sendForm } = useForm({onSubmit, initialState, properties, setProperties, fieldValidation})

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
