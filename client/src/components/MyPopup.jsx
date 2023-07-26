import React from 'react';
import { Popup } from 'semantic-ui-react';

const MyPopup = ({ content, children }) => {
  return <Popup content={content} inverted trigger={children} />;
};

export default MyPopup;
