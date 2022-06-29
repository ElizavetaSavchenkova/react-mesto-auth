import { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email, password });
  }

  return (
    <section className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__form-title">Вход</h2>
        <fieldset className="login__form-fieldset">
          <label className="login__form-label">
            <input className="login__form-input" id="loginone" type="email" name=""
              placeholder="Email" required onChange={handleEmailChange}/>
            <span className="login__form-input-error"></span>
          </label>
          <label className="login__form-label">
            <input className="login__form-input" id="logintwo" type="password" name=""
              placeholder="Пароль" required onChange={handlePasswordChange}/>
            <span className="login__form-input-error"></span>
          </label>
          <button className="login__button" type="">Войти</button>
        </fieldset>
        <p className='login__form-signin'>Уже зарегистрированы? Войти</p>
      </form>
    </section>
  );
}

export default Login;
