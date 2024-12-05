import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import TipTap from '../TipTap'
import { useAdminStore } from '../../Store/useAdminStore';

export default function Notices () {

  const { admin, fetchNoticesAdmin, noticesAdmin, isLoading } = useAdminStore();

  useEffect(() => {
    fetchNoticesAdmin();
  }, [ fetchNoticesAdmin]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className='pt-20 flex flex-col gap-2 justify-center items-center'>

      <div className='p-10 w-full'>
        <TipTap />
      </div>

      <div className=' flex flex-col justify-center items-center w-full border-4 border-gray-700'>
        <div>
          <h3 className='text-2xl font-bold '>Notices</h3>
        </div>

        <div className="pt-16 px-4 w-full sm:px-8 lg:px-16">
          {noticesAdmin.length === 0 ? (
          <div className="flex justify-center items-center text-center">
            <p className="text-lg text-gray-500">No new notices</p>
          </div>
          ) : (
          <ul className="space-y-4">
            {noticesAdmin.map((notice) => (
            <li key={notice.id || notice.title} className="bg-secondary shadow-lg p-6">
              <h4 className="text-3xl font-semibold text-gray-800">{notice.title}</h4>
              <p className="mt-2 text-lg text-white" dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(notice.content),
                        }} />
              <p className="mt-2 text-xs text-gray-300">
                <small>
                  {notice.createdAt
                  ? new Date(notice.createdAt).toLocaleString()
                  : 'No date available'}
                </small>
              </p>
            </li>
            ))}
          </ul>
          )}
        </div>
      </div>


    </div>
  );
};