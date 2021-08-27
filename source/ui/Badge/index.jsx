import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Badge = ({ name, value, icon }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {
        name
        && <span className={classes.name}>{name}</span>
      }
      <div className={classes.valueContainer}>
        {
          icon
          && (
          <div className={classes.iconContainer}>
            <img className={classes.icon} src={icon} />
          </div>
          )
        }
        <span className={classes.value}>{value}</span>
      </div>
    </div>
  );
};

export default Badge;

Badge.defaultProps = {
  name: null,
  icon: null,
};

Badge.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string,
};
