
import './App.css'
import { RoutesLayout } from './routes/routes';
import { AuthProvider } from './context/authContext';

function App() {

  return (
    <AuthProvider>
      <RoutesLayout />

    </AuthProvider>
  )
}

export default App
