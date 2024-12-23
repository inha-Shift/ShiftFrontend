import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'assets/stylesheets/auth.css';
import 'assets/stylesheets/common.css';
import URL from 'utils/url';

import Main from 'pages/home/Main';
import Login from 'pages/auth/Login';
import OAuthAdditionalInfo from 'pages/auth/OAuthAdditionalInfo';


function App() {
  return (
    <BrowserRouter>
		{/* <Header /> */}
		<Routes>
			<Route path={URL.LOGIN} element={<Login />}></Route>
			<Route path={URL.MAIN} element={<Main />}></Route>
			<Route path={URL.AUTH_OAUTH_ADD_INFO} element={<OAuthAdditionalInfo />}></Route>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
