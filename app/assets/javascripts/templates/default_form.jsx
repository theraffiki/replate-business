/**
 * Component to handle barebones form submissions
 */

class DefaultForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  _handleChange = (e) => {
    let target = $(e.target);
    this.setState({ [target.attr('name')]: target.val() });
  }

  _attemptAction(route, params, resolve, reject) {
    Requester.post(route, params, resolve, reject);
  }
}