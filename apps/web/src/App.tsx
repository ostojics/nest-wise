import './App.css';
import LoginForm from './modules/auth/components/login-form';
import HomePage from './modules/home/components/home-page';

function App() {
  return (
    <section>
      <HomePage />
      <h2>Form with shared validation package</h2>
      <LoginForm />
    </section>
  );
}

export default App;
