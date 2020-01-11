import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form'
import { connect } from 'react-redux';
import { compose } from 'redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import * as actions from '../actions/';
import { DASHBOARD_PATH } from '../paths/';
import CustomInput from './CustomInput';

// export default class SignIn extends Component {
class SignIn extends Component {

  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

async onSubmit(formData){
  console.log('onSubmit called!');
  console.log("[formData]",formData);

  // We need to call some action
  await this.props.signIn(formData)// runs the signIn action
  if(!this.props.errorMessage){
    //dashboard redirect
    console.log("headed to the dashboard");
    this.props.history.push(DASHBOARD_PATH);
  }// if
}

async responseGoogle(res){
  console.log('responseGoogle', res);
  await this.props.oauthGoogle(res.accessToken);
  if(!this.props.errorMessage){
    //dashboard redirect
    console.log("headed to the dashboard");
    this.props.history.push(DASHBOARD_PATH);
  }// if
}// responseGoogle

async responseFacebook(res){
  console.log('responseFacebook', res);
  await this.props.oauthFacebook(res.accessToken);
    if(!this.props.errorMessage){
      console.log("headed to the dashboard");
      //dashboard redirect
      this.props.history.push(DASHBOARD_PATH);
    }// if
}// responseFacebook

  render(){
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <fieldset>
              <Field
              name="email"
              type="text"
              id="email"
              label="Enter your email"
              placeholder="example@example.com"
              component={ CustomInput } />
            </fieldset>
            <fieldset>
              <Field
              name="password"
              type="password"
              id="password"
              label="Enter your password"
              placeholder="yoursuperpassword"
              component={ CustomInput } />
            </fieldset>

            { this.props.errorMessage ?
            <div className="alert alert-danger">
              { this.props.errorMessage }
            </div>
           : null }

            <button type="submit" className="btn btn-primary" >Sign In</button>
          </form>
        </div>
        <div className="col">
          <div className="text-center">
            <div className="alert alert-primary">
              Or sign up using third party services
            </div>
            {/*<button className="btn btn-default" >Google</button>*/}
            <FacebookLogin
              appId="460223747894882"
              /*autoLoad={true}*/
              textButton="Facebook"
              fields="name,email,picture"
              callback={this.responseFacebook}
              cssClass="btn btn-outline-primary"
            />
            <GoogleLogin
             clientId="1033836948812-fbkvifqukbtlg2kvorn88jokcpcrdf7k.apps.googleusercontent.com"
             buttonText="Google"
             onSuccess={this.responseGoogle}
             onFailure={this.responseGoogle}
             className="btn btn-outline-danger"
            />
          </div>
        </div>
      </div>
    )
  }
}// Component

function mapStateToProps(state){
  return {
    errorMessage: state.auth.errorMessage
  }
}

export default compose(
/*connect(null, actions),*/
connect(mapStateToProps, actions),
reduxForm({ form: 'signin' })
)(SignIn)
//compose needed because of redux-form, without it just use connect
