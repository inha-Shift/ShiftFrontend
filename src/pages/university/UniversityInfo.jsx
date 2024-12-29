import React, { useEffect, useState, useCallback } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import RecruitGuide from "./taps/RecruitGuide";
import Infomation from "./taps/Infomation";

const UniversityInfo = () => {
    const [activeTab, setActiveTab] = useState("학교정보"); // 기본 탭: 학교정보
    const [university, setUniversity] = useState(null);
    const [recruitGuide, setRecruitGuide] = useState(null); // 모집요강 데이터 상태 추가
    const { sq } = useParams();

    const fetchUniversityInfo = useCallback(() => {
        axios.get(`/api/univ/info/${sq}`)
            .then((res) => {
                setUniversity(res.data);
            })
            .catch((err) => {
                console.error("Error fetching university info:", err);
                alert("정보를 가져오는데 실패했습니다.");
            });
    }, [sq]);

    const fetchRecruitGuide = useCallback(() => {
        axios.get(`/api/univ/info/${sq}/recruitGuide`)
            .then((res) => {
                setRecruitGuide(res.data);
            })
            .catch((err) => {
                console.error("Error fetching recruit guide:", err);
                alert("모집요강을 가져오는데 실패했습니다.");
            });
    }, [sq]);

    useEffect(() => {
        fetchUniversityInfo(); // 초기 로드 시 학교 정보 로드
    }, [fetchUniversityInfo]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);

        // 모집요강 탭일 경우 추가 요청
        if (tab === "모집요강" && !recruitGuide) {
            fetchRecruitGuide();
        }
        else if (tab === "학교정보" && !university) {
            fetchUniversityInfo();
        }
    };

    if (!university) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            {/* 네비 박스 */}
            <div className="nav-box">
                <div className="nav-logo">
                    <img src={university.univLogoImgURL} alt="University Logo" />
                </div>
                <div className="university-name">{university.univName}</div>
                <div className="department-info"></div>
                <div className="department-info">입학처:</div>
                <div className="department-info">학과 홈페이지:</div>
                <div className="department-info">연락처:</div>
            </div>

            {/* 정보 박스 */}
            <div className="content-box">
                <div className="top-navbar">
                    <nav className="navbar">
                        <ul>
                            <li
                                className={activeTab === "학교정보" ? "active" : ""}
                                onClick={() => handleTabChange("학교정보")}
                            >
                                학교정보
                            </li>
                            <li
                                className={activeTab === "모집요강" ? "active" : ""}
                                onClick={() => handleTabChange("모집요강")}
                            >
                                모집요강
                            </li>
                            <li
                                className={activeTab === "커리큘럼" ? "active" : ""}
                                onClick={() => handleTabChange("커리큘럼")}
                            >
                                커리큘럼
                            </li>
                            <li
                                className={activeTab === "자유게시판" ? "active" : ""}
                                onClick={() => handleTabChange("자유게시판")}
                            >
                                자유게시판
                            </li>
                            <li
                                className={activeTab === "Q&A" ? "active" : ""}
                                onClick={() => handleTabChange("Q&A")}
                            >
                                Q&A
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="main-content">
                    {/* 조건부 렌더링 */}
                    {activeTab === "학교정보" && (
                        university ? (
                            <Infomation
                                univSq={sq}
                                university={university}
                                fetchUniversityInfo={fetchUniversityInfo}
                            />
                        ) : (
                            <div> loading... </div>
                        )
                    )}
                    {activeTab === "모집요강" && (
                        recruitGuide ? (
                            <RecruitGuide
                                recruitGuide={recruitGuide}
                                fetchRecruitGuide={fetchRecruitGuide}
                                univSq={sq}
                            />
                        ) : (
                            <div>Loading 모집요강...</div>
                        )
                    )}
                    {activeTab === "커리큘럼" && <div>Contact Us Page!</div>}
                    {activeTab === "자유게시판" && <div>Portfolio Page is Here!</div>}
                    {activeTab === "Q&A" && <div>Blog Page Loaded!</div>}
                </div>
            </div>
        </div>
    );
};

export default UniversityInfo;