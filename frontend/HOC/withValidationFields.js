import React, {cloneElement, Children} from 'react'


export function withValidationFields(Component) {

    return class Wrapper extends React.Component {
        state = {
            errors: {}
        }

        _isEmpty = (field) => {
            if(field.length == 0) {
                throw new Error(`*This field is required`)
            }
            if(field.length > 2) {
                return true
            } else {
                throw new Error(`*Should be more then 2 character`)
            }
        }
    
        _isValidEmail = (email) => {
            let re = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
            if( !re.test(email.toLowerCase()) ) {
                throw new Error(`*Invalid email`)
            } else {
                return true
            }
        }

        validateBeforeSubmit = () => {
            
            let isFieldEmpty = false;

            Children.map(this.props.children, (child) => {
                const {field, name} = child.props

                if(field !== undefined && field.length === 0) {
                    this.displayErrors(name, field)
                    isFieldEmpty = true
                }
            })

            if(isFieldEmpty) {
                return false
            }

            if( Object.keys(this.state.errors).length === 0 ) {
                return true
            }

            return false
        }


        displayErrors = (name, value) => {
            try {
                let result = this._isEmpty(value)
                result && this.removeError(name)

                if(name.toLowerCase() === 'email') {
                    let result = this._isValidEmail(value);
                    result && this.removeError(name)
                }
            } catch ({message}) {
                this.setError(name, message);
            }
        }

        onBlur =  (e) => {
            let {value, name} = e.target;
            this.displayErrors(name, value)
        }

        removeError = (elementName) => {
            this.setState(state => {
                let errors = Object.assign({}, state.errors);

                if(elementName in errors) {
                    let isDeleted = delete errors[elementName]

                    if(isDeleted) {
                        return {
                            errors: {...errors}
                        }
                    } else {
                        throw new Error(`Can't delete ${elementName} from ${errors} object`)
                    }
                } 
                return null
            })
        }

        setError = (elementName, errorMessage) => {
            this.setState( prevState => {
                let error = Object.assign({}, prevState.errors)
                let anotherErrorMessage = error[elementName] === errorMessage;

                if( !(elementName in error) || !anotherErrorMessage ) {
                    error[elementName] = errorMessage
                    return {
                        errors: {...error}
                    }
                }
                return null
            })

        }
        renderChild = () => {
            const { state, props } = this
            let newProps = {
                onBlur: this.onBlur,
                errors: ''
            }

            return Children.map(props.children, child => {

                if(child.props.type === 'submit') {
                    if(Object.keys(this.state.errors).length !== 0) {
                        return cloneElement(child, {primary: false, error: true})
                    }
                }
                
                if(child.props.field !== undefined) {
                    if(child.props.name in state.errors) {
                        return cloneElement(child, {...newProps, errors: state.errors[child.props.name]})
                    }
                    return cloneElement(child, {...newProps, errors: ""})
                }
                return cloneElement(child)
            })
        }

        render() {
            return (
                <Component {...this.props} onSubmit={(e) => {
                        e.preventDefault();
                        const isValid = this.validateBeforeSubmit();
                        console.log({isValid})
                        isValid && this.props.submit();
                    }} >
                    {this.renderChild()}
                </Component>
            )
        }
    }
}