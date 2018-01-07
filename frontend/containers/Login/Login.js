import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect}  from 'react-redux'
//utils
import PropTypes from 'prop-types'
//components
import Button from '../../components/Button/Button'
import Title from '../../components/Title/Title'
import Form from '../../components/Form/Form'
//containers
import TextField from '../TextField/TextField'
//actions
import {requestUserLogin} from '../../actions/UserAction'


class Login extends Component{
    state = {
        fields: [
            {email: ''}, 
            {password: ''}
        ]
    }

    handleChange = (field) => (evant) => {

        let value = evant.target.value;

        this.setState(function (state) {
            let updatedFields = state.fields
                .reduce((acumulator, obj) => {
                    if (field in obj) {
                        obj[field] = value
                    }
                    acumulator.push(obj)
                    return acumulator
                }, [])

            return {...state, fields: [...updatedFields]}
        })
    }
    onSubmit = () => {
        const {email} = this.state.fields[0]
        const {password} = this.state.fields[1]

        this.props.userLogin({email, password})
        console.log("Data is sended", {email, password})
    }
    header = () => (
        <Title>Welcome back to Trello</Title>
    )
    footer = () => (
        <Link to='/signin'>Do you want to create new account ?</Link>
    )


    render() {

        const {email} = this.state.fields[0]
        const {password} = this.state.fields[1]
        return (
            <div>

                <Form
                    submit={this.onSubmit}
                    renderHeader={this.header}
                    renderFooter={this.footer}>
                    <TextField 
                        handleChange={this.handleChange}
                        field={email}
                        name="email"
                        label='Email'/>
                    <TextField
                        type="password"  
                        handleChange={this.handleChange}
                        field={password}
                        name="password"
                        label='Password'/>
                    <Button type='submit' primary>Login</Button>
                </Form>
            </div>
        )
    }  
}

function mapDispatchToProps(dispatch) {
    return {
        userLogin: (data) => dispatch(requestUserLogin(data))
    }
}


export default connect(null, mapDispatchToProps)(Login)