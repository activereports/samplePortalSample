import React, { PropTypes, Component } from 'react';
import FontIcon from '../FontIcon';
import cx from 'classnames';

class DropdownItem extends Component {

  // EVENT/ACTION HANDLERS

  /**
   * Handle click
   * @param {Object} event
   */
  handleOnClick = (event) => {
    if (!this.props.disabled) this.props.onClick();
    event.preventDefault();
  };

  // RENDER ASSETS

  renderDivider = () => {
    const { style } = this.props;
    return <li className={cx(style.item, style.item_divider)} role="divider" />;
  };

  renderMenuItem = () => {
    const { style, disabled, icon, label, description, title, hidden } = this.props;
    return !hidden && (
      <li
        className={ cx(style.item, { [style.item_disabled]: disabled }) }
        disabled={disabled}
        role="menuitem"
        title={title}
        onClick={this.handleOnClick}
      >
        { icon && <FontIcon className={style.itemIcon} name={icon} /> }
        { !icon && <span className={style.itemIcon} /> }
        { label && <span className={style.itemLabel}>{label}</span> }
        { description && <div className={style.itemDesc}>{description}</div> }
      </li>
    );
  };

  // RENDER COMPONENT

  render() {
    const { divider } = this.props;
    return divider
      ? this.renderDivider()
      : this.renderMenuItem();
  }
}

DropdownItem.propTypes = {
  // Data
  className: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  divider: PropTypes.bool,
  hidden: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  // Actions
  onClick: PropTypes.func,
};

DropdownItem.defaultProps = {
  description: null,
  disabled: false,
  divider: false,
  hidden: false,
  icon: null,
  label: null,
  style: {
    item: 'menuItem',
    item_divider: 'menuItem_divider',
    item_disabled: 'menuItem_disabled',
    itemIcon: 'menuItem-icon',
    itemLabel: 'menuItem-label',
    itemDesc: 'menuItem-desc',
  },
};

export default DropdownItem;
