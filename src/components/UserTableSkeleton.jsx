const UserTableSkeleton = () => {
  const rows = Array.from({ length: 5 });

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900/40">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
              Avatar
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
              Name
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
              Email
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
              Role
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map((_, idx) => (
            <tr key={idx} className="animate-pulse">
              <td className="px-4 py-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              </td>
              <td className="px-4 py-3">
                <div className="mb-1 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-44 rounded bg-gray-200 dark:bg-gray-700" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="ml-auto flex w-24 justify-end gap-2">
                  <div className="h-7 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-7 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTableSkeleton;
