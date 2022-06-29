
import { useState, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import Footer from './Footer';
import api from '../utils/api';


import * as auth from './auth';

import { Switch, Route, useHistory } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});


  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const history = useHistory();
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);




  useEffect(() => {
    Promise.all([api.getUserInformation(), api.getAllCards()])
      .then(([data, cards]) => {
        setCurrentUser(data);
        setCards(cards)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      }).catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      }).catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser({ name, about }) {
    api.editProfile(name, about)
      .then(() => {
        const editedUserInfo = { ...currentUser };
        editedUserInfo.name = name;
        editedUserInfo.about = about;
        setCurrentUser({ ...editedUserInfo });
        closeAllPopups();
      }).catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api.editAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      }).catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace({ name, link }) {
    api.addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      }).catch((err) => {
        console.log(err);
      });
  }

  //Проверка токена для зареганых
  useEffect(() => {
    const userToken = localStorage.getItem('jwt');
    if (userToken) {
      auth.getInfoToken(userToken)
        .then((data ) => {
          setLoggedIn(true);
          setEmail(data.data.email);
          history.push('/');
        })
        .catch(() => console.log('Лиза-проверка'));
    }
  }, [history]);

  //Зарегать нового пользователя
  function handleRegister(email, password) {
    auth.registerUser(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          console.log(loggedIn)
          history.push('/sign-in');
        }
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }

  //Функция - залогиниться в системе
  function handleLogin({ email, password }) {
    auth.authorizeUser({ email, password })
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setLoggedIn(true);
        console.log(loggedIn);
        setEmail(email)
        history.push('/');
      })
      .catch(() => console.log('Лиза'));
  }

  //Функция выхода из профиля
  function exitProfile() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setEmail('');
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header loggedIn={loggedIn} email={email} onSignOut={exitProfile} />

        <Switch>
          <ProtectedRoute
            exact path='/'
            loggedIn={loggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />

          <Route path='/sign-up'>
            <Register onRegister={handleRegister} />
          </Route>

          <Route exact path='/sign-in'>
            <Login onLogin={handleLogin} />
          </Route>




        </Switch>


        <Footer />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />
        <InfoTooltip isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />

        <PopupWithForm
          name={"delete"}
          title={"Вы уверены?"}
          isOpen={false}
          onClose={closeAllPopups}
          buttonText={"Да"}>
        </PopupWithForm>
        <InfoTooltip
          name={"info"}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider >
  );
}

export default App;

