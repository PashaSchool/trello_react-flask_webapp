import React from 'react'
import PropTypes from 'prop-types'
//styles
import './Title.css'
//colors
import {Color} from '../../__asssets/color'


const styles = function({bold, tiny, color, lower, medium, underline, large, biggest}) {
    return {
        textDecoration: underline && 'underline' || 'none',
        fontWeight : bold && '700'|| tiny && '300' || '500',
        color: color ? color : Color.niceBlack,
        fontSize: lower && '14px' || medium && '16px' || large && '24px' || biggest && '72px' || '11px'
    }
}


const Title = ({children, text, ...props}) => {
    let defaultClass = 'title'
    let addonsClasses = props.className ? props.className : ''
    return (
        <div>
            <span 
                className={defaultClass.concat(" ", addonsClasses)}  
                style={styles(props)} 
                {...props}
            >
                {text}
            </span>
            {children}
        </div>
    )
}

Title.defaultProps = {
    bold: false,
    tiny: false,
    lower: false,
    medium: false,
    large: false,
    color: '',
    underline: false
}

Title.propTypes = {
    text: PropTypes.string.isRequired
}

export default Title
