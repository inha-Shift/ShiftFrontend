import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'assets/stylesheets/auth.css';
import 'assets/stylesheets/common.css';
import URL from 'utils/url';

import Main from 'pages/home/Main';
import Login from 'pages/auth/Login';
import OAuthAdditionalInfo from 'pages/auth/OAuthAdditionalInfo';


function App() {
  return (
    <BrowserRouter basename={URL.MAIN}>
		{/* <Header /> */}
		<Routes>
			<Route index path={URL.MAIN} element={<Main />}></Route>
			<Route path={URL.AUTH_SIGN} element={<Login />}></Route>
			<Route path={URL.AUTH_OAUTH_ADD_INFO} element={<OAuthAdditionalInfo />}></Route>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
