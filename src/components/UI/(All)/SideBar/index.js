"use client"

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Image from 'next/image';


export default function SideBar({ data }) {

  let path = {
    "/": "Trang chủ",
    "/uploadpages": "Quản lý lớp học",
    // "/user": "Quản lý học viên",
  }

  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  const logout = async () => {
    try {
      const response = await fetch('/api/Logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source: 0 }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: expanded ? '210px' : '74px',
      backgroundColor: '#0866ff',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      borderRight: 'thin solid rgba(113, 113, 113, 0.24)',
      zIndex: 10,
      boxShadow: expanded ? 'rgba(0, 0, 0, 0.24) 0px 3px 8px' : 'none',
    }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{
        transition: 'all .2s ease-out',
        width: expanded ? '202px' : '66px',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
      }}>
        <Image src='https://lh3.googleusercontent.com/d/1TPhL718l_ESFbe11-xVkFZLsKADv40UB'
          width={50} height={50}
          style={{ objectFit: 'cover', height: 'auto', width: 'auto' }} alt='logo' priority />
        {expanded && (
          <Box
            sx={{
              ml: '5px',
              textDecoration: 'none',
              transition: 'opacity 0.2s, transform 0.2s',
              opacity: 0,
              fontSize: 0,
              mr: expanded ? '16px' : 0,
              transform: 'translateX(-10px)',
              animation: 'fadeIn 0.2s ease-out 0.2s forwards',
              '@keyframes fadeIn': {
                to: {
                  fontSize: '16px',
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          ><p className='text_2' style={{ color: 'white' }}>eLearning</p></Box>
        )}
      </div>
      <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255)', margin: '0 0 8px 0' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '2px 0' }}>
        {Object.entries(path).map(([key, value]) => {
          return (
            <Link href={key} passHref key={key} >
              <Nav text={value} expanded={expanded} action={[pathname, key]} />
            </Link>)
        })}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255)', margin: '8px 0' }}></div>
        <ListItem
          sx={(theme) => ({
            width: expanded ? '202px' : '66px',
            margin: '4px',
            borderRadius: '5px',
            '&:hover': {
              backgroundColor: 'white',
              color: 'var(--main)'
            },
            backgroundColor: 'transparent',
            color: 'white',
            cursor: 'pointer'
          })}
          onClick={logout}
        >
          <ListItemIcon sx={{ width: '35px', minWidth: '35px', display: 'flex', justifyContent: 'center', color: 'inherit' }}>
            <ExitToAppRoundedIcon />
          </ListItemIcon>
          {expanded && (
            <Box
              sx={{
                ml: '5px',
                textDecoration: 'none',
                transition: 'opacity 0.2s, transform 0.2s',
                opacity: 0,
                fontSize: 0,
                transform: 'translateX(-10px)',
                animation: 'fadeIn 0.2s ease-out 0.2s forwards',
                '@keyframes fadeIn': {
                  to: {
                    fontSize: '16px',
                    opacity: 1,
                    transform: 'translateX(0)',
                  },
                },
              }}
            >Đăng xuất</Box>
          )}
        </ListItem>
      </div>
    </div >
  );
}