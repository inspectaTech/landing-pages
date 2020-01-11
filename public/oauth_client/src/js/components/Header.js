import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions/';
import { HOME_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH } from '../paths/'

// export default class Header extends Component {
class Header extends Component {

  constructor(props){
    super(props);
    this.signOut = this.signOut.bind(this);
  }// constructor

  async signOut(){
    console.log('signOut got called!');
    await this.props.signOut();

    if(!this.props.errorMessage){
      console.log("headed home");
      //dashboard redirect
      this.props.history.push(HOME_PATH);

      //[wrapped in withRouter to get this history. push to work](https://stackoverflow.com/questions/44009618/uncaught-typeerror-cannot-read-property-push-of-undefined-react-router-dom)
    }// if

  }// constructor

  render(){
    console.log("props",this.props);
    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ marginBottom: "30px" }}>
          <Link className="navbar-brand" to={HOME_PATH}>CodeWorkr API Auth</Link>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to={DASHBOARD_PATH}>Dashboard</Link>
              </li>
            </ul>

            <ul className="nav navbar-nav ml-auto">

            { !this.props.isAuth ?
              [ <li className="nav-item" key="signup">
              <Link className="nav-link" to={SIGN_UP_PATH} >Sign Up</Link>
              </li>,
              <li className="nav-item" key="signin">
              {/*the case in the to="" dictates the case (lower or upper) of the displayed url route*/}
              <Link className="nav-link" to={SIGN_IN_PATH} >Sign In</Link>
              </li>]
              :  null }

              { this.props.isAuth ?
                <li className="nav-item">
                <Link className="nav-link" to={HOME_PATH} onClick={this.signOut}>Sign Out</Link>
                </li> : null }
            </ul>
          </div>
        </nav>

    )
  }//render
}//Header

function mapStateToProps(state){
  console.log("mapState",state);
  return {
    isAuth: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage
  }// return
}// mapStateToProps
export default connect(mapStateToProps, actions )(withRouter(Header))
