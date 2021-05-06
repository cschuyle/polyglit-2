import React from 'react';
import ReactDOM from 'react-dom';

import './css/index.css';
import './css/style.css';
import './css/image-grid.css';
import './css/polyglit.css';
import './css/Showcase.css';

import Showcase from './Showcase';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
      <div id="header_wrap" className="outer">
          <header className="inner">
              <h1 id="project_title">polyglit</h1>
              <h2 id="project_tagline">A collection of literary works in Lots of Languages</h2>
          </header>
      </div>
      <div id="main_content_wrap" className="outer">
      <div id="main_content" className="inner">
          <h1>The Little Prince</h1>
          <p>My collection, painstakingly acquired over the years.</p>
          <Showcase />
      </div>
      </div>

      <div id="footer_wrap" className="outer">
          <footer className="inner">
              <p style={{textAlign: "center"}}>polyglit maintained by <a href="https://dragnon.com">Carlton Schuyler</a></p>
          </footer>
      </div>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
