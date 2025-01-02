import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

import axios from "axios";

const FreeBoard = ({ univSq }) => {
  const [isWriting, setIsWriting] = useState(false); // 글쓰기 창 표시 여부
  const [postData, setPostData] = useState({ title: "", content: "" }); // 제목과 내용 관리
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글
  const [currentComment, setCurrentComment] = useState(""); // 현재 입력 중인 댓글
  const [posts, setPosts] = useState([]); // 게시글 리스트
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPage, setTotalPage] = useState(1); // 전체 페이지 수
  const postsPerPage = 7; // 페이지당 게시글 수
  
  // 날짜 포맷팅
  const formatDate = (dateString) => dateString.slice(0, 16).replace("T", " ");

  // 글쓰기 창 토글
  const handleWriteClick = () => {
    setIsWriting(!isWriting);
  };
  
  // 게시글 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };
  
  // 게시글 조회
  const fetchPosts = () => {
    axios
      .get(`/api/univ/board/${univSq}/posts`, {
        params: { page: currentPage, size: postsPerPage },
      })
      .then((response) => {
        setPosts(response.data.posts); // 현재 페이지 게시글
        setTotalPage(Math.floor(response.data.totalPosts / 7) + 1); // 전체 페이지 수
      })
      .catch((err) => {
        console.error("게시글 불러오기 오류:", err);
        toast.error("로그인이 필요합니다.")
      });
  };
  
  // 게시글 작성
  const handleSubmit = () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      toast.warn("제목과 내용을 모두 입력해주세요.");
      return;
    }
    axios
      .post(`/api/univ/board/${univSq}/post`, postData)
      .then(() => {
        alert("게시글이 작성되었습니다.");
        setPostData({ title: "", content: "" }); // 입력 필드 초기화
        fetchPosts(); // 게시판 새로고침
        setIsWriting(false); // 글쓰기 창 닫기
      })
      .catch((err) => {
        console.error("게시글 작성 중 오류:", err);
        alert("게시글 작성 중 문제가 발생했습니다.");
      });
  };

  // 게시글 수정
  const handleEditPost = (post) => {
    setIsWriting(true); // 글쓰기 창 열기
    setPostData({ title: post.title, content: post.content }); // 기존 데이터로 초기화
  };

  // 게시글 삭제
  const handleDeletePost = (postSq) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    axios
      .delete(`/api/univ/board/${univSq}/post/${postSq}`)
      .then(() => {
        alert("게시글이 삭제되었습니다.");
        fetchPosts(); // 게시판 새로고침
      })
      .catch((err) => {
        console.error("게시글 삭제 중 오류:", err);
        alert("게시글 삭제 중 문제가 발생했습니다.");
      });
  };

  // 댓글 작성
  const handleCommentSubmit = (postSq) => {
    if (!currentComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    axios
      .post(`/api/univ/board/${univSq}/post/${postSq}/comment`, { content: currentComment })
      .then(() => {
        alert("댓글이 작성되었습니다.");
        setCurrentComment(""); // 댓글 입력 초기화
        fetchPosts(); // 게시판 새로고침
      })
      .catch((err) => {
        console.error("댓글 작성 중 오류:", err);
        alert("댓글 작성 중 문제가 발생했습니다.");
      });
  };


  // 페이지 변경 핸들러
  const handleNextPage = () => {
    if (currentPage + 1 < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // 첫 로드 시 게시글 가져오기
  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  // 첫 로드 시 게시글 가져오기
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  return (
    <div className="freeboard">
      {/* 제목 */}
      <div className="freeboard-title-container">
        <h1>자유게시판</h1>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="freeboard-write-btn-container">
        <button onClick={handleWriteClick} className="freeboard-btn-primary">
          {isWriting ? "닫기" : "글쓰기"}
        </button>
      </div>

      {/* 글쓰기 창 */}
      {isWriting && (
        <div className="write-box">
          <input
            type="text"
            name="title"
            className="write-input"
            placeholder="제목을 입력하세요"
            value={postData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="content"
            className="write-textarea"
            placeholder="내용을 입력하세요"
            value={postData.content}
            onChange={handleInputChange}
          ></textarea>
          <button onClick={handleSubmit} className="freeboard-btn-primary submit-btn">
            작성 완료
          </button>
        </div>
      )}

      {/* 게시판 리스트 */}
      <div className="freeboard-list">
        {posts.map((post) => (
          <div key={post.postSq} className="freeboard-card">
            <div
              className="freeboard-card-content"
              onClick={() =>
                setSelectedPost((prev) => (prev === post.postSq ? null : post.postSq))
              }
            >
              {/* 수정 및 삭제 버튼 */}
              {post.isMyPost && (
                <div className="freeboard-actions">
                  <button
                    className="freeboard-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트가 상위로 전파되지 않도록
                      handleEditPost(post);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="freeboard-btn-danger"
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트가 상위로 전파되지 않도록
                      handleDeletePost(post.postSq);
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
              <h3 className="freeboard-title">{post.title}</h3>
              <p className="freeboard-content">{post.content}</p>
              <div className="freeboard-info">
                <span className="freeboard-author">{post.nickname}</span>
                <span className="freeboard-date">{formatDate(post.createdDate)}</span>
              </div>
            </div>
            {selectedPost === post.postSq && (
              <div className="comment-box">
                <textarea
                  className="comment-input"
                  placeholder="댓글을 입력하세요"
                  value={currentComment}
                  onChange={(e) => setCurrentComment(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleCommentSubmit(post.postSq)}
                  className="freeboard-btn-primary"
                >
                  댓글 작성
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="pagination-btn"
        >
          &lt;
        </button>
        <span className="pagination-info">
          {currentPage + 1} / {totalPage}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage + 1 >= totalPage}
          className="pagination-btn"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FreeBoard;