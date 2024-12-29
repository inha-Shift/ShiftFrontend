import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'assets/stylesheets/auth.css';
import 'assets/stylesheets/common.css';
import 'assets/stylesheets/univList.css';
import 'assets/stylesheets/univInfo.css';
import 'assets/stylesheets/university/taps/infomation.css';
import 'assets/stylesheets/university/taps/recruitGuide.css';
import URL from 'utils/url';

import Main from 'pages/home/Main';
import Login from 'pages/auth/Login';
import OAuthAdditionalInfo from 'pages/auth/OAuthAdditionalInfo';
import UnivList from 'pages/university/UniversityList';
import UnivInfo from 'pages/university/UniversityInfo';

function App() {
  return (
    <BrowserRouter>
		{/* <Header /> */}
		<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
		<Routes>
			<Route path={URL.MAIN} element={<Main />}></Route>
			<Route path={URL.LOGIN} element={<Login />}></Route>
			<Route path={URL.AUTH_OAUTH_ADD_INFO} element={<OAuthAdditionalInfo />}></Route>
			<Route path={URL.UNIV_LIST} element={<UnivList />}></Route>
			<Route path={URL.UNIV_LIST_INFO} element={<UnivInfo />}></Route>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
