import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // navigate 추가

import axios from 'axios';

const Card = ({ sq, logo, name, department, onCardClick, onDelete, onEdit }) => (
    <div className="univ-list-card" onClick={() => onCardClick(sq)}>
        <img src={logo} alt="School Logo" />
        <h3>{name}</h3>
        <p>{department}</p>
        <div className="univ-card-actions">
            <span
                onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    onEdit();
                }}
                className="univ-card-action-text"
            >
                수정
            </span>
            <span className="univ-card-action-separator"> | </span>
            <span
                onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    onDelete(sq);
                }}
                className="univ-card-action-text"
            >
                삭제
            </span>
        </div>
    </div>
);

const CardGrid = () => {
    const [cards, setCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
    const [currentEditingCard, setCurrentEditingCard] = useState(null); // 수정 중인 카드
    const [newCard, setNewCard] = useState({ logo: '', name: '', department: '', fileName: '' });
    const [isFormValid, setIsFormValid] = useState(false); // 학교 추가 등록 폼 검사
    const [isFileValid, setIsFileValid] = useState(false); // 이미지 형식 검사
    const [scrollPosition, setScrollPosition] = useState(0); // 스크롤 위치 저장 상태

    const navigate = useNavigate();

    /**
     * 사용자가 /univ/list로 들어왔을 때 데이터 가져오기
     */
    useEffect(() => {
        axios.get('/api/univ/list')
            .then((res) => {
                const formattedData = res.data.map((item) => ({
                    sq: item.univSq,
                    fileName: item.fileName,
                    logo: item.univLogoURL,
                    name: item.univName,
                    department: item.univDept
                }));
                setCards(formattedData); // 데이터 저장
            })
            .catch((err) => {
                console.error("Error fetching home data:", err);
                alert("데이터를 가져오는 중 오류가 발생했습니다.");
            });
    }, []); // 컴포넌트 마운트 시 실행

    useEffect(() => {
        // 페이지를 떠날 때 스크롤 위치 저장
        return () => {
          setScrollPosition(window.scrollY);
        };
      }, []);
    
      useEffect(() => {
        // 뒤로 오거나 페이지 진입 시 스크롤 복원
        window.scrollTo(0, scrollPosition);
      }, [scrollPosition]);
    

    // 카드 클릭 시 동작
    const handleCardClick = async (sq) => {
        navigate(`/univ/info/${sq}`);
    };

    /**
     * 대학교 추가 등록
     */
    const handleAddCard = async () => {
        const reqestURL = '/api/univ/list/add';
        try {
            const newCardData = {
                fileName: newCard.fileName,
                univLogoImage: newCard.logo,
                univName: newCard.name,
                univDept: newCard.department,
            };

            // 서버에 새 데이터 추가
            await axios.post(reqestURL, newCardData, {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
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
            setIsFileValid(false);

            toast.success('새 학교 정보가 성공적으로 추가되었습니다!');
        } catch (error) {
            toast.error('새 학교 정보 추가에 실패했습니다.');
        }
    };

    /**
     * 대학교 추가 등록 유효성 검사
     */
    useEffect(() => {
        // 유효성 검사 업데이트
        let isValid = newCard.name.trim() !== "" && newCard.department.trim() !== "";

        if (!isEditMode) {
            isValid = isValid && newCard.logo !== "";
        }

        setIsFormValid(isValid);
    }, [newCard, isEditMode]);

    /**
     * 대학교 정보 수정
     */
    const handleEditCard = async () => {
        const requestURL = `/api/univ/list/update/${currentEditingCard.sq}`;
        try {
            const updatedCardData = {
                univLogoImage: isFileValid ? newCard.logo : null,
                fileName: newCard.fileName,
                univName: newCard.name,
                univDept: newCard.department,
            };

            await axios.put(requestURL, updatedCardData, {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });

            setCards((prevCards) =>
                prevCards.map((card) =>
                    card.sq === currentEditingCard.sq
                        ? {
                            ...card,
                            logo: isFileValid ? newCard.logo : card.logo,
                            name: newCard.name,
                            department: newCard.department
                        }
                        : card
                )
            );
            setIsModalOpen(false);
            setNewCard({ logo: '', name: '', department: '' });
            setIsEditMode(false);
            toast.success("수정 되었습니다.");
        } catch (error) {
            console.error('Error editing card:', error);
            toast.error("수정에 실패했습니다.");
        }
    };

    /**
     * 수정 모달 열기
     */
    const handleEditModalClick = (card) => {
        setIsEditMode(true);
        setCurrentEditingCard(card);
        setNewCard({ logo: card.logo, name: card.name, department: card.department });
        setIsModalOpen(true);
    };

    /** 
     * 모달 닫기
     */
    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewCard({ logo: '', name: '', department: '', fileName: '' });
        setIsEditMode(false);
    };

    /**
     * 대학교 목록에서 삭제
     */
    const handleDeleteCard = async (sq) => {
        const requestURL = `/api/univ/list/delete/${sq}`;
        try {
            await axios.delete(requestURL);
            // 요청 sq에 해당하지 않는 카드들만 상태에 남긴다.
            setCards((prevCards) => prevCards.filter((card) => card.sq !== sq));
            toast.success("성공적으로 삭제되었습니다.");
        } catch (error) {
            toast.error("카드 삭제에 실패했습니다.");
        }
    }

    /**
     * 로고 이미지 유효성 검증
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setIsFileValid(false);
            setNewCard({ ...newCard, logo: '', fileName: '' });
            return;
        }

        // 허용되는 MIME 타입
        const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];

        if (!allowedTypes.includes(file.type)) {
            toast.error("JPG, PNG, SVG 파일만 업로드할 수 있습니다.");
            setIsFileValid(false);
            setNewCard({ ...newCard, logo: '', fileName: '' });
            return;
        }

        setIsFileValid(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewCard({ ...newCard, logo: reader.result, fileName: file.name });
        };
        reader.readAsDataURL(file);
    };


    return (
        <div className="univ-list-grid-container">
            <div className="univ-list-grid">
                {cards.map((card) => (
                    <Card
                        key={card.sq}
                        sq={card.sq}
                        logo={card.logo}
                        name={card.name}
                        department={card.department}
                        onCardClick={handleCardClick}
                        onDelete={handleDeleteCard}
                        onEdit={() => handleEditModalClick(card)}
                    />
                ))}
                <button className="univ-add-button" onClick={() => setIsModalOpen(true)}>Add Card</button>
            </div>

            {isModalOpen && (
                <div className="univ-modal">
                    <div className="univ-modal-content">
                        <h2>Add New Card</h2>
                        {newCard.logo && <img src={newCard.logo} alt="Preview" className="univ-image-preview" />}
                        <input type="file" onChange={handleFileChange} />
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
                        <button onClick={isEditMode ? handleEditCard : handleAddCard} disabled={!isFormValid}>
                            {isEditMode ? 'Update' : 'Add'}
                        </button>
                        <button onClick={handleModalClose}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardGrid;
