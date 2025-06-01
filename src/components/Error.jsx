import React from 'react';

const Error = ({ message }) => {
  return (
    <span className="text-sm text-red-500 mt-1 block">
      {message}
    </span>
  );
};

export default Error;
