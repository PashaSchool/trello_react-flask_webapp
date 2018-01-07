import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
//components
import Button from '../../components/Button/Button'
import Title from '../../components/Title/Title'
import Form from '../../components/Form/Form'
// containers
import TextField from '../TextField/TextField'
//actions
import {requestUserSignIn} from '../../actions/UserAction'


import './Signin.style.css'

class Signin extends Component {
    state = {
        fields: [
            {name: ''},
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
        const {fields} = this.state;

        const {name} = fields[0];
        const {email} = fields[1];
        const {password} = fields[2];
        
        const postRequest = {name, email, password};
        
        console.log("data is ready")
        this.props.userSignIn(postRequest)
        console.log("Data is sended")
    }

    header = () => (
        <Title>Register a new account in Trello</Title>
    )
    footer = () => (
        <Link to='/login'>Have already account ?</Link>
    )

    render() {
        const {fields} = this.state;

        const {name} = fields[0];
        const {email} = fields[1];
        const {password} = fields[2];
  
        return (
            <Form
                method="post" 
                submit={this.onSubmit}
                renderHeader={this.header}
                renderFooter={this.footer}>
                 <TextField
                    handleChange={this.handleChange}
                    name="name"
                    field={name}
                    label='Name'/>
                <TextField
                    handleChange={this.handleChange}
                    name="email"
                    field={email}
                    label='Email'/>
                <TextField
                    handleChange={this.handleChange}
                    name="password"
                    field={password}
                    label='Password'
                    type='password'/>
                <Button primary type='submit'>Sign in</Button>
            </Form>
        )
    }

    componentWillUpdate(nextProps, nextState) {
        console.log("componentWillUpdate")

    }
    componentDidUpdate(prevProps, prevState) {
        // console.log("componentDidUpdate", this.state.error, prevState.error)
        // https://learnetto.com/blog/how-to-do-simple-form-validation-in-reactjs
    }  
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userSignIn: (data) => dispatch(requestUserSignIn(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin)