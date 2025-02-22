import React, { useState } from 'react';
import axios from 'axios';
import { FaFileWord } from 'react-icons/fa6';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/convertfile', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedFile.name.replace(/\.[^/.]+$/, "")}.pdf`);

      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSelectedFile(null);
      setMessage("File Converted Successfully");
    } catch (error) {
      setMessage("Error during conversion. Please try again.");
      console.error("File conversion error:", error);
    }
  };

  return (
    <div className='max-w-screen-2xl mx-auto container px-4 sm:px-6 md:px-20 lg:px-40'>
      <div className='flex h-screen items-center justify-center'>
        <div className='border-2 border-dashed px-4 py-2 sm:px-6 sm:py-4 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-4'>Convert Word to PDF Online</h1>
          <p className='text-sm sm:text-base text-center mb-5'>Easily convert Word documents to PDF format online without installing any software.</p>

          <div className='flex flex-col items-center space-y-4'>
            <input
              type='file'
              accept='.doc,.docx'
              onChange={handleFileChange}
              className='hidden'
              id='fileInput'
            />

            <label
              htmlFor='fileInput'
              className='w-full flex items-center justify-center px-4 py-4 sm:py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white'
            >
              <FaFileWord className='text-2xl sm:text-3xl mr-2 sm:mr-3' />
              <span className='text-lg sm:text-2xl'>{selectedFile ? selectedFile.name : 'Choose File'}</span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className='text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none font-bold px-4 py-2 rounded-lg w-full sm:w-auto'
            >
              Convert File
            </button>

            {message && <p className='text-green-500 text-center text-sm mt-4'>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
