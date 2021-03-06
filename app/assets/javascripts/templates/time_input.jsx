/**
 * Component to format time inputs
 * @prop label     - Label for time input element
 * @prop form_name - Name for integration with Rails form submission
 * @prop input_id  - ID for the HTML input element
 * @prop update    - on change function handler
 * @prop initData  - initial data for maintaining state
 */
class TimeInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { caret: 0 };
    if (!this.props.initData) {
      this.state.val = "12:00 AM"
    } else {
      this.state.val = this.props.initData;
    }
  }

  _checkTextSelected = (input) => {
    return input.selectionStart !== input.selectionEnd;
  }

  _setCaretPosition = (e, caretPos) => {
    let target = $(e.target);
    if(target != null) {
      elem = target[0];
      if(elem.createTextRange) {
        var range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        if(elem.selectionStart) {
          elem.focus();
          elem.setSelectionRange(caretPos, caretPos);
        } else
          elem.focus();
      }
    }
  }

  _getCaretPosition = (e) => {
    var caretPos = 0;

    let target = $(e.target);
    if (target) {
      elem = target[0];
    }

    if (elem && (elem.selectionStart || elem.selectionStart == 0)) { // Standard.
      caretPos = elem.selectionStart;
      // Make selectionEnd match selectionStart
      elem.setSelectionRange(caretPos, caretPos);
    } else if (document.selection) { // Legacy IE
      elem.focus ();
      var sel = document.selection.createRange();
      sel.moveStart ('character', -elem.value.length);
      caretPos = sel.text.length;
    }
    return caretPos;
  }

  _specialInput = (e) => {
    // Backspace key press handling
    if (e.keyCode == 8) {
      this.state.caret = this._getCaretPosition(e);
      e.preventDefault();
      // Move back caret
      if (this.state.caret == 3 || this.state.caret == 6 || this.state.caret == 8) {
        this.state.caret -= 2;
      } else if (this.state.caret > 0) {
        this.state.caret -= 1;
      }
      // If within time substring (ex. '12:00'), backspace sets index to '0'
      if (this.state.caret < 6) {
        let time = e.target.value;
        let index = this.state.caret;
        time = time.substr(0, index) + '0' + time.substr(index + 1);
        this._setInputVal(e.target, time);
      }
      this._setCaretPosition(e, this.state.caret);
      this.props.update(e);
    }
  }

  _handleInput = (e) => {
    this.state.caret = this._getCaretPosition(e);

    //Prevent default unless enter key
    if (e.keyCode != 3) {
      e.preventDefault();
    }

    let time = e.target.value;
    let index = this.state.caret;
    if (index < 2 || (index > 2 && index < 5)) {
      // Validate the input to allow numbers only within time substring
      let entry = parseInt(e.key);
      if (entry || entry == 0) {
        if (index == 0 && entry > 1 || (entry == 1 && parseInt(time.substr(1, 2)) > 2)) {
          return;
        } else if (index == 1 && parseInt(time.substr(0, 1)) == 1 && entry > 2) {
          return;
        } else if (index == 3 && entry > 5) {
          return;
        }
        time = time.substr(0, index) + entry + time.substr(index + 1);
        this.state.caret += 1;
      }
    } else if (index > 5 && index < 7) {
      // Validate the input to allow "A", "P" only within "AM"/"PM" substring
      if (e.key.toUpperCase() == "A" || e.key.toUpperCase() == "P") {
        time = time.substr(0, index) + e.key.toUpperCase() + time.substr(index + 1);
        this.state.caret += 1;
      }
    }

    // Move caret to ignore ":", " ", and "M"
    if (this.state.caret == 2) {
      this.state.caret += 1;
    } else if (this.state.caret == 5) {
      this.state.caret = 6;
    } else if (this.state.caret == 7) {
      this.state.caret = 8;
    }

    // If the user has selected text, resume default behavior
    if (this._checkTextSelected(e.target)) {
      return true;
    }

    this._setInputVal(e.target, time);
    this._setCaretPosition(e, this.state.caret);
    this.props.update(e); // Update state
  }

  _setInputVal = (input, value) => {
    input.value = value;
  }

  render() {
    return (
      <div className="field input-container">
        <label className="label label--newline" htmlFor={this.props.input_id}>{this.props.label}</label>
        <input type="text" defaultValue={this.state.val} name={this.props.form_name} id={this.props.input_id}
          className="input" onKeyPress={this._handleInput} onKeyDown={this._specialInput} />
      </div>
    )
  }
}

TimeInput.propTypes = {
  label    : React.PropTypes.string.isRequired,
  form_name: React.PropTypes.string.isRequired,
  input_id : React.PropTypes.string.isRequired,
  update   : React.PropTypes.func.isRequired,
  initData : React.PropTypes.string.isRequired,
};
