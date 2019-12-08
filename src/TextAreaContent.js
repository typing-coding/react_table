import React from 'react';

class TextAreaElement extends React.Component {
    constructor(props){
        super(props);
        this.onTextChange = this.onTextChange.bind(this);
    }
    onTextChange(e){
        console.log(e.target.value)
        this.props.onTextChangeCallback(e.target.value);
    }
    render(){
        return(
            <textarea onChange={this.onTextChange}></textarea>
        )
    }
}

class CounterElement extends React.Component {
    constructor(props){
        super(props);
    }
    componentWillUpdate(){
        console.log(this.props.defaultText)
    }
    shouldComponentUpdate(nextProps){
        console.log(this.props.defaultText.length === nextProps.defaultText.length)
        return this.props.defaultText.length !== nextProps.defaultText.length
    }
    render(){
        return(
            <p>{this.props.defaultText.length === 0 ? '' : this.props.defaultText.length}</p>
        )
    }
}

class TextAreaContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            text: ''
        };

        this.onTextChangeCallback = this.onTextChangeCallback.bind(this);

    }
    onTextChangeCallback(param){
        this.setState({text:param})
    }
    _log(methodName,args){
      console.log(methodName,args);
    }
    componentWillReceiveProps() {
      this._log('componentWillReceiveProps',arguments);
    }
    shouldComponentUpdate(nextProps){
        this._log('shouldComponentUpdate',arguments);
        return true
    }
    componentWillUpdate(){
        this._log('componentWillUpdate',arguments);
    }
    componentDidUpdate(){
        this._log('componentDidUpdate',arguments);
    }
    componentWillMount(){
        this._log('componentWillMount',arguments);
    }
    componentDidMount(){
        this._log('componentDidlMount',arguments);
    }
    render(){
        return(
            <div className="textarea_content">
                <TextAreaElement onTextChangeCallback={this.onTextChangeCallback}/>
                <CounterElement defaultText={this.state.text}/>
            </div>
        )
    }
}

export default TextAreaContent;
