import SideBar from './SideBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}

export default Layout;
