// 'use client'

// import React, { useState } from 'react';
// import TextField from '@mui/material/TextField';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import CircularProgress from '@mui/material/CircularProgress';
// import Backdrop from '@mui/material/Backdrop';
// import '@/style/index.css'


// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setErrorMessage(null);
//     setIsLoading(true);
//     try {
//       const res = await fetch(`/api/Login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       })
//       if (!res.ok) {
//         const data = await res.json()
//         setErrorMessage(`Lỗi: ${data.error}`);
//         setIsLoading(false);
//       }
//       else {
//         let d = await res.json()
//         console.log(d);

//         window.location.reload()
//         setIsLoading(false)
//       }
//     } catch (error) {
//       setErrorMessage(`Lỗi: ${error}`);
//       setIsLoading(false);
//     }
//   };
//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           padding: '32px',
//           boxShadow: `rgba(99, 99, 99, 0.2) 0px 2px 8px 0px`,
//           borderRadius: '8px',
//           background: 'white'
//         }}
//       >
//         <h1 className='Login_T'> ĐĂNG NHẬP </h1>
//         {errorMessage && (
//           <Typography color="error" sx={{ mt: 2 }}>
//             {errorMessage}
//           </Typography>
//         )}

//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             size='small'
//             id="email"
//             label="Tài khoản"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             size='small'
//             name="password"
//             label="Mật khẩu"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <div style={{ marginTop: '15px', width: '100%' }} onClick={handleSubmit}>
//             <p style={{
//               width: '100%', padding: '8px 0', background: 'var(--main)', borderRadius: '8px', textAlign: 'center',
//               cursor: 'pointer', fontWeight: '500', color: 'white'
//             }}>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</p>
//           </div>
//         </Box>
//       </Box>
//       {isLoading && (
//         <Backdrop sx={{ color: '#fff', zIndex: 999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }} open={isLoading}>
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       )}
//     </>
//   );
// }

