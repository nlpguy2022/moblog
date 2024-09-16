import React from 'react';
import {Link} from 'react-router-dom';

const posts = [
    {id:0, title: 'Generative AI Basics', description: 'A basic introduction to Generative AI.'},
    {id:1, title: 'Prompt Engineering', description: 'First Step of \'Customizing\' LLMs'},
    {id:2, title: 'Retrieval Augmented Generation', description: 'Prompt Engineering on Proprietary Data'},
    {id:3, title: 'Sandbox is out!', description: 'You can actually play around with some of the concepts in my guide here :D'}
];

const PostList = () => (
    <div className='container'>
        <div className='post-list'> 
            <h2>Mo's Guide to GenAI</h2>
            <p>My personal guide to get you kickstarted on your GenAI journey as a beginner.</p>
            <br></br>
            <ul>
                {posts.map(post => (
                    <div key={post.id} className='post-card'>
                        <Link to={`/post/${post.id}`} state={{ title: post.title }} >{post.title}</Link>
                        <p>{post.description}</p>
                    </div>
                ))}
            </ul>
        </div>
    </div>
);

export default PostList;