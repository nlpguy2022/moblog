import React from 'react';

const About = () => (
  <div className='container'>
    <h1>About Me</h1>
    <div className="about">
              <img src={`${process.env.PUBLIC_URL}/pic.png`}></img>
      <div className="about-content">
          <p>Senior Consultant @ EY's AI Innovation Labs, Kuala Lumpur.</p>
          <p>Been in industry for the past 3 years, starting off as a Data Analyst building PowerBI dashboards for clients, to building full-stack GenAI apps since 2023.</p>
          <p>I've worked on award winning projects in multinational clients in Malaysia, using AI to help bring value to their businesses.</p>
          <p>Check out my <a href="https://linked.in/hazimshahridan" target='blank'>LinkedIn</a> if you want to find out more.</p>
      </div>
    </div>
    </div>
  );

export default About;
