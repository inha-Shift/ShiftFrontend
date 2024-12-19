import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';

import nicknameData from "assets/jsons/nicknameData.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function OAuthMemberInfo() {
    const [recomNickname, setRecomNickname] = useState('');
    const [isSendEmail, setIsSendEmail] = useState(false);
    const [isConfirmedEmail, setIsConfirmedEmail] = useState(false);
    const [confirmEmailNum, setConfirmEmailNum] = useState('');
    const [signUpData, setSignUpData] = useState({
        nickname: recomNickname,
        stdntNum: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        nickname: '',
        stdntNum: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // 닉네임 생성
    const generateNickname = () => {
        // 형용사
        const nicknameAdjective = nicknameData.adjectives[Math.floor(Math.random() * nicknameData.adjectives.length)];
        // 동물 이름
        const nicknameAnimal = nicknameData.animals[Math.floor(Math.random() * nicknameData.animals.length)];
        // 추천 닉네임 수정
        setRecomNickname(nicknameAdjective + nicknameAnimal);
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'nickname':
                if (value.length === 0) error = '닉네임은 필수값 입니다.';
                else if (!/^[0-9ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]+$/.test(value)) error = '닉네임은 숫자, 한글, 영어의 조합으로만 작성이 가능합니다.';
                else if (value.length > 10) error = '닉네임은 10자 이내로 작성이 가능합니다.';
                break;

            case 'stdntNum':
                if (value.length === 0) error = '학번은 필수값 입니다.';
                else if (!/^\d{8}$/.test(value)) error = '학번은 8자리 숫자여야 합니다.';
                break;

            case 'email':
                if (value.length === 0) error = '이메일 앞자리는 필수값 입니다.';
                else if (!/^[0-9a-zA-Z]+$/.test(value)) error = '이메일은 숫자, 영어의 조합으로만 작성이 가능합니다.';
                break;

            case 'password':
                if (value.length === 0) error = '비밀번호는 필수값 입니다.';
                else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) error = '비밀번호는 8자 이상, 영어, 숫자, 특수문자가 각 하나 이상 포함되어야 합니다.';
                break;

            case 'confirmPassword':
                if (value !== signUpData.password) error = '비밀번호가 일치하지 않습니다.';
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error })); // 에러 업데이트
    };

    // 이메일 인증코드 전송
    const sendEmailConfirmNum = () => {
        setIsSendEmail(true);
        const reqestURL = '/api/auth/sendEmailConfirmNum';
        axios
            .post(reqestURL, {
                email: signUpData.email + '@inha.edu'
            }, {
                headers: { 'Content-Type': 'application/json' }
            }
            )
            .then( // 인증코드 전송 성공
                (res) => {
                }
            )
            .catch( // 인증코드 전송 실패
            //     (err) => { 
            //         setIsSendEmail(false);
            //         alert('인증코드 전송에 실패했습니다. 유효한 메일인지 확인해주세요.'); 
            //     }
        )
    };

    // 이메일 검증
    const confirmEmail = () => {
        const reqestURL = '/api/auth/confirmEmail';
        axios
            .post(reqestURL, {
                confirmEmailNum
            }, {
                headers: { 'Content-Type': 'application/json' }
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
        // validateSignUp();
        const reqestURL = '/api/auth/signUp';
        axios
            .post(reqestURL, {
                nickname: signUpData.nickname,
                stdntNum: signUpData.stdntNum,
                email: signUpData.email + '@inha.edu',
                password: signUpData.password,
            }, {
                headers: { 'Content-Type': 'application/json' }
            }
            )
            .then( // 회원가입 성공
                (res) => {
                    alert('축하드립니다. 회원가입에 성공하셨습니다!');
                }
            )
            .catch( // 회원가입 실패
                (err) => { console.error('회원가입에 실패했습니다.', err); }
            )
    }, [signUpData]);

    useEffect(() => {
        // 회원가입 정보의 닉네임 갱신
        setSignUpData((prev) => ({ ...prev, nickname: recomNickname }));
    }, [recomNickname]);

    return (
        <div id="container" className="container sign-up">
            {/* <!-- FORM SECTION --> */}
            <div className="row">
                {/* <!-- SIGN UP --> */}
                <div className="col align-items-center flex-col sign-up">
                    <div className="form-wrapper align-items-center">
                        <div className="form sign-up">
                            <div className="input-group">
                                <input
                                    name="nickname" // 필드 이름 설정
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setSignUpData((prev) => ({ ...prev, [name]: value })); // 상태 업데이트
                                        validateField(name, value); // 실시간 유효성 검증
                                    }}
                                    value={signUpData.nickname}
                                    maxLength={10}
                                    className="nickname"
                                    type="text"
                                    placeholder="*닉네임"
                                />
                                <button onClick={generateNickname} className="refresh-nickname-button"><FontAwesomeIcon icon={faRotateRight} /></button>
                                {errors.nickname && <span className="error-text">{errors.nickname}</span>}
                            </div>
                            <div className="input-group">
                                <input
                                    name="stdntNum"
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setSignUpData((prev) => ({ ...prev, [name]: value }));
                                        validateField(name, value);
                                    }}
                                    value={signUpData.stdntNum}
                                    maxLength={8}
                                    type="text"
                                    placeholder="*학번"
                                />
                                {errors.stdntNum && <span className="error-text">{errors.stdntNum}</span>}
                            </div>
                            <div className="input-group">
                                <input
                                    name="email"
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setSignUpData((prev) => ({ ...prev, email: e.target.value }));
                                        validateField(name, value);
                                    }}
                                    value={signUpData.email}
                                    disabled={isSendEmail}
                                    className="email"
                                    type="text"
                                    placeholder="*이메일 앞자리"
                                />
                                @inha.edu
                                {isSendEmail
                                    ? <button className="disabled-button">전송</button>
                                    : <button onClick={sendEmailConfirmNum} className="confirm-email-button">전송</button>
                                }
                                {(isSendEmail && !isConfirmedEmail) &&
                                    (<>
                                        <input onChange={(e) => setConfirmEmailNum(e.target.value)} className="confirm-email" type="text" placeholder="*인증코드 입력" />
                                        <button onClick={confirmEmail} className="confirm-email-button">인증</button>
                                    </>)
                                }
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                            <div className="input-group">
                                <input
                                    name="password"
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setSignUpData((prev) => ({ ...prev, [name]: value }));
                                        validateField(name, value);
                                    }}
                                    value={signUpData.password}
                                    type="password"
                                    placeholder="*비밀번호"
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>
                            <div className="input-group">
                                <input
                                    name="confirmPassword"
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setSignUpData((prev) => ({ ...prev, [name]: value }));
                                        validateField(name, value);
                                    }}
                                    value={signUpData.confirmPassword}
                                    type="password"
                                    placeholder="*비밀번호 확인"
                                />
                                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                                {signUpData.password && ((signUpData.password === signUpData.confirmPassword)
                                    ? <span className="text-success">비밀번호가 일치합니다.</span>
                                    : <span className="text-warning">비밀번호가 일치하지 않습니다.</span>
                                )}
                            </div>
                            <button onClick={() => handleSignUp()} className="default-button">회원가입</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}