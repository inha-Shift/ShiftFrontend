import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const UnivInfoPage = ({ univSq, university, fetchUniversityInfo }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        slogan: "",
        univImgBase64: "",
        location: "",
        programType: "",
        mapQuery: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 학과 추가 요청 핸들러
    const handleSave = () => {
        const univInfo = {
            slogan: formData.slogan,
            univImgURL: formData.univImgBase64,
            location: formData.location,
            programType: formData.programType,
            mapQuery: formData.mapQuery,
        };

        axios
            .put(`/api/univ/info/${univSq}/updateInfo`, univInfo)
            .then(() => {
                fetchUniversityInfo(); // 학과 목록 갱신
                setIsModalOpen(false); // 모달 닫기
                alert("학과가 성공적으로 추가되었습니다!");
            })
            .catch((err) => {
                console.error("학과 추가 중 오류 발생:", err);
                alert("학과 추가에 실패했습니다.");
            });
    };

    // 파일 업로드 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    univImgBase64: reader.result, // Base64 값 저장
                }));
                setPreviewImage(reader.result); // 미리보기 이미지 설정
            };
            reader.readAsDataURL(file); // 파일을 Base64로 변환
        }
    };

    return (
        <div>
            {/* 슬로건 */}
            <div className="univInfoPage-slogan">
                <h1>{university.slogan}</h1>
            </div>

            {/* 이미지 공간 */}
            <div className="univInfoPage-image">
                <img src={university.univMainImgURL} alt="대학교 관련 이미지" />
            </div>

            {/* 추가 정보 공간 */}
            <div className="univInfoPage-info">
                <div className="univInfoPage-info-item">
                    <h3>위치</h3>
                    <p>{university.location || "위치를 입력하세요"}</p>
                </div>
                <div className="univInfoPage-info-item">
                    <h3>재직자전형학과</h3>
                    <p>{university.univDept || "아직 존재하지 않음"}</p>
                </div>
                <div className="univInfoPage-info-item">
                    <h3>구분</h3>
                    <p>
                        {university.programType === "NIGHT"
                            ? "야간"
                            : university.programType === "DAY"
                                ? "주간"
                                : "프로그램 타입을 입력하세요 (예: 주간/야간)"}
                    </p>
                </div>
            </div>

            {/* 지도 공간 */}
            <div className="univInfoPage-map">
                <iframe
                    title="학교 위치 지도"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${formData.mapQuery}`}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>

            {/* 수정 버튼 */}
            <button onClick={() => setIsModalOpen(true)}>수정</button>

            {/* 모달 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="univInfoPage-modal"
                overlayClassName="univInfoPage-overlay"
            >
                {/* 탭 메뉴 */}
                <div className="modal-tabs">
                    <button
                        className={activeTab === "general" ? "active" : ""}
                        onClick={() => setActiveTab("general")}
                    >
                        일반 정보
                    </button>
                    <button
                        className={activeTab === "extra-info" ? "active" : ""}
                        onClick={() => setActiveTab("extra-info")}
                    >
                        위치 및 프로그램 타입
                    </button>
                    <button
                        className={activeTab === "map" ? "active" : ""}
                        onClick={() => setActiveTab("map")}
                    >
                        지도 정보
                    </button>
                </div>

                {/* 탭 내용 */}
                <div className="modal-content">
                    {/* 일반 정보 탭 */}
                    {activeTab === "general" && (
                        <div className="general-info">
                            <label>슬로건</label>
                            <input
                                type="text"
                                name="slogan"
                                placeholder="슬로건을 입력하세요"
                                value={formData.slogan}
                                onChange={handleInputChange}
                                className="general-input"
                            />

                            <label>이미지 파일 첨부</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="general-input"
                            />

                            {previewImage && (
                                <div className="image-preview">
                                    <h4>이미지 미리보기</h4>
                                    <img
                                        src={previewImage}
                                        alt="미리보기"
                                        style={{ width: "100%", maxWidth: "300px", marginTop: "10px" }}
                                    />
                                </div>
                            )} 
                        </div>
                    )}

                    {/* 위치 및 프로그램 타입 탭 */}
                    {activeTab === "extra-info" && (
                        <div className="extra-info">
                            <label>위치</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="위치를 입력하세요"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="extra-input"
                            />

                            <label>프로그램 타입</label>
                            <input
                                type="text"
                                name="programType"
                                placeholder="프로그램 타입을 입력하세요 (예: 주간/야간)"
                                value={formData.programType}
                                onChange={handleInputChange}
                                className="extra-input"
                            />
                        </div>
                    )}

                    {/* 지도 정보 탭 */}
                    {activeTab === "map" && (
                        <div className="map-info">
                            <label>지도 검색어</label>
                            <input
                                type="text"
                                name="mapQuery"
                                placeholder="지도에 표시할 검색어를 입력하세요"
                                value={formData.mapQuery}
                                onChange={handleInputChange}
                                className="map-input"
                            />
                        </div>
                    )}
                </div>

                {/* 버튼 */}
                <div className="modal-buttons">
                    <button onClick={handleSave}>저장</button>
                    <button onClick={() => setIsModalOpen(false)}>취소</button>
                </div>
            </Modal>
        </div>
    );
};

export default UnivInfoPage;