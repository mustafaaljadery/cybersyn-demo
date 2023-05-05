import Image from 'next/image';
import { Inter } from 'next/font/google';
import axios from 'axios';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

async function getSearch(question: string) {
  try {
    const result = await axios.get(`http://127.0.0.1:5000/search`, {
      params: {
        q: question,
      },
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

export default function Home() {
  const [question, setQuestion] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any>(null);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <div className="flex flex-col justify-center items-center space-y-2">
        <h1 className="font-semibold text-3xl">
          Economy Data Atlas Dataset
        </h1>
        <p className="font-light text-sm">
          Found at the{' '}
          <a
            href="https://app.snowflake.com/marketplace/listing/GZSTZ491VXQ/knoema-economy-data-atlas"
            className="underline underline-offset-1 decoration-[#252440]"
          >
            Snowflake Marketplace
          </a>
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearching(true);
          getSearch(question).then((value) => {
            console.log(value);
            setResults(value);
            setSearching(false);
          });
        }}
        className="w-[500px] mt-10 bg-white p-2 flex flex-row space-x-2 justify-between items-between rounded-lg border border-[#252440]"
      >
        <input
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
          className="flex-1 text-sm ml-2 focus:ring-0 appearance-none outline-none focus:ring-offset-0 focus:border-0 decoration-0 w-full"
          placeholder="How can I help today?"
          type="text"
        />
        <button
          type="submit"
          className="p-2 hover:opacity-90 my-auto bg-[#252440] rounded-full"
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.22656 13.1719C8.42969 13.1719 9.55469 12.8281 10.5078 12.2344L13.7266 15.4531C13.9844 15.7109 14.3281 15.8359 14.6875 15.8359C15.4531 15.8359 16.0156 15.2422 16.0156 14.4922C16.0156 14.1406 15.8984 13.8047 15.6406 13.5391L12.4531 10.3438C13.1016 9.35938 13.4844 8.17969 13.4844 6.91406C13.4844 3.47656 10.6641 0.65625 7.22656 0.65625C3.78906 0.65625 0.976562 3.47656 0.976562 6.91406C0.976562 10.3516 3.78906 13.1719 7.22656 13.1719ZM7.22656 11.2656C4.83594 11.2656 2.875 9.30469 2.875 6.91406C2.875 4.52344 4.83594 2.5625 7.22656 2.5625C9.625 2.5625 11.5859 4.52344 11.5859 6.91406C11.5859 9.30469 9.625 11.2656 7.22656 11.2656Z"
              fill="white"
            />
          </svg>
        </button>
      </form>
      {searching ? (
        <div className="mt-6 flex flex-row space-x-3.5">
          <span className="relative animate-ping inline-flex rounded-full my-auto h-3 w-3 bg-[#252440]"></span>
          <p className="my-auto text-sm font-medium text-gray-800">
            Analyzing the dataset...
          </p>
        </div>
      ) : results ? (
        <div className="flex w-[500px] flex-col mt-6 p-3 space-y-3 bg-gray-100 border rounded-lg">
          <p className="font-medium text-gray-900 text-[10px]">
            Answer
          </p>
          <div className="flex flex-row space-x-3">
            <div className="w-[30px] rounded h-[30px] bg-[#262541] flex flex-col justify-center items-center">
              <img src="/value-2.png" className="w-[20px] h-[20px]" />
            </div>
            <p className="font-medium flex-1 text-sm text-gray-900">
              {results.answer}
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}
