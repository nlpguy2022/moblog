import React, { useState } from 'react';
import Groq from 'groq-sdk';
import {Link} from 'react-router-dom';

const Sandbox = () => {
  const [client, setClient] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [prompt, setPrompt] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const keySubmit = (e) => {
    e.preventDefault()

    if (key.startsWith('gsk_')) {
      setMessage('Looks like a valid key was provided.');
      initGroqAPI(key);
    }
    else {
      setMessage('Invalid key provided!');
    }
  };

  const initGroqAPI = async (key) => {
    if (!key) {
      console.error('API Key missing')
      setMessage('API Key missing!')
    }
    try {
      const client = new Groq({
        apiKey : key, dangerouslyAllowBrowser: true
      });
      setClient(client);
    } catch (error) {
      console.error('Error initializing Groq API: ', error);
      setMessage(`${error}`);
    }
  };

  const sendQuery = async (systemPrompt, prompt, query) => {
    if (!client) {
      console.error('Groq client not initialized');
      setMessage('Please initialize the Groq API first');
      return;
    }
    try {
      const params = {
        messages : [
          {role: 'system', content: `${systemPrompt}`},
          {role: 'user' , content: `${prompt} ${query}`},
        ],
        model : 'llama3-8b-8192',
      };
      const chatCompletion = await client.chat.completions.create(params);
      console.log('Chat Completion Response:', chatCompletion);
      const extractedData = transformResponse(chatCompletion);
      setAnswer(extractedData.llmResponse);
    } catch (error) {
      console.error('Error sending query: ', error);
      setMessage(`Error sending query ${error}`);
    }
  };

  const handleQuery = (e) => {
    e.preventDefault();
    sendQuery(systemPrompt, prompt, query);
  };

  const transformResponse = (response) => {
    const llmResponse = response.choices[0].message.content;

    // const promptTokens = response.usage.prompt_tokens;
    // const completionTokens = response.usage.completion_tokens;
    // const totalTokens = response.usage.total_tokens;
    // const promptTime = response.usage.prompt_time;
    // const completionTime = response.usage.completion_time;
    // const totalTime = response.usage.total_time;

    return {
      llmResponse,
    };
  };

  return (
    <>
    <div className="container">
      <h2>To get started, enter your Groq API Key here.</h2>
      <p>Need some help? Refer to my post <b>'Sandbox is out!' <Link to={`/`}>here</Link></b>.</p>
      <p>This lets you get kickstarted playing around with LLMs! You can create one for free <a href="https://console.groq.com/login" target='_blank' rel='noreferrer'><b>here</b></a>.</p>
      <p style={{color:'#2980b9', fontSize:'10px'}}><b>Note: </b>For security reasons, I recommend you create a dummy Groq account for a test API key to work with.</p>
      <form onSubmit={keySubmit}>
        <label>
          API Key:
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your Groq API key"
          />
        </label>
        <button type="submit" className='button-style' style={{marginLeft:'10px'}}>Enter</button>
      </form>
      {message && <p style={{fontSize: '12px'}}>{message}</p>}
    </div>
    <div className='container'>
      <form onSubmit={handleQuery}>
        <label>
          System Message:
          <br>
          </br>
          <textarea type='text'
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder='Insert your System message here'
          className='textarea-style'/>
        </label>
        <br>
        </br>
        <label>
        Prompt:
        <br>
        </br>
        <textarea type='text'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Insert your prompt here'
        className='textarea-style'/>
        </label>
        <br>
        </br>
        <label>
          Question:
          <br>
          </br>
          <textarea type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Insert your question here'
          className='textarea-style'/>
        </label>
        <br>
        </br>
        <button type='submit' className='button-style' style={{marginTop: '10px'}}>Generate answer!</button>
      </form>
      {answer && (
        <div className='container'>
          <h3>LLM Response:</h3>
          <pre className='textwrap'>{answer}</pre>
          </div>
      )}
    </div>
    </>
  );
};

export default Sandbox;
