'use client';
import { useState, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export function Logout() {
  return (
    <a
      className="border border-blue-500 bg-blue-400 bg-opacity-30 hover:bg-opacity-40 rounded p-2 ms-auto w-[80px] flex"
      href="/api/auth/logout"
    >
      <p className="mx-auto">Logout</p>
    </a>
  );
}

export function Login() {
  return (
    <a
      className="border border-blue-500 bg-blue-400 bg-opacity-30 hover:bg-opacity-40 rounded p-2 mx-auto w-[80px] flex"
      href="api/auth/login"
    >
      <p className="mx-auto">Login</p>
    </a>
  );
}

export default function Home() {
  const { user, error: userError, isLoading } = useUser();
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
      <div className="min-w-lg items-center p-24 space-y-10 min-h-screen">
        <div className="flex ">
          <h1 className="text-xl my-auto">AI Requirement Writer</h1>
          {user && <Logout />}
        </div>

        {!user ? (
          <div className="flex flex-col space-y-6">
            <h1 className="text-2xl mx-auto">Please Log in</h1>
            <Login />
          </div>
        ) : (
          <div className="">
            <div className="h-8 mb-2">
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
            <h1 className="my-8">Output:</h1>
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
        )}
      </div>
    </main>
  );
}
