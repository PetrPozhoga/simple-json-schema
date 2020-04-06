import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import './Form.scss'

const Form = memo(function Form({ properties, changeFields, required = [], sendForm, submitValue = 'submit' }) {

  const parseType = type => {
    const typeList = {
      confirmPassword: 'password',
    }
    return typeList[type] || type
  }

  return (
    <form className='json-form' onSubmit={ sendForm }>
      { Object.keys(properties).map((key, index) => {

        let currentProperty = properties[ key ]
        const { value, type, autoFocus, description, isTextarea, hint, errorMessage } = currentProperty

        const fieldOption = {
          name: key,
          id: 'json-simple-form' + key,
          onChange: changeFields,
          readOnly: true,
          onFocus: e => e.target.removeAttribute('readOnly'),
          value,
          type: parseType(type),
          autoFocus,
          style: {
            border: '1px solid',
            borderColor: errorMessage && errorMessage.length ? '#a94442' : '#ccc'
          }
        }

        if (type === 'checkbox') {
          fieldOption.checked = fieldOption.value
          delete fieldOption.value
        }

        return (
          <label htmlFor='' key={ key } className='json-form__item'>
            <label htmlFor={ 'json-simple-form' + key } className='json-form__item__title'>
              { properties[ key ].title }
              { required.some(item => item === key) ? '*' : null }
            </label>
            { description && description.length ?
              <div className='json-form__item__description'>{ description }</div> : null }
            { isTextarea ? <textarea { ...fieldOption }/> : <input { ...fieldOption }/> }
            <CSSTransition
              in={ !!errorMessage && errorMessage.length > 0 }
              timeout={ {
                enter: 200,
                exit: 130
              } }
              classNames="json-form__item__error"
              unmountOnExit
              mountOnEnter
            >
              <div className='json-form__item__error'>{ errorMessage }</div>
            </CSSTransition>
            { hint && hint.length ? <div className='json-form__item__hint'>{ hint }</div> : null }
          </label>
        )
      }) }
      <input type="submit" value={ submitValue } className='json-form__btn primary-btn'/>
    </form>
  )
})

Form.propTypes = {
  properties: PropTypes.objectOf(PropTypes.object).isRequired,
  submitValue: PropTypes.string.isRequired,
  required: ({ required }) => {
    if (typeof required !== 'undefined' && !Array.isArray(required)) return new
    Error("Invalid prop `required` of type `" + typeof required + "` supplied to `E`, expected `array`.")
    else if (Array.isArray(required) && !!required.length) {
      let errorArr = []

      required.forEach((item, index) => {
        if (typeof item !== 'string') errorArr.push(index)
      })

      if (!!errorArr.length) return new
      Error("Invalid prop `required[" + errorArr[ 0 ] + "]` of type `" + typeof errorArr[ 0 ] +
        "` supplied to `E`, expected `string`.")
    }
  },
  changeFields: PropTypes.func.isRequired,
}

export default Form
