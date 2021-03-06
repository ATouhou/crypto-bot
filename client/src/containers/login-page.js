import React, { PropTypes } from 'react';
import LoginForm from '../components/login-form.js';
import { Redirect } from 'react-router-dom';
import Auth from '../modules/auth';


class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    
    this.state = {
      errors: {},
      successMessage: '',
      user: {
        email: '',
        password: ''
      },
      redirectTo: null
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  componentWillMount() {
    /*
    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';
    console.log("testpoint2");
    if (storedMessage) {
      successMessage = storedMessage;
      this.setState({successMessage});
      localStorage.removeItem('successMessage');
    }
    */
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email.toLowerCase());
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/v1/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // save the token
        Auth.authenticateUser(xhr.response.token, xhr.response.user._id);
        console.log('login-page > authenticateUser', Auth.isUserAuthenticated());
        // change the current URL to /
        //this.context.router.replace('/');
        this.setState({ redirectTo: '/portfolio' });
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
        <div>
      { this.state.redirectTo ? <Redirect to={{ pathname: this.state.redirectTo }} /> : 
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
      }
      </div>
    );
  }

}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;