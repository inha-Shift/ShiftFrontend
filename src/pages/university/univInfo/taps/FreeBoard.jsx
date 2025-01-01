import React, { useState } from "react";

const FreeBoard = () => {
  const [notices] = useState([
    {
      id: 1,
      title: "정보) 무안공항대참사 3대 원인 제공자 팩트다",
      date: "12/30",
      likes: 27,
      comments: 17,
      author: "익명",
    },
    {
      id: 2,
      title: "경제학과 최고 개추좀",
      date: "12/30",
      likes: 16,
      comments: 1,
      author: "익명",
    },
    {
      id: 3,
      title: "무안공항 참사에 깊은 애도를 표합니다.",
      date: "12/30",
      likes: 83,
      comments: 4,
      author: "익명",
    },
  ]);

  const handleWriteClick = () => {
    alert("글쓰기 페이지로 이동합니다!");
    // React Router navigate 로직 추가 가능
  };

  return (
    <section className="freeboard">
      {/* 상단 제목 */}
      <div className="freeboard-title-container">
        <h1>자유게시판</h1>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="freeboard-write-btn-container">
        <button
          onClick={handleWriteClick}
          className="freeboard-btn freeboard-btn-primary"
        >
          글쓰기
        </button>
      </div>

      {/* 게시판 리스트 */}
      <div className="freeboard-list">
        {notices.map((notice) => (
          <div key={notice.id} className="freeboard-card">
            <div className="freeboard-card-content">
              <span className="freeboard-category">자유게시판</span>
              <h3 className="freeboard-title">{notice.title}</h3>
              <div className="freeboard-info">
                <span className="freeboard-likes">❤️ {notice.likes}</span>
                <span className="freeboard-comments">💬 {notice.comments}</span>
                <span className="freeboard-date">{notice.date}</span>
                <span className="freeboard-author">{notice.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FreeBoard;