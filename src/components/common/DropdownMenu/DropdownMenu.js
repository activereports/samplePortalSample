import React, { PropTypes, Component } from 'react';
import cx from 'classnames';

class DropdownMenu extends Component {

  render() {
    const { className, children, style, expanded, menuRight } = this.props;
    const classes = cx(className, style.menu, {
      [style.menu_open]: expanded,
      [style.menu_right]: menuRight,
    });

    return (
      <ul className={classes} role="menu">
        { children }
      </ul>
    );
  }
}

DropdownMenu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.array,
  disabled: PropTypes.bool,
  expanded: PropTypes.bool,
  menuRight: PropTypes.bool,
  style: PropTypes.object,
  onSelect: PropTypes.func,
};

DropdownMenu.defaultProps = {
  disabled: false,
  expanded: false,
  menuRight: false,
  style: {
    menu: 'dropdownMenu',
    menu_open: 'dropdownMenu_open',
    menu_right: 'dropdownMenu_right',
  },
};

export default DropdownMenu;
