/**
 * Component to format phone inputs
 * @prop form_name - Name for integration with Rails form submission
 * @prop input_id  - ID for the HTML input element
 * @prop change    - callback function to update state
 */
class PhoneInput extends DefaultForm {

  _checkTextSelected = (input) => {
    return input.selectionStart !== input.selectionEnd;
  }

  _handleInput = (e) => {

    // Validate the input to allow numbers only
    let entry = parseInt(e.key);
    if (!entry && entry != 0) {
      e.preventDefault();
    }

    // If the user has selected text, resume default behavior
    if (this._checkTextSelected(e.target)) {
      return true;
    }

    let input = e.target.value;
    let rawNum = input.split("-").join("");
    let formattedNum;

    if (rawNum.length >= 10) {
      e.preventDefault();
      return;
    }

    if (rawNum.length == 3) {
      formattedNum = rawNum + "-";
    } else if (rawNum.length > 3 && rawNum.length < 6) {
      formattedNum = rawNum.substring(0, 3) + "-" + rawNum.substring(3, rawNum.length);
    } else if (rawNum.length >= 6) {
      formattedNum = rawNum.substring(0, 3) + "-" + rawNum.substring(3, 6);
      formattedNum += "-" + rawNum.substring(6, rawNum.length);
    } else {
      formattedNum = rawNum;
    }

    this._setInputVal(e.target, formattedNum);
  }

  _setInputVal = (input, value) => {
    input.value = value;
  }

  render() {
    return (
      <div className="field input-container">
        <label className="label label--newline" htmlFor={this.props.input_id}>Phone</label>
        <input
          type="tel" name={this.props.form_name} id={this.props.input_id}
          className="input" onKeyPress={this._handleInput} placeholder="123-456-7890"
          onChange={this.props.change} />
      </div>
    )
  }
}

PhoneInput.propTypes = {
  form_name: React.PropTypes.string.isRequired,
  input_id : React.PropTypes.string.isRequired
};
