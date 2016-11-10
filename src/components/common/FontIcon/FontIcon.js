/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes } from 'react';

const FontIcon = (props) => {
  let classes = `fa fa-${props.name}`;
  if (props.size) classes += ` fa-${props.size}`;
  if (props.spin) classes += ' fa-spin';
  if (props.pulse) classes += ' fa-pulse';
  if (props.border) classes += ' fa-border';
  if (props.fixedWidth) classes += ' fa-fw';
  if (props.inverse) classes += ' fa-inverse';
  if (props.flip) classes += ` fa-flip-${props.flip}`;
  if (props.rotate) classes += ` fa-rotate-${props.rotate}`;
  if (props.stack) classes += ` fa-stack-${props.stack}`;
  if (props.className) classes += ` ${props.className}`;
  return (
    <span className={classes} title={props.title}>
      {props.children}
    </span>
  );
};

FontIcon.propTypes = {
  border: PropTypes.bool, // Whether or not to show a border radius
  children: PropTypes.array, // Child components
  className: PropTypes.string, // An extra set of CSS classes to add to the component
  fixedWidth: PropTypes.bool, // Make buttons fixed width
  flip: PropTypes.oneOf(['horizontal', 'vertical']), // Flip the icon's orientation
  inverse: PropTypes.bool, // Inverse the icon's color
  name: PropTypes.string.isRequired, // Name of the icon to use
  pulse: PropTypes.bool, // Rotate icon with 8 steps (rather than smoothly)
  rotate: PropTypes.oneOf([90, 180, 270]), // The degrees to rotate the icon by
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']), // The icon scaling size
  spin: PropTypes.bool, // Spin the icon
  stack: PropTypes.oneOf(['1x', '2x']), // Stack an icon on top of another
  title: PropTypes.string,
};

export default FontIcon;
