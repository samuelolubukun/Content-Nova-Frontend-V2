import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to home component
  return <Navigate to="/" replace />;
};

export default Index;
