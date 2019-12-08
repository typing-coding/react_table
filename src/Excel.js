import React from 'react';

import PropTypes from 'prop-types';

class Excel extends React.Component {

    static propTypes = {
        defaultHeaders: PropTypes.arrayOf(PropTypes.string),
        defaultData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    }

    constructor (props){
        super(props);
        this.state = {
            headers: props.defaultHeaders,
            defaultData: props.defaultData,
            data: props.defaultData,
            descending: false,
            sortby: '',
            edit: null,
            search: null
        }

        this._log =  [];

        this._sort = this._sort.bind(this);
        this.onTyping = this.onTyping.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onDownload = this.onDownload.bind(this);
    }
    onSubmit(e){
        e.preventDefault();
        var input = e.target.firstChild;
        var data = this.state.data.slice();
        if(input.value === '') return false;

        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this._logSetState({
            edit: null,
            data: data
        });
    }

    _sort(e){
        var column = e.target.cellIndex;
        var data = this.state.data.slice();
        var descending = this.sortby === column && !this.state.descending;
        data.sort(function(a,b){
            if( descending ){
                return a[column] > b[column]? -1 : 1
            }else{
                return a[column] > b[column]? 1 : -1
            }
        })
        this._logSetState({
            data: data,
            descending : !this.state.descending,
            sortby: column
        })
    }
    onTyping(e){
        this._logSetState({edit:{
            row: Number(e.target.dataset.row),
            cell: e.target.cellIndex
        }});
    }
    onSearch(e){
        this._logSetState({
            search: !this.state.search
        });
    }
    onFilter(e){
        console.log('onFilter');
        const target = e.target;
        const val = target.value.toLowerCase();
        const data = this.state.data.slice();
        const column = target.parentNode.cellIndex;
        if( !val.length ){
            this._logSetState({
                data: this.state.defaultData
            });
            return false;
        }
        var filterData = data.filter((currentValue,rowidx)=>{
            let isFilter = false;

            if(currentValue[column].toLowerCase().indexOf(val) > -1){
                isFilter = true;
            }
            return isFilter;
        });
        this._logSetState({
            data: filterData
        });
    }
    onDownload(e){
        var target = e.target;
        var contents = JSON.stringify(this.state.defaultData);
        var format = 'json';

        var URL = window.URL || window.webkitURL;
        var blob = new Blob([contents],{ type: 'text/' + format});
        target.href = URL.createObjectURL(blob);

        target.download = 'data.' + format;

    }
    _logSetState(newState){
        this._log.push(JSON.parse(JSON.stringify(this._log.length === 0? this.state: newState)))
        this.setState(newState);
        console.log(this._log);
    }
    _log(methodName,args){
      console.log(methodName,args);
    }
    componentWillReceiveProps() {
      // this._log('componentWillReceiveProps',arguments);
    }
    shouldComponentUpdate(){
        // this._log('shouldComponentUpdate',arguments);
        return true;
    }
    componentWillUpdate(){
        // this._log('componentWillUpdate',arguments);
    }
    componentDidUpdate(){
        // this._log('componentDidUpdate',arguments);
    }
    componentWillMount(){
        // this._log('componentWillMount',arguments);
    }
    componentDidMount(){
        // this._log('componentDidlMount',arguments);
    }
    render(){
        var search = this.state.search;

        return(
            <div className="container">
                <h1 className="mt-3">Excel Table</h1>
                <div className="btn-toolbar justify-content-between">
                    <button type="button" onClick={this.onSearch} className="btn btn-primary">search</button>
                    <a href="data.json" onClick={this.onDownload} className="btn btn-secondary">download</a>
                </div>
                <table className="table table-striped">
                    <caption className="sr-only">Table</caption>
                    <thead className="thead-dark">
                        <tr>
                            {
                                this.state.headers.map((currentValue,idx)=>{
                                    return(
                                        <th scope="col" key={idx} onClick={this._sort}>{currentValue}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                this.state.headers.map((currentValue,rowidx)=>{
                                    var content = search ? <td key={rowidx + 10}><input type="text" onChange={this.onFilter} className="form-control" /></td>: null;
                                    return(
                                        content
                                    )
                                },this)
                            }
                        </tr>
                        {
                            this.state.data.map((currentValue,rowidx)=>{
                                return(
                                    <tr key={rowidx}>
                                        {currentValue.map((currentValue,idx)=>{
                                            var content = this.state.edit && this.state.edit.row === rowidx && this.state.edit.cell === idx ?
                                            <form action="" onSubmit={this.onSubmit}>
                                                <input type="text" defaultValue={currentValue}/>
                                            </form> :
                                            currentValue;
                                            return(
                                                <td key={idx} data-row={rowidx} onDoubleClick={this.onTyping}>
                                                    {content}
                                                </td>
                                            )
                                        },this)}
                                    </tr>
                                )
                            })
                        }
                     </tbody>
                 </table>
            </div>
        )
    }
}

export default Excel;