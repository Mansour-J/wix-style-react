import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withFocusable } from 'wix-ui-core/dist/src/hocs/Focusable';
import { generateDataAttr } from '../utils/generateDataAttr';

import { SKIN, TYPE, SIZE } from './constants';
import style from './Badge.st.css';

import ellipsisHOC from '../common/EllipsisHOC';

const BadgeContent = ({ children, className, ...restProps }) => {
  return (
    <span className={classNames(style.text, className)} {...restProps}>
      {children}
    </span>
  );
};

// It's a best practice to create the HOC outside the render function,
// mainly to improve the performance and prevent remounting that in some case could cause issues
const EllipsedBadgeContent = ellipsisHOC(BadgeContent);

class Badge extends React.PureComponent {
  static propTypes = {
    /** Applied as data-hook HTML attribute that can be used to create driver in testing */
    dataHook: PropTypes.string,
    /** variation of the component structure */
    type: PropTypes.oneOf(['solid', 'outlined', 'transparent']),
    /** color indication of the component */
    skin: PropTypes.oneOf([
      'general',
      'standard',
      'danger',
      'success',
      'neutral',
      'warning',
      'urgent',
      'neutralLight',
      'neutralStandard',
      'neutralSuccess',
      'neutralDanger',
      'premium',
      'warningLight',
    ]),
    /** component size */
    size: PropTypes.oneOf(['medium', 'small']),
    /** usually an icon to appear at the beginning of the text */
    prefixIcon: PropTypes.node,
    /** usually an icon to appear at the end of the text */
    suffixIcon: PropTypes.node,
    /** callback function called when badge is clicked */
    onClick: PropTypes.func,
    /** forces an uppercase letters */
    uppercase: PropTypes.bool,

    focusableOnFocus: PropTypes.func,
    focusableOnBlur: PropTypes.func,

    /** the text to display in the badge */
    children: PropTypes.node,
  };
  static displayName = 'Badge';

  static defaultProps = {
    type: TYPE.solid,
    skin: SKIN.general,
    size: SIZE.medium,
    uppercase: true,
  };

  getProps = () => {
    // that's what you pay for using HOCs...
    const { focusableOnFocus, focusableOnBlur, ...rest } = this.props;
    return rest;
  };

  _getFocusableProps = () => {
    // add focusable hooks only when badge is clickable
    const { onClick, focusableOnFocus, focusableOnBlur } = this.props;
    return onClick
      ? {
          onFocus: focusableOnFocus,
          onBlur: focusableOnBlur,
          tabIndex: 0,
        }
      : {};
  };

  _renderContent = children => {
    return <EllipsedBadgeContent ellipsis>{children}</EllipsedBadgeContent>;
  };

  render() {
    const {
      children,
      prefixIcon,
      suffixIcon,
      onClick,
      dataHook,
      ...rest
    } = this.getProps();

    return (
      <div
        data-hook={dataHook}
        onClick={onClick}
        {...this._getFocusableProps()}
        {...style('root', { clickable: !!onClick, ...rest }, this.getProps())}
        {...generateDataAttr(this.props, ['type', 'skin', 'size', 'uppercase'])}
        data-clickable={!!onClick}
      >
        {prefixIcon &&
          React.cloneElement(prefixIcon, {
            className: style.prefix,
            'data-prefix-icon': true,
          })}
        {this._renderContent(children)}
        {suffixIcon &&
          React.cloneElement(suffixIcon, {
            className: style.suffix,
            'data-suffix-icon': true,
          })}
      </div>
    );
  }
}

export default withFocusable(Badge);
