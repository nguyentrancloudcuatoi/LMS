'use client'
import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Grid, TextField, Box
} from '@mui/material';
import { Visibility, Edit, Delete, Search } from '@mui/icons-material';


const UserTable = () => {
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        const fetchUsers = async () => {
            const token = '7c3afb790462432d924aef3f79a90b22';
            const wsFunction = 'core_user_get_users';
            const moodleWsRestFormat = 'json';
            const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=${wsFunction}&moodlewsrestformat=${moodleWsRestFormat}`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        criteria: [{ key: 'email', value: '%' }]
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <Box sx={{backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 2, mt: 4, minWidth: '90%', width: 'calc(100% - 70px)', minHeight: '100%', height: '800px', mx: 'auto', marginLeft: '20px'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                    <Box>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm"
                            size="small"
                            sx={{ flexGrow: 1, mr: 2, width: '250px' }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                    <Box>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }}>File mẫu</Button>
                        <Button variant="contained" color="secondary" sx={{ mr: 1 }}>Xuất file</Button>
                        <Button variant="contained" color="success">Tạo mới</Button>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Thông tin</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Liên hệ</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Giới tính</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Trạng thái</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Trạng thái học</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Chức năng</TableCell>
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.fullname}<br />{user.id}</TableCell>
                                    <TableCell>Điện thoại: {user.phone}<br />Email: {user.email}</TableCell>
                                    <TableCell>{user.gender}</TableCell>
                                    <TableCell>{user.status}</TableCell>
                                    <TableCell>{user.educationStatus}</TableCell>
                                    {/* <TableCell>
                                        <IconButton><Visibility /></IconButton>
                                        <IconButton><Edit /></IconButton>
                                        <IconButton><Delete /></IconButton>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default UserTable;
