import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import URL from 'utils/url';
import nicknameData from "assets/jsons/nicknameData.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
    const navigate = useNavigate();

    // 로그인인지, 회원가입인지 체크하는 변수
    const [displayType, setDisplayType] = useState('sign-in');
    // 추천 닉네임을 위한 변수
    const [recomNickname, setRecomNickname] = useState('');
    // 이메일 인증코드 전송 여부
    const [isSendEmail, setIsSendEmail] = useState(false);
    // 이메일 인증 여부
    const [isConfirmedEmail, setIsConfirmedEmail] = useState(false);
    // 이메일 인증코드
    const [confirmEmailNum, setConfirmEmailNum] = useState('');
    // 회원가입에 필요한 정보
    const [signUpData, setSignUpData] = useState({
        nickname: recomNickname,
        stdntNum: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    // 로그인에 필요한 정보
    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
    });

    // 로그인 <-> 회원가입 이동 핸들러
    const handleAuthTypeToggle = (type) => {
        setDisplayType(type);
        // 모든 입력값 초기화
        // 로그인 정보도 초기화 해야 함.
        setRecomNickname('');
        setIsSendEmail(false);
        setIsConfirmedEmail(false);
        setConfirmEmailNum('');
        setSignUpData({
            nickname: '',
            stdntNum: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    // 닉네임 생성
    const generateNickname = () => {
        // 형용사
        const nicknameAdjective = nicknameData.adjectives[Math.floor(Math.random() * nicknameData.adjectives.length)];
        // 동물 이름
        const nicknameAnimal = nicknameData.animals[Math.floor(Math.random() * nicknameData.animals.length)];    
        // 추천 닉네임 수정
        setRecomNickname(nicknameAdjective + nicknameAnimal);
    };

    // 회원가입 유효성 검증
    const validateSignUp = () => {
        // alert용 에러 저장
        let errors = [];

        // 닉네임 검증
        if(signUpData.nickname.length === 0) errors.push("닉네임은 필수값 입니다.\n");
        else if(!/^[0-9ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]+$/.test(signUpData.nickname)) errors.push("닉네임은 숫자, 한글, 영어의 조합으로만 작성이 가능합니다.\n");
        else if(signUpData.nickname.length > 10) errors.push("닉네임은 10자 이내로 작성이 가능합니다.\n");

        // 학번 검증
        if(signUpData.stdntNum.length === 0) errors.push("학번은 필수값 입니다.\n");
        else if(!/^\d{8}$/.test(signUpData.stdntNum)) errors.push("학번은 8자리 숫자여야 합니다.\n");

        // 이메일 앞자리 검증
        if(signUpData.email.length === 0) errors.push("이메일 앞자리는 필수값 입니다.\n");
        else if(!/^[0-9a-zA-Z]+$/.test(signUpData.email)) errors.push("이메일은 숫자, 영어의 조합으로만 작성이 가능합니다.\n");
        else if(!isSendEmail) errors.push("이메일 인증을 위해 전송버튼을 클릭해주세요.\n");
        else if(!isConfirmedEmail) errors.push("이메일 인증을 위해 인증버튼을 클릭해주세요.\n");
        
        // 비밀번호 검증
        if(signUpData.password.length === 0) errors.push("비밀번호는 필수값 입니다.\n");
        else if(!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(signUpData.password)) errors.push("비밀번호는 8자 이상, 영어, 숫자, 특수문자가 각 하나 이상 포함되어야 합니다.\n");
        
        // 비밀번호 확인 검증
        if(signUpData.confirmPassword.length === 0) errors.push("비밀번호 확인은 필수값 입니다.\n");

        if(errors.length !== 0){
            alert(errors.join('')); // 유효성 검증 실패 시 알림
            return false; // 회원가입 진행 X
        } else {
            return true; // 회원가입 진행
        }
    };
    
    // 이메일 인증코드 전송
    const sendEmailConfirmNum = () => {
        const reqestURL = '/api/auth/sendEmailConfirmNum';
        axios
            .post(reqestURL, {
                    email: signUpData.email + '@inha.edu'
                }, {
                    headers: { 'Content-Type': 'application/json'}
                }
            )
            .then( // 인증코드 전송 성공
                (res) => {
                    setIsSendEmail(true);
                }
            )
            .catch( // 인증코드 전송 실패
                (err) => { 
                    setIsSendEmail(false);
                    alert('인증코드 전송에 실패했습니다. 유효한 메일인지 확인해주세요.'); 
                }
            )
    };

    // 이메일 검증
    const confirmEmail = () => {
        const reqestURL = '/api/auth/confirmEmail';
        axios
            .post(reqestURL, {
                    confirmEmailNum
                }, {
                    headers: { 'Content-Type': 'application/json'}
                }
            )
            .then( // 검증 성공
                (res) => {
                    setIsConfirmedEmail(true);
                }
            )
            .catch( // 검증 실패
                (err) => { 
                    setIsConfirmedEmail(false);
                    alert('이메일 인증에 실패했습니다. 인증코드를 다시 입력해주세요.');
                 }
            )
    };

    // 회원가입 수행
    const handleSignUp = useCallback(() => {
        // 유효성 검증
        validateSignUp();

        const reqestURL = '/api/auth/signUp';
        axios
            .post(reqestURL, {
                    nickname: signUpData.nickname,
                    stdntNum: signUpData.stdntNum,
                    email: signUpData.email + '@inha.edu',
                    password: signUpData.password,
                }, {
                    headers: { 'Content-Type': 'application/json'}
                }
            )
            .then( // 회원가입 성공
                (res) => {
                    setDisplayType('sign-in');
                }
            )
            .catch( // 회원가입 실패
                (err) => { console.error('회원가입에 실패했습니다.', err); }
            )
    }, [signUpData]);

    // 초기 로딩, 추천 닉네임이 바뀌었을 때 실행
    useEffect(() => {
        // 회원가입 정보의 닉네임 갱신
        setSignUpData((prev) => ({...prev, nickname: recomNickname}));
    }, [recomNickname]);
    
    // 로그인 수행
    const handleSignIn = useCallback(() => {
        const reqestURL = '/api/auth/signIn';
        axios
            .post(reqestURL, {
                email: signInData.email,
                password: signInData.password,
            }, {
                headers: { 'Content-Type': 'application/json'}
                }
            )
            .then( // 로그인 성공
                (res) => {
                    console.log(res);
                    setDisplayType('sign-in');
                }
            )
            .catch( // 로그인 실패
                (err) => { console.error('로그인에 실패하였습니다.', err); }
            )
    }, [signInData]);

    return(
        <div id="container" className={`container ${displayType}`}>
        {/* <!-- FORM SECTION --> */}
            <div className="row">
            {/* <!-- SIGN UP --> */}
            <div className="col align-items-center flex-col sign-up">
                <div className="form-wrapper align-items-center">
                <div className="form sign-up">
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, nickname: e.target.value}))} value={signUpData.nickname} maxLength={10} className="nickname" type="text" placeholder="*닉네임"/>
                        <button onClick={generateNickname} className="refresh-nickname-button"><FontAwesomeIcon icon={faRotateRight} /></button>
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, stdntNum: e.target.value}))} value={signUpData.stdntNum} maxLength={8} type="text" placeholder="*학번"/>
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, email: e.target.value}))} value={signUpData.email} disabled={isSendEmail} className="email" type="text" placeholder="*이메일 앞자리"/>
                        @inha.edu
                        { isSendEmail 
                            ? <button className="disabled-button">전송</button>
                            : <button onClick={sendEmailConfirmNum} className="confirm-email-button">전송</button>
                        }
                        { (isSendEmail && !isConfirmedEmail) &&
                            (<>
                                <input onChange={(e) => setConfirmEmailNum(e.target.value)} className="confirm-email" type="text" placeholder="*인증코드 입력"/>
                                <button onClick={confirmEmail} className="confirm-email-button">인증</button>
                            </>)
                        }
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, password: e.target.value}))} value={signUpData.password} type="password" placeholder="*비밀번호"/>
                    </div>
                    <div className="input-group">
                        <input onChange={(e) => setSignUpData((prev) => ({...prev, confirmPassword: e.target.value}))} value={signUpData.confirmPassword} type="password" placeholder="*비밀번호 확인"/>
                        {signUpData.password && ((signUpData.password === signUpData.confirmPassword)
                            ? <span className="text-success">비밀번호가 일치합니다.</span>
                            : <span className="text-warning">비밀번호가 일치하지 않습니다.</span>
                        )}
                    </div>
                    <button onClick={() => handleSignUp()} className="default-button">회원가입</button>
                    <p>
                        <span>회원가입한 적이 있으신가요?</span>&nbsp;
                        <b onClick={() => handleAuthTypeToggle('sign-in')} className="pointer">로그인 하러 가기!</b>
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
                            <input onChange={(e) => setSignInData((prev) => ({...prev, email: e.target.value}))} value={signInData.email} type="text" placeholder="아이디"/>
                        </div>
                        <div className="input-group">
                            <i className='bx bxs-lock-alt'></i>
                            <input onChange={(e) => setSignInData((prev) => ({...prev, password: e.target.value}))} value={signInData.password} type="password" placeholder="비밀번호"/>
                        </div>
                        <button onClick={() => handleSignIn()} className="default-button">로그인</button>
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