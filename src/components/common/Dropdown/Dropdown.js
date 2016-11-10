import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import DropdownMenu from '../DropdownMenu';
import DropdownToggle from '../Button';

class Dropdown extends Component {

  state = { isExpanded: this.props.expanded };

  // COMPONENT LIFECYCLE

  componentDidUpdate() {
    if (this.state.isExpanded) {
      document.addEventListener('click', this.hideDropdownMenu);
    } else {
      document.removeEventListener('click', this.hideDropdownMenu);
    }
  }

  // EVENT HANDLERS

  hideDropdownMenu = () => this.setState({ isExpanded: false });

  handleOnClick = () => {
    if (!this.props.disabled) {
      this.setState({ isExpanded: !this.state.isExpanded });
    }
  };

  // RENDER COMPONENT

  render() {
    const { isExpanded } = this.state;
    const { caret, icon, disabled, processing, label, title, className, children, menuRight, style, hidden } = this.props;
    return !hidden && (
      <div className={cx(style.omni, className)}>
        <DropdownToggle
          active={isExpanded}
          caret={caret}
          disabled={disabled}
          icon={icon}
          label={label}
          onClick={this.handleOnClick}
          processing={processing}
          style={style}
          title={title || label}
        />
        { isExpanded && (
          <DropdownMenu expanded menuRight={menuRight} style={style}>
            {children}
          </DropdownMenu>
        )}
      </div>
    );
  }
}

Dropdown.propTypes = {
  caret: PropTypes.string,
  children: PropTypes.array,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  expanded: PropTypes.bool,
  hidden: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  menuRight: PropTypes.bool,
  processing: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
};

Dropdown.defaultProps = {
  disabled: false,
  expanded: false,
  hidden: false,
  menuRight: false,
  processing: false,
  style: {
    omni: 'dropdown',
    toggle: 'dropdownToggle',
    toggle_open: 'dropdownToggle_open',
    toggle_disabled: 'dropdownToggle_disabled',
  },
};

export default Dropdown;
