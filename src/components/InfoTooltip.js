
import React from "react";
import No from '../images/no.svg';
import Yes from '../images/yes.svg'

function InfoTooltip({ name, isOpen, onClose }) {

  return (
    <>
      <div className={`popup popup_type_${name} ${isOpen ? 'popup_is-opened' : ""}`} >
        <div className="popup__container">
          <img className="popup__info-pic" img src={No}/>
          <h2 className="popup__title">Что-то пошло не так! Попробуйте ещё раз</h2>
          <button className="popup__close-button button" type="button" onClick={onClose}></button>
        </div>
      </div>
    </>
  )
}

export default InfoTooltip
