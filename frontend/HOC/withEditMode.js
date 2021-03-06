import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
//actions
import PopupActions from '../actions/EditModeAction'

const addonsSettings = {
    usePreviousePosition: false
}

const withEditMode = (action, addonsSettings={}) => (Component) => {
    class Wrapper extends React.Component {
        static defaultProps = {
            selected: {},
            justifyContanteCenter: false,
            modalWindowIsOpen: false
        }

        state = {
            bodyScrollHeight: document.body.scrollHeight,
            bodyScrollWidth: document.body.scrollWidth
        }


        getCordinates = () => {
            let settings = {}

            if(this.props.selected) {
                this.props.set_selected(this.props.selected)
            }

            if(addonsSettings.usePreviousePosition) {
                if(this.props.justifyContanteCenter) {
                    settings = {
                        width: customWidth ? customWidth + 'px': width > 400 ? '400px' : '300px',
                        top: customTop ? customTop + 'px' : parseInt(isScrollApear(top)) + 'px',
                        left: 'calc( 50% - 150px )'
                        
                    }

                    this.props.get_cordinates(settings)
                    return

                }
                return null
            }
            const {width, top, left} = this.node.getBoundingClientRect()

            console.log("this.node.getBoundingClientRect()", this.node.getBoundingClientRect())
            const {customLeft, customTop, customWidth, justifyContanteCenter} = this.props


            function isScrollApear(top) { return top + window.scrollY }

            
            if(justifyContanteCenter) {
                settings = {
                    width: customWidth ? customWidth + 'px': width > 400 ? '400px' : '300px',
                    top: customTop ? customTop + 'px' : parseInt(isScrollApear(top)) + 'px',
                    left: 'calc( 50% - 150px )'
                    // top: customTop ? customTop + 'px' : parseInt(top + window.scrollY) + 'px',
                    // left: customLeft ? customLeft + 'px': parseInt(left + window.scrollX) + 'px'
                }
            } else {
                settings = {
                    width: customWidth ? customWidth + 'px': width > 400 ? '400px' : '300px',
                    top: customTop ? customTop + 'px' : parseInt(isScrollApear(top)) + 'px',
                    left: customLeft ? customLeft + 'px': parseInt(left + 0) + 'px'
                    // top: customTop ? customTop + 'px' : parseInt(top + window.scrollY) + 'px',
                    // left: customLeft ? customLeft + 'px': parseInt(left + window.scrollX) + 'px'
                }
            }

            this.props.get_cordinates(settings)
        }
        
        getElement = (element) => {
            if(this.node) return
            this.node = element
        }

        _convertToString = (data) => typeof data === 'string' ? data : data + ''

        _getNumber = (number, inded=-2) => parseInt(number.slice(0, inded), 10)

        _calculateCodsWithMetrics = (cords, metrix='px') => `${cords}${metrix}`


        componentDidUpdate(prevProps, prevState) {

            let {
                bodyScrollHeight: currentBodyHeight,
                bodyScrollWidth: currentBodyWidth
            } = this.state

            let {
                top: propsTop,
                left: propsLeft,
                width,
                selected,
                get_cordinates
            } = this.props


            let isBodyWidthDifferentFromWindow = document.body.scrollHeight !== window.innerHeight
            let isBodyHeightDifferentFromWindow = document.body.scrollWidth !== window.innerWidth

            let isAppBodyHeightNotEqualToBody = currentBodyHeight !== document.body.scrollHeight
            let isAppBodyWidthNotEqualToBody = currentBodyWidth !== document.body.scrollWidth

            if(this.props.isPopupShow) {
                if( isAppBodyHeightNotEqualToBody || isAppBodyWidthNotEqualToBody ) {
                    if( isBodyWidthDifferentFromWindow || isBodyHeightDifferentFromWindow ) {
                        
                        let getWidthDifferent = document.body.scrollWidth - window.innerWidth
                        let getHeightDifferent = document.body.scrollHeight - window.innerHeight
    
                        let top = this._convertToString(propsTop)
                        let left = this._convertToString(propsLeft)
    
                        this.setState(state => {
                            return {
                                ...state,
                                bodyScrollHeight: document.body.scrollHeight,
                                bodyScrollWidth: document.body.scrollWidth
                            }
                        }, function() {
    
                            let _top = (this._getNumber(top) - getHeightDifferent) > 0 
                                ? this._getNumber(top) - getHeightDifferent
                                : top
                            let _left = this._getNumber(left) - getWidthDifferent
    
                            let updatesCordinates = {
                                top: this._calculateCodsWithMetrics(_top),
                                left: this._calculateCodsWithMetrics(_left),
                                width
                            }
                         
                            this.props.get_cordinates(updatesCordinates)
                        })
                    }
                }
            }
        }

        componentWillReceiveProps(next) {
            if(!next.isPopupShow && this.props.isPopupShow) {
                this.props.clear_cordinates()

                this.setState({bodyScrollHeight: window.innerHeight})
            }
        }


        render() {
            const {getElement, getCordinates} = this
            const {toggle, menuToShow} = this.props

            return (
                <div ref={getElement} onClick={ compose( getCordinates, toggle, menuToShow ) } >
                    <Component {...this.props}/>
                </div>
            )
        }
    }

    const mapDispatchToProps = (dispatch) => ({
        toggle() {
            action().toggle && dispatch(action().toggle())
        },
        menuToShow() {
            dispatch(action().menu())
        },
        get_cordinates(cords) {
            dispatch(PopupActions.get_cordinates(cords))
        },
        clear_cordinates() {
            dispatch(PopupActions.clear_cordinates())
        },
        set_selected(selectd) {
            dispatch ( PopupActions.set_selected(selectd) )
        }
    })

    const mapStateToProps = ({mode}) => ({
        left: mode.left,
        top: mode.top,
        width: mode.width,
        isPopupShow: mode.forms.isPopupShow
    })

    return connect(mapStateToProps, mapDispatchToProps)(Wrapper)
}


export default withEditMode