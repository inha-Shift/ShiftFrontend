import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

import { Map, MapMarker } from "react-kakao-maps-sdk"

Modal.setAppElement("#root");

const UnivInfoPage = ({ univSq, university, fetchUniversityInfo }) => {
    const { univLogoImgURL, univMainImgURL, univName, univDept, slogan, location, programType } = university;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        slogan: "",
        fileName: "",
        univImgBase64: "",
        location: "",
        programType: "",
    });
    const [markerPosition, setMarkerPosition] = useState({
        lat: 33.450701,
        lng: 126.570667,
    }); // 마커 초기 위치
    const [mapCenter, setMapCenter] = useState({
        lat: 33.450701,
        lng: 126.570667,
    }); // 지도 초기 중심

    useEffect(() => {
        if (university) {
            setFormData((prev) => ({
                ...prev,
                slogan: university.slogan || "",
                location: university.location || prev.location,
                programType: university.programType || "",
            }));
        }
        // university 값을 기반으로 formData 초기화
    }, [university]);

    // 카카오맵 검색을 통해 마커와 지도 중심 업데이트
    useEffect(() => {
        const kakao = window.kakao;
        const ps = new kakao.maps.services.Places();

        // location 값이 있으면 해당 위치를 설정
        if (location) {
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(location, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const place = result[0];
                    setMarkerPosition({ lat: parseFloat(place.y), lng: parseFloat(place.x) });
                    setMapCenter({ lat: parseFloat(place.y), lng: parseFloat(place.x) });
                } else {
                    console.error("주소를 찾을 수 없습니다:", location);
                }
            });
            // location 값이 없으면 univName을 기준으로 검색
        } else if (univName) {
            ps.keywordSearch(univName, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const place = data[0];
                    const address = place.road_address_name || place.address_name;

                    // 검색 결과를 location에 세팅
                    setFormData((prev) => ({
                        ...prev,
                        location: address,
                    }));

                    // 마커와 지도 중심 설정
                    setMarkerPosition({ lat: parseFloat(place.y), lng: parseFloat(place.x) });
                    setMapCenter({ lat: parseFloat(place.y), lng: parseFloat(place.x) });
                } else {
                    console.error("키워드 검색 결과를 찾을 수 없습니다:", univName);
                }
            });
        }
    }, [univName, location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 학교 정보 업데이트
    const handleUpdateInfo = () => {
        const univInfo = {
            slogan: formData.slogan,
            univImgURL: formData.univImgBase64,
            fileName: formData.fileName,
            location: formData.location,
            programType: formData.programType,
        };

        axios
            .put(`/api/univ/info/${univSq}/updateInfo`, univInfo)
            .then(() => {
                fetchUniversityInfo(); // 학과 목록 갱신
                setIsModalOpen(false); // 모달 닫기
                alert("학교 정보가 수정 되었습니다.");
            })
            .catch((err) => {
                console.error("학교 정보가 수정 중 오류 발생:", err);
                alert("학교 정보 수정에 실패했습니다.\n", err);
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
                    fileName: file.name,
                }));
                setPreviewImage(reader.result); // 미리보기 이미지 설정
            };
            reader.readAsDataURL(file); // 파일을 Base64로 변환
        }
    };

    // 수정 모달 창 열기
    const openModal = () => {
        setFormData((prev) => ({
            ...prev,
            location: prev.location || "",
        }));
        setIsModalOpen(true);
    };


    return (
        <div>
            {/* 슬로건 */}
            <div className="univInfoPage-slogan">
                <h3>{slogan}</h3>
            </div>

            {/* 이미지 공간 */}
            <div className="univInfoPage-image">
                <img src={univMainImgURL} alt="대학교 관련 이미지" />
            </div>

            {/* 추가 정보 공간 */}
            <div className="univInfoPage-info">
                <div className="univInfoPage-info-item">
                    <h3>위치</h3>
                    <p>{location || formData.location}</p>
                </div>
                <div className="univInfoPage-info-item">
                    <h3>재직자전형학과</h3>
                    <p>{univDept || "아직 존재하지 않음"}</p>
                </div>
                <div className="univInfoPage-info-item">
                    <h3>구분</h3>
                    <p>{programType || "확인되지 않음"}</p>
                </div>
            </div>

            <Map // 지도를 표시할 Container
                id="map"
                center={mapCenter}
                style={{
                    // 지도의 크기
                    width: "100%",
                    height: "350px",
                }}
                level={3} // 지도의 확대 레벨
            >
                <MapMarker // 마커를 생성합니다
                    position={markerPosition}
                    image={{
                        src: univLogoImgURL, // 마커이미지의 주소입니다
                        size: {
                            width: 64,
                            height: 69,
                        }, // 마커이미지의 크기입니다
                        options: {
                            offset: {
                                x: 27,
                                y: 69,
                            }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                        },
                    }}
                />
            </Map>

            {/* 수정 버튼 */}
            <button onClick={openModal}>수정</button>

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
                                value={formData.location || ""}
                                onChange={handleInputChange}
                                className="extra-input"
                            />

                            <label>학과 타입</label>
                            <input
                                type="text"
                                name="programType"
                                placeholder="학과 타입을 입력하세요 (예: 주간/야간)"
                                value={formData.programType || ""}
                                onChange={handleInputChange}
                                className="extra-input"
                            />
                        </div>
                    )}
                </div>

                {/* 버튼 */}
                <div className="modal-buttons">
                    <button onClick={handleUpdateInfo}>저장</button>
                    <button onClick={() => setIsModalOpen(false)}>취소</button>
                </div>
            </Modal>
        </div>
    );
};

export default UnivInfoPage;