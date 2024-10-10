import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import URL from 'utils/url';

export default function Main(){
    const navigate = useNavigate();

    // 권한 체크
    const confirmAuth = () => {
        const reqestURL = '/api/auth/confirmAuth';
        axios
            .get(reqestURL)
            .then( // 검증 성공
                () => {
                    // Do nothing
                }
            )
            .catch( // 검증 실패
                () => {
                    alert('권한이 없는 사용자 입니다. 로그인 페이지로 이동합니다.');
                    navigate(URL.AUTH_SIGN);
                }
            )
    };

    useEffect(() => {
        // confirmAuth();
    }, []);

    return(<div>Welcome Shift!</div>);
}