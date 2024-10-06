import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import URL from 'utils/url';

export default function Login() {
    const navigate = useNavigate();

    // 로그인인지, 회원가입인지 체크하는 변수
    const [displayType, setDisplayType] = useState('sign-in');
    // 회원가입에 필요한 정보
    const [signUpData, setSignUpData] = useState({
        nickname: '',
        stdntNum: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // 로그인 수행
    const handleSignUp = useCallback(() => {
        const reqestURL = '/api/auth/signUp'; // 회원가입 API
        axios
            .post(reqestURL, {
                nickname: signUpData.nickname,
                stdntNum: signUpData.stdntNum,
                email: signUpData.email,
                password: signUpData.password,
            }, {
                headers: { 'Content-Type': 'application/json'}
                }
            ) 
            .then( // 회원가입 성공
                (res) => {
                    console.log(res);
                    setDisplayType('sign-in');
                }
            )
            .catch( // 회원가입 실패
                (err) => { console.error('회원가입에 실패하였습니다.', err); }
            )
    }, [signUpData]);

    return(
        <div id="container" className={`container ${displayType}`}>
        {/* <!-- FORM SECTION --> */}
            <div className="row">
            {/* <!-- SIGN UP --> */}
            <div className="col align-items-center flex-col sign-up">
                <div className="form-wrapper align-items-center">
                <div className="form sign-up">
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, nickname: e.target.value}))} defaultValue={signUpData.nickname} type="text" placeholder="*닉네임"/>
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, stdntNum: e.target.value}))} defaultValue={signUpData.stdntNum} type="email" placeholder="*학번"/>
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, email: e.target.value}))} defaultValue={signUpData.email} type="email" placeholder="*학번"/>
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, password: e.target.value}))} defaultValue={signUpData.password} type="password" placeholder="*비밀번호"/>
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, confirmPassword: e.target.value}))} defaultValue={signUpData.confirmPassword} type="password" placeholder="*비밀번호 확인"/>
                    </div>
                    <button onClick={() => handleSignUp()} className="default-button">회원가입</button>
                    <p>
                        <span>회원가입한 적이 있으신가요?</span>&nbsp;
                        <b onClick={() => setDisplayType('sign-in')} className="pointer">로그인 하러 가기!</b>
                    </p>
                </div>
                </div>
            
            </div>
            {/* <!-- END SIGN UP --> */}
            {/* <!-- SIGN IN --> */}
            <div className="col align-items-center flex-col sign-in">
                <div className="form-wrapper align-items-center">
                    <div className="form sign-in">
                        <div className="input-group">
                            <i className='bx bxs-user'></i>
                            <input type="text" placeholder="아이디"/>
                        </div>
                        <div className="input-group">
                            <i className='bx bxs-lock-alt'></i>
                            <input type="password" placeholder="비밀번호"/>
                        </div>
                        <button className="default-button">로그인</button>
                        <p>
                            <b onClick={() => navigate(URL.AUTH_FIND_ID)} className="pointer">아이디 찾기</b>
                            <b onClick={() => navigate(URL.AUTH_FIND_PW)} className="pointer v-separator">비밀번호 찾기</b>
                        </p>
                        <div className="oauth-group">
                            <button className="naver-login-button">네이버 로그인(임시)</button>
                            <button className="kakao-login-button">카카오 로그인(임시)</button>
                        </div>
                        <p>
                            <span>계정이 없으신가요?</span>&nbsp;
                            <b onClick={() => setDisplayType('sign-up')} className="pointer">회원가입 하러 가기!</b>
                        </p>
                    </div>
                </div>
                <div className="form-wrapper"></div>
            </div>
            {/* <!-- END SIGN IN --> */}
            </div>
            {/* <!-- END FORM SECTION --> */}
            {/* <!-- CONTENT SECTION --> */}
            <div className="row content-row">
                {/* <!-- SIGN IN CONTENT --> */}
                <div className="col align-items-center flex-col">
                    <div className="text sign-in">
                        <h2>Welcome</h2>
                    </div>
                    <div className="img sign-in"></div>
                </div>
                {/* <!-- END SIGN IN CONTENT --> */}
                {/* <!-- SIGN UP CONTENT --> */}
                <div className="col align-items-center flex-col">
                    <div className="img sign-up"></div>
                    <div className="text sign-up">
                        <h2>Join with us</h2>
                    </div>
                </div>
                {/* <!-- END SIGN UP CONTENT --> */}
            </div>
            {/* <!-- END CONTENT SECTION --> */}
        </div>
    );
}