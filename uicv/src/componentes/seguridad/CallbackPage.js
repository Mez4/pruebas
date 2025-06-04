import React from "react"
import { connect } from "react-redux"
import { CallbackComponent } from "redux-oidc"
import { useHistory } from 'react-router-dom'
import userManager from '../../userManager'

const CallbackPage = () => {

  // Initialize
  const history = useHistory()

  // just redirect to '/' in both cases
  return (
    <CallbackComponent
      userManager={userManager}
      successCallback={() => history.push("/app")}
      errorCallback={error => {
        history.push("/")
        console.error(error);
      }}
    >
      <div>Redireccionando...</div>
    </CallbackComponent>
  );
}

export default connect()(CallbackPage);
