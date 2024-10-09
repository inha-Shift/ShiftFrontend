import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'assets/stylesheets/auth.css';
import 'assets/stylesheets/common.css';
import URL from 'utils/url';

import Login from 'pages/auth/login';

function App() {
  return (
    <BrowserRouter>
				{/* <Header /> */}
				<Routes>
					<Route path={URL.MAIN} element={<Login />}></Route>
					<Route path={URL.AUTH_LOGIN} element={<Login />}></Route>
				</Routes>
			</BrowserRouter>
  );
}

export default App;
