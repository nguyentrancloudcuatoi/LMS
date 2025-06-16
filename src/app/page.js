"use client"

import { Grid, Card, CardContent, CardMedia, Tabs, Tab, Box, Typography, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState, useEffect, memo } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import LazyLoad from 'react-lazyload';
import CloseIcon from '@mui/icons-material/Close';
import CourseContent from '@/components/UI/(All)/courseContent';

const CourseDialog = ({ open, handleClose, course }) => (
    <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle>
            {course.displayname}
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                sx={{ position: 'absolute', right: 35, top: 8 }}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <CourseContent courseId={course.id} />
        </DialogContent>
    </Dialog>
);

const CourseCard = memo(({ course }) => {
    const [open, setOpen] = useState(false);
    const [randomStudents, setRandomStudents] = useState(() => Math.floor(Math.random() * (35 - 10 + 1)) + 10);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    <CourseContent courseId={course.id} />

    return (
        <>
            <Grid item xs={12} sm={6} md={3} sx={{ padding: 0 }} onClick={handleClickOpen}>
                <Card sx={{ maxWidth: 400, maxHeight: 400, position: 'relative', margin: 'auto', padding: 0 }}>
                    <LazyLoad height={180} offset={100}>
                        <CardMedia
                            component="img"
                            sx={{ height: 180 }}
                            image={course.overviewfiles?.[0]?.fileurl
                                ? course.overviewfiles[0].fileurl + '?token=7c3afb790462432d924aef3f79a90b22'
                                : 'https://img.freepik.com/free-vector/paper-style-white-monochrome-background_23-2149009213.jpg'}
                            alt="Lập trình thiết bị di động"
                        />
                    </LazyLoad>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '0 0 4px 0',
                        }}
                    >
                        Đang diễn ra
                    </Box>
                    <CardContent sx={{ minHeight: 100, overflow: 'auto' }}>
                        <Typography>{course.displayname}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {/* {new Date(course.startdate * 1000).toLocaleDateString()} - {new Date(course.enddate * 1000).toLocaleDateString()} */}
                        </Typography>
                        {/* <Typography variant="body2">
                            Đã học: 2 / 25 buổi
                        </Typography> */}
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <span role="img" aria-label="students">👥</span> {randomStudents}/ 40
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <CourseDialog open={open} handleClose={handleClose} course={course} />
        </>
    );
});

export default function CourseManager() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [value, setValue] = useState(0);
    const [courses, setCourses] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const tabStyle = {
        border: 1, borderColor: 'divider', borderRadius: 1, mr: 1.5, ml: 1.5, backgroundColor: 'lightgray', padding: '1px 8px', minWidth: 'auto', fontSize: '0.875rem', height: '10px',
        '&.Mui-selected': {
            color: 'white',
            backgroundColor: 'blue',
        },
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const token = '7c3afb790462432d924aef3f79a90b22';
            const wsFunction = 'core_course_get_courses_by_field';
            const moodleWsRestFormat = 'json';
            const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=${wsFunction}&moodlewsrestformat=${moodleWsRestFormat}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCourses(data.courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <>
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 2,
                    mt: 4,
                    minWidth: isSmallScreen ? '90%' : '10%',
                    width: isSmallScreen ? '100%' : 'calc(100% - 70px)',
                    minHeight: '800px',
                    height: "auto",
                    mx: 'auto',
                    marginLeft: '20px'
                }}
            >
                <div style={{ paddingLeft: isSmallScreen ? '8px' : '16px' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="course tabs"
                        sx={{ mb: 3, minHeight: '32px' }}
                    >
                        <Tab label={`Tất cả (${courses.length})`} sx={{ ...tabStyle, minHeight: '32px', height: '32px' }} />
                        <Tab label="Đang diễn ra (11)" sx={{ ...tabStyle, minHeight: '32px', height: '32px' }} />
                        <Tab label="Kết thúc (14)" sx={{ ...tabStyle, minHeight: '32px', height: '32px' }} />
                    </Tabs>
                </div>

                <Grid container spacing={3} justifyContent="center">
                    {courses.map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </Grid>
            </Box>
        </>
    );
}
