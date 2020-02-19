import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      info: '',
      error: '',
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log(`Error: ${error}`);
      console.log(`Error Info: ${JSON.stringify(info)}`);
    }
  }

  render () {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          <h1 className="error">Ocorreu um erro na aplicação</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
