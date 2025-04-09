import Link from 'next/link';

const SideBar = () => {
  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h1 className="text-xl font-bold mb-6">FinDash</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">
          Dashboard
        </Link>
        <Link href="/reports" className="text-gray-700 hover:text-blue-500">
          Reports
        </Link>
        <Link href="/settings" className="text-gray-700 hover:text-blue-500">
          Settings
        </Link>
      </nav>
    </div>
  )
}

export default SideBar;
