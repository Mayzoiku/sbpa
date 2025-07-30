const Currency = ({ value, ...props }) => {
  return <span {...props}>GHS {value}</span>;
};

export default Currency;
