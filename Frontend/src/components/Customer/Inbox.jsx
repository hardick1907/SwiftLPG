import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useCustomerStore } from '../../Store/useCustomerStore.js';

export default function Inbox () {
  const { user, fetchNotices, notices, isLoading } = useCustomerStore();

  useEffect(() => {
    if (user) {
    fetchNotices();
    }
  }, [user, fetchNotices]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 px-4 sm:px-8 lg:px-16">
      {notices.length === 0 ? (
      <div className="flex justify-center items-center text-center">
        <p className="text-lg text-gray-500">No new notices</p>
      </div>
      ) : (
      <ul className="space-y-4 pt-4">
        {notices.map((notice) => (
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
  );
};