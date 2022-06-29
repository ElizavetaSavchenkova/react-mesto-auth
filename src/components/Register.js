

import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
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
    onRegister({ email, password });
  }

  return (
    <section className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__form-title">Регистрация</h2>
        <fieldset className="login__form-fieldset">
          <label className="login__form-label">
            <input className="login__form-input" id="" type="email" name=""
              placeholder="Email" required onChange={handleEmailChange}/>
            <span className="login__form-input-error"></span>
          </label>
          <label className="login__form-label">
            <input className="login__form-input" id="" type="password" name=""
              placeholder="Пароль" required onChange={handlePasswordChange}/>
            <span className="login__form-input-error"></span>
          </label>
          <button className="login__button" type="">Зарегистрироваться</button>
        </fieldset>
        <p className='login__signin'>Уже зарегистрированы?</p>
      </form>
    </section>
  );
}

export default Register;


