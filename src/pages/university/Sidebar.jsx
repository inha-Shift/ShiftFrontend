import React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar" data-sidebar>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <img
            src="https://i.postimg.cc/JzBWVhW4/my-avatar.png"
            alt="avatar"
            width="80"
          />
        </figure>
        <div className="info-content">
          <h1 className="name" title="Richard Hanrick">
            Richard Hanrick
          </h1>
          <p className="title">Web Developer</p>
        </div>
        <button className="info-more-btn" data-sidebar-btn>
          <span>Show Contacts</span>
          <ion-icon name="chevron-down"></ion-icon>
        </button>
      </div>
      <div className="sidebar-info-more">
        <div className="separator"></div>
        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="mail-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href="mailto:richard@example.com" className="contact-link">
                richard@example.com
              </a>
            </div>
          </li>
          {/* 다른 연락처 아이템도 추가 */}
        </ul>
      </div>
    </aside>
  );
}