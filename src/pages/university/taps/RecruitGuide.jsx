import React, { useState } from "react";
import axios from "axios";

const RecruitGuide = ({ recruitGuide, fetchRecruitGuide, univSq }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDepartment, setNewDepartment] = useState({
        deptName: "",
        field: "",
        recruitNum: 0,
        method: "",
        addInfo: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 학과 추가 요청 핸들러
    const handleAddDepartment = () => {
        axios.post(`/api/univ/info/${univSq}/addDept`, newDepartment)
            .then(() => {
                alert("학과가 성공적으로 추가되었습니다!");
                fetchRecruitGuide();
                setIsModalOpen(false); // 모달 닫기
            })
            .catch((err) => {
                console.error("학과 추가 중 오류 발생:", err);
                alert("학과 추가에 실패했습니다.");
            });
    };

    // 학과 삭제 요청 핸들러
    const handleDeleteDepartment = (deptSq) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return; // 사용자 확인

        axios.delete(`/api/univ/info/${univSq}/deleteDept/${deptSq}`)
            .then(() => {
                alert("학과가 성공적으로 삭제되었습니다!");
                fetchRecruitGuide(); // 데이터 새로고침
            })
            .catch((err) => {
                console.error("학과 삭제 중 오류 발생:", err);
                alert("학과 삭제에 실패했습니다.");
            });
    };

    return (
        <div>
            <table className="responsive-table">
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
                    {recruitGuide.departments &&
                        recruitGuide.departments.map((dept) => (
                            <tr key={dept.deptSq}>
                                <th scope="row">{dept.deptName}</th>
                                <td>{dept.field}</td>
                                <td>{dept.recruitNum}</td>
                                <td>{dept.method}</td>
                                <td>{dept.addInfo}</td>
                                <td>
                                    <button>수정</button> |{" "}
                                    <button onClick={() => handleDeleteDepartment(dept.deptSq)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    <tr>
                        <td colSpan="6">
                            <button onClick={() => setIsModalOpen(true)}>추가</button>
                        </td>
                    </tr>
                </tbody>
            </table>

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
                            <button onClick={() => setIsModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruitGuide;