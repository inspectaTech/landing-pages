import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HOME_PATH } from '../../paths/';

export default (OriginalComponent) => {
  class MixedComponent extends Component {

    checkAuth(){
      console.log("[authGuard] checking auth");
      if(!this.props.isAuth || !this.props.jwtToken){
        console.log('User isn\'t authenticated. decline access');
        this.props.history.push(HOME_PATH);
      }
    }

    componentDidMount(){
      // whether the user is authenticated
      this.checkAuth()
    }

    componentDidUpdate(){
      // whether the user is authenticated
      this.checkAuth()
    }

    render(){
      return <OriginalComponent {...this.props} />;
    }
  }

  function mapStateToProps(state){
    return {
      isAuth: state.auth.isAuthenticated,
      jwtToken: state.auth.token
    }
  }

  return connect(mapStateToProps)(MixedComponent);

}//OriginalComponent
