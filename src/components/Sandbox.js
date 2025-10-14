import React, { useState, useEffect } from 'react';
import Groq from 'groq-sdk';
import { Link } from 'react-router-dom';

const Sandbox = () => {
  const [client, setClient] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [prompt, setPrompt] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  //RAG stuff
  const [file, setFile] = useState(null);
  const [knowledge, setKnowledge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then(setConfig)
      .catch((err) => console.error('Failed to load config:', err));
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!config) {
      setError("Configuration not loaded yet. Please wait.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${config.functionsApi}/extract`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Extraction failed");

      const data = await res.json();
      setKnowledge(data.text); //Response: {"text": "Lorem ipsum..."}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const keySubmit = (e) => {
    e.preventDefault();

    if (key.startsWith('gsk_')) {
      setMessage('Looks like a valid key was provided.');
      initGroqAPI(key);
    } else {
      setMessage('Invalid key provided!');
    }
  };

  const initGroqAPI = async (key) => {
    if (!key) {
      console.error('API Key missing');
      setMessage('API Key missing!');
      return;
    }
    try {
      const client = new Groq({
        apiKey: key, 
        dangerouslyAllowBrowser: true
      });
      setClient(client);
    } catch (error) {
      console.error('Error initializing Groq API: ', error);
      setMessage(`${error}`);
    }
  };

  const sendQuery = async (systemPrompt, prompt, query, knowledge) => {
    if (!client) {
      console.error('Groq client not initialized');
      setMessage('Please initialize the Groq API first');
      return;
    }
    try {
      // Inject knowledge into user content if available
      const userContent = knowledge 
        ? `Context: ${knowledge}\n\n${prompt} ${query}`
        : `${prompt} ${query}`;

      const params = {
        messages: [
          { role: 'system', content: `${systemPrompt}` },
          { role: 'user', content: userContent },
        ],
        model: 'llama3-8b-8192',
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
    sendQuery(systemPrompt, prompt, query, knowledge);
  };

  const transformResponse = (response) => {
    const llmResponse = response.choices[0].message.content;
    return { llmResponse };
  };

  if (!config) {
    return <div className="container"><p>Loading configuration...</p></div>;
  }

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
        <form onSubmit={handleExtract}>
          <label>
            (RAG) Upload File Here:
            <br />
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.docx"
            />
            <button
              type="submit"
              disabled={!file || loading}
              className="button-style"
              style={{marginLeft:'10px', marginTop:'10px'}}
            >
              {loading ? "Extracting..." : "Extract Text"}
            </button>
          </label>
          {error && <p style={{color: 'red', fontSize: '12px'}}>{error}</p>}
        </form>
        {knowledge && (
          <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px'}}>
            <p style={{fontSize: '12px', color: '#2e7d32', margin: 0}}>
              ✓ Knowledge base loaded ({knowledge.length} characters) - will be used in queries
            </p>
          </div>
        )}
      </div>
      
      <div className='container'>
        <form onSubmit={handleQuery}>
          <label>
            System Message:
            <br />
            <textarea 
              type='text'
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder='Insert your System message here'
              className='textarea-style'
            />
          </label>
          <br />
          <label>
            Prompt:
            <br />
            <textarea 
              type='text'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Insert your prompt here'
              className='textarea-style'
            />
          </label>
          <br />
          <label>
            Question:
            <br />
            <textarea 
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Insert your question here'
              className='textarea-style'
            />
          </label>
          <br />
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
