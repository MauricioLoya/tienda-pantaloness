import '../globals.css';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const LoginPage: React.FC<Props> = ({ children }) => {

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
export default LoginPage;
