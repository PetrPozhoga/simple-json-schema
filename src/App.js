import React from 'react'
import { asyncGetSchema } from "./requests"
import Form from "./components/Form"
import './App.scss'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isSend: false,
      initialState: {}
    }
  }

  changeFields(event) {
    let currentProperty = JSON.parse(JSON.stringify(this.state.properties[ event.target.name ]))
    currentProperty.value = this.state.properties[ event.target.name ].type === 'integer' ?
      event.target.value.replace(/\D/, '') : event.target.type === 'checkbox' ? event.target.checked : event.target.value
    this.setState({
      properties: {
        ...this.state.properties,
        [ event.target.name ]: currentProperty
      }
    }, () => {
      if (this.state.isSend) this.fieldValidation()
    })
  }

  async getSchema() {
    try {
      let res = await asyncGetSchema()
      if (res.status !== 200 || !res.data) return false
      else {
        let { title, description, required, properties } = res.data
        Object.keys(properties).forEach(key => properties[ key ].value = properties[ key ].value || '')
        let initialState = { title, description, required, properties }
        this.setState({ ...initialState, initialState })
      }
    } catch (err) {
      console.log(err, 'getSchema')
    }
  }

  checkRequiredField() {
    let properties = JSON.parse(JSON.stringify(this.state.properties))
    this.state.required.forEach(propertyName => {
      let currentProperty = properties[ propertyName ]
      let errorMessage = 'Field ' + currentProperty.title + ' is required'
      if (currentProperty.value && (currentProperty.value.length || typeof currentProperty.value === "boolean"))
        properties[ propertyName ] = {
          ...currentProperty,
          errorMessage: currentProperty.errorMessage === errorMessage ? '' : currentProperty.errorMessage
        }

      else {
        console.log(errorMessage)
        properties[ propertyName ] = { ...currentProperty, errorMessage }
      }
    })
    this.setState({ properties }, () => this.checkMinLength())
  }

  checkMinLength() {
    let properties = JSON.parse(JSON.stringify(this.state.properties))
    Object.keys(properties).forEach(propertyName => {
      let currentProperty = properties[ propertyName ]
      let errorMessage = 'The ' + currentProperty.title + ' field must be at least ' + currentProperty.minLength + ' characters'

      if (currentProperty.minLength) {
        if (currentProperty.value && currentProperty.value.length >= currentProperty.minLength) properties[ propertyName ] = {
          ...currentProperty,
          errorMessage: ''
        }
        else properties[ propertyName ] = { ...currentProperty, errorMessage }
      }
    })
    this.setState({ properties })
  }

  fieldValidation() {
    this.checkRequiredField()
  }

  sendForm(e) {
    e.preventDefault()
    this.setState({
      isSend: true
    }, async () => {
      await this.fieldValidation()
      const { properties, initialState } = this.state
      if (Object.keys(properties).every(propertyName => !!properties[ propertyName ].errorMessage === false)) {
        console.log(this.state.properties)
        this.setState({ properties: initialState.properties, isSend: false })
      }
    })
  }

  componentDidMount() {
    this.getSchema();
  }

  render() {
    const { title, description, properties, required } = this.state
    return (
      <div className="App">
        <div className='container'>
          <h1>{ title }</h1>
          <h2>{ description }</h2>
          { properties && required &&
          <Form changeFields={ this.changeFields.bind(this) } sendForm={ this.sendForm.bind(this) }
                required={ required } properties={ properties }/> }
        </div>
      </div>
    )
  }
}

export default App
