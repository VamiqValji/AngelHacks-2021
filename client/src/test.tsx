import { render } from '@testing-library/react';
import React from 'react';

export class test extends React.Component {

    onSubmit(e) {
        e.preventDefault();
        var title = this.title;
        console.log(title);
    }

    render() {
        return (
            <div>
            <form className="form-horizontal"> 
               <input type="text" className="form-control" ref={(c) => this.title = c} name="title" />
            </form>
            <button type="button" onClick={this.onSubmit} className="btn">Save</button>
            </div>
           
        )
    }
}