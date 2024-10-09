import React, { useState } from 'react';

function ButtonExample() {
    const [isFirstButtonClicked, setIsFirstButtonClicked] = useState(false);

    const handleFirstButtonClick = () => {
        setIsFirstButtonClicked(true); // 첫 번째 버튼 클릭 상태 변경
        alert("첫 번째 버튼이 클릭되었습니다.");
    };

    const handleSecondButtonClick = () => {
        if (!isFirstButtonClicked) {
            alert("첫 번째 버튼을 클릭해주세요."); // 알림 띄우기
        } else {
            alert("두 번째 버튼이 클릭되었습니다.");
            // 두 번째 버튼 클릭 시 다른 작업 수행 가능
        }
    };

    return (
        <div>
            <button onClick={handleFirstButtonClick}>첫 번째 버튼</button>
            <button onClick={handleSecondButtonClick}>두 번째 버튼</button>
        </div>
    );
}

export default ButtonExample;