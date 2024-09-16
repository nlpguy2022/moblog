import React from 'react';

const About = () => (
  <div className='container'>
    <h1>About Me</h1>
    <div className="about">
              <img src={`${process.env.PUBLIC_URL}/pic.png`}></img>
      <div className="about-content">
          <p>I've been a consultant in the EY AI & Data team for the past two years.</p>
          <p>I started as a Data Analyst developing Power BI applications for clients, and have transitioned into the GenAI space since 2023.</p>
          <p>I am currently working on developing full stack GenAI apps for clients.</p>
          <p>For more details please check out my <a href="https://linked.in/hazimshahridan" target='blank'>LinkedIn</a></p>
      </div>
    </div>
    </div>
  );

export default About;