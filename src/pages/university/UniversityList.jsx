import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

import gachon from '../../assets/image/univLogo/gachon.jpeg';
import catholic from '../../assets/image/univLogo/catholic.jpg';
import konkuk from '../../assets/image/univLogo/konkuk.png';
import kyunghee from '../../assets/image/univLogo/kyunghee.png';

const Card = ({ logo, name, department }) => (
    <div className="univ_list-card">
        <img src={logo} alt="School Logo" />
        <h3>{name}</h3>
        <p>{department}</p>
    </div>
);

const CardGrid = () => {
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();
    const [homeData, setHomeData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCard, setNewCard] = useState({ logo: '', name: '', department: '' });
    
    useEffect(() => {
        // 사용자가 /home으로 들어왔을 때 데이터 가져오기
        axios.get('/api/univ/list')
            .then((res) => {
                console.log(res.data);
                const formattedData = res.data.map((item) => ({
                    logo: item.univLogoURL, // API의 univLogoURL을 logo로 매핑
                    name: item.univName,    // API의 univName을 name으로 매핑
                    department: item.univDept // API의 univDept을 department로 매핑
                }));
                setCards(formattedData); // 데이터 저장
            })
            .catch((err) => {
                console.error("Error fetching home data:", err);
                alert("데이터를 가져오는 중 오류가 발생했습니다.");
            });
    }, []); // 컴포넌트 마운트 시 실행

    // 추가 학교 정보 등록
    const handleAddCard = async () => {
        const reqestURL = '/api/univ/list/add';
        try {
            const newCardData = {
                univLogoURL: newCard.logo,
                univName: newCard.name,
                univDept: newCard.department,
            };
    
            // 서버에 새 데이터 추가
            await axios.post(reqestURL, newCardData, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            // 요청 성공: 상태 업데이트
            setCards((prevCards) => [
                ...prevCards,
                {
                    logo: newCard.logo,
                    name: newCard.name,
                    department: newCard.department,
                },
            ]);
    
            // 상태 초기화
            setIsModalOpen(false);
            setNewCard({ logo: '', name: '', department: '' });
    
            // 성공 메시지
            toast.success('새 학교 정보가 성공적으로 추가되었습니다!');
        } catch (error) {
            console.error('Failed to add card:', error);
            toast.error('새 학교 정보 추가에 실패했습니다.');
        }
    };


    return (
        <div className="univ_list-grid-container">
            <div className="univ_list-grid">
                {cards.map((card, index) => (
                    <Card key={index} logo={card.logo} name={card.name} department={card.department} />
                ))}
            <button className="add-card-button" onClick={() => setIsModalOpen(true)}>Add Card</button>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Card</h2>
                        <input
                            type="text"
                            placeholder="Logo URL"
                            value={newCard.logo}
                            onChange={(e) => setNewCard({ ...newCard, logo: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="School Name"
                            value={newCard.name}
                            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Department"
                            value={newCard.department}
                            onChange={(e) => setNewCard({ ...newCard, department: e.target.value })}
                        />
                        <button onClick={handleAddCard}>Add</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardGrid;
