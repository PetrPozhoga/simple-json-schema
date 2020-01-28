import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import './Form.scss'

function Form({ properties, changeFields, required, sendForm }) {
  return (
    <form className='json-form' onSubmit={ sendForm }>
      { Object.keys(properties).map((key, index) => {

        let currentProperty = properties[ key ]
        const { value, type, autoFocus, description, isTextarea, hint, errorMessage } = currentProperty
        const fieldOption = {
          name: key,
          onChange: changeFields,
          readOnly: true,
          onFocus: e => e.target.removeAttribute('readOnly'),
          value,
          type,
          autoFocus,
          style: {
            border: '1px solid',
            borderColor: errorMessage && errorMessage.length ? '#a94442' : '#ccc'
          }
        }

        return (
          <label htmlFor="" key={ index } className='json-form__item'>
            <div className='json-form__item__title'>
              { properties[ key ].title } { required.some(item => item === key) ? '*' : null }
            </div>
            { description && description.length ?
              <div className='json-form__item__description'>{ description }</div> : null }
            { isTextarea ? <textarea { ...fieldOption }/> : <input { ...fieldOption }/> }
            <CSSTransition
              in={ !!errorMessage && errorMessage.length > 0 }
              timeout={{
                enter: 200,
                exit: 130
              }}
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
      <input type="submit" value="Submit" className='json-form__btn primary-btn'/>
    </form>
  )
}

Form.propTypes = {
  properties: PropTypes.object.isRequired,
  required: PropTypes.array.isRequired,
  changeFields: PropTypes.func.isRequired,
}

export default Form