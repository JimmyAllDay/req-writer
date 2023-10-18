'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ requirementText: '' });

  const textToCopyRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      requirementText: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const text = e.target[0].value;

    const res = await fetch(`/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    });

    const jsonData = await res.json();

    if (!res.ok) {
      setError(true);
      setLoading(false);
      console.error(res.error);
      return;
    }
    setResult(jsonData.text);
    setLoading(false);
    setFormData({
      requirementText: '',
    });
  };

  const handleCopyClick = () => {
    const textToCopy = textToCopyRef.current.textContent;

    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

    document.body.removeChild(tempTextArea);
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="min-w-lg items-center p-24 space-y-10">
        <h1 className="text-xl">AI Requirement Writer</h1>
        <div className="h-2">
          {loading && <p className="text-green-500">{`Please wait...`}</p>}
          {error && (
            <p className="text-red-500">{`There's been an error. Please wait and try again.`}</p>
          )}
          {copied && (
            <p className="text-blue-500">{`Text copied to clipboard`}</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-10">
          <textarea
            rows="4"
            cols="7"
            placeholder="Enter requirement"
            className="bg-black border p-2"
            required
            value={formData.requirementText}
            onChange={handleChange}
          ></textarea>
          <button className="bg-blue-500 w-[200px] border-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </form>
        <h1>Output:</h1>
        {result !== '' && (
          <p
            className="text-white p-2 border-2 border-black rounded-lg hover:border-emerald-400 hover:cursor-pointer"
            ref={textToCopyRef}
            onClick={handleCopyClick}
          >
            {result}
          </p>
        )}
      </div>
    </main>
  );
}
