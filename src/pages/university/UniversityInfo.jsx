import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UniversityInfo = () => {
    const [activeTab, setActiveTab] = useState("About"); // 기본 탭: About
    const [university, setUniversity] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false); // 모달 열림/닫힘 상태
    const [newDepartment, setNewDepartment] = useState({ // 입력값 상태
        deptName: "",
        field: "",
        recruitNum: 0,
        method: "",
        addInfo: ""
    });
    const { sq } = useParams();

    // 탭 변경 핸들러
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        axios.get(`/api/univ/info/${sq}`)
            .then((res) => setUniversity(res.data))
            .catch((err) => {
                console.error("Error fetching university info:", err);
                alert("정보를 가져오는데 실패했습니다.");
            });
    }, [sq]);

    // 학과 추가 요청 핸들러
    const handleAddDepartment = () => {
        axios.post(`/api/univ/info/${sq}/addDept`, newDepartment)
            .then(() => {
                alert("학과가 성공적으로 추가되었습니다!");
                fetchUniversityInfo();
                setModalOpen(false); // 모달 닫기
            })
            .catch((err) => {
                console.error("학과 추가 중 오류 발생:", err);
                alert("학과 추가에 실패했습니다.");
            });
    };

    // 학과 삭제 요청 핸들러
    const handleDeleteDepartment = (deptSq) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return; // 사용자 확인

        axios.delete(`/api/univ/info/${sq}/deleteDept/${deptSq}`)
            .then(() => {
                alert("학과가 성공적으로 삭제되었습니다!");
                fetchUniversityInfo(); // 데이터 새로고침
            })
            .catch((err) => {
                console.error("학과 삭제 중 오류 발생:", err);
                alert("학과 삭제에 실패했습니다.");
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchUniversityInfo = () => {
        axios.get(`/api/univ/info/${sq}`)
            .then((res) => setUniversity(res.data))
            .catch((err) => {
                console.error("Error fetching university info:", err);
                alert("정보를 가져오는데 실패했습니다.");
            });
    };

    useEffect(() => {
        fetchUniversityInfo();
    }, [sq]);

    if (!university) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            {/* 네비 박스 */}
            <div className="nav-box">
                <div className="nav-logo">
                    <img src={university.imgURL} alt="University Logo" />
                </div>
                <div className="university-name">{university.univName}</div>
                <div className="department-info">{university.deptName}</div>
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
                            <li
                                className={activeTab === "Contact" ? "active" : ""}
                                onClick={() => handleTabChange("Contact")}
                            >
                                Contact
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="main-content">
                    {/* 조건부 렌더링 */}
                    {activeTab === "학교정보" && <div>

                    </div>}
                    {activeTab === "모집요강" && (
                        <div>
                            <table class="responsive-table">
                                <caption>모집요강</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">모집단위</th>
                                        <th scope="col">계열</th>
                                        <th scope="col">모집인원</th>
                                        <th scope="col">전형 방법</th>
                                        <th scope="col">특이사항</th>
                                        <th scope="col">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {university.departments && university.departments.map((dept, index) => (
                                        <tr key={index}>
                                            <th scope="row">{dept.deptName}</th>
                                            <td>{dept.field}</td>
                                            <td>{dept.recruitNum}</td>
                                            <td>{dept.method}</td>
                                            <td>{dept.addInfo}</td>
                                            <td>
                                                <button>수정</button>
                                                |
                                                <button onClick={() => handleDeleteDepartment(dept.deptSq)}>삭제</button></td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="6">
                                            <button onClick={() => setModalOpen(true)}>추가</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === "자유게시판" && <div>Portfolio Page is Here!</div>}
                    {activeTab === "Q&A" && <div>Blog Page Loaded!</div>}
                    {activeTab === "Contact" && <div>Contact Us Page!</div>}
                </div>
            </div>
            {/* 모달 창 */}
            {isModalOpen && (
                <div className="add-department-modal">
                    <div className="add-department-modal-content">
                        <h2>학과 추가</h2>
                        <label>
                            학과 이름:
                            <input
                                type="text"
                                name="deptName"
                                value={newDepartment.deptName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            계열:
                            <input
                                type="text"
                                name="field"
                                value={newDepartment.field}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            모집 인원:
                            <input
                                type="number"
                                name="recruitNum"
                                value={newDepartment.recruitNum}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            전형 방법:
                            <input
                                type="text"
                                name="method"
                                value={newDepartment.method}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            특이 사항:
                            <input
                                type="text"
                                name="addInfo"
                                value={newDepartment.addInfo}
                                onChange={handleInputChange}
                            />
                        </label>
                        <div className="add-department-modal-buttons">
                            <button onClick={handleAddDepartment}>등록</button>
                            <button onClick={() => setModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityInfo;