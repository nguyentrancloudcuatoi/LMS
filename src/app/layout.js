import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Login from '@/pages/Login';
import '@/style/index.css';
import { cookies } from 'next/headers';
import Header from '@/components/UI/(All)/header';
import SideBar from '@/components/UI/(All)/SideBar';
export const metadata = {
  title: 'Hệ thống chấm điểm tự động'
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, height: '100vh', background: 'var(--background)' }}>
        <AppRouterCacheProvider>
          <Header />
          <SideBar />
          <div style={{ marginLeft: '70px' }}>{children}</div>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
