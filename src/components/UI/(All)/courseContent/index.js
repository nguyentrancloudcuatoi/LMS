'use client'
import * as React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider, Grid, Collapse, Tabs, Tab, Card, CardContent, CardActions, Button, Chip, Paper, Stack } from '@mui/material';
import { ExpandMore, ExpandLess, Assignment as AssignmentIcon, AccessTime, CheckCircle, Warning, Upload, CloudUpload, SmartToy, Info } from '@mui/icons-material';
import { classList } from '@/app/data/classList';
import StarIcon from '@mui/icons-material/Star';

const CourseContent = React.memo(({ courseId }) => {
  const [courseData, setCourseData] = React.useState([]);
  const [selectedContent, setSelectedContent] = React.useState(null);
  const [pagesData, setPagesData] = React.useState([]);
  const [selectedPageContent, setSelectedPageContent] = React.useState(null);
  const [selectedPageName, setSelectedPageName] = React.useState('');
  const [selectedContentName, setSelectedContentName] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState({});
  const [tabValue, setTabValue] = React.useState(0);
  const [assignments, setAssignments] = React.useState([]);
  const [myAssignments, setMyAssignments] = React.useState([
    {
      id: 1,
      name: "Assignment - OOP 3.2 - Thực thi đa hình trong hướng đối tượng",
      duedate: 1711641060, // 31 March 2024, 11:37 PM
      intro: "Sinh viên làm bài tập trong file và nộp bài theo quy trình lên trang learn.s4h.edu.vn",
      status: "Chưa nộp"
    }
  ]);
  const [selectedAssignmentSectionId, setSelectedAssignmentSectionId] = React.useState(null);
  // State tổng cho nộp bài và AI feedback
  const [submissionState, setSubmissionState] = React.useState({}); // { [assignmentId]: { fileName, submitted } }
  const [aiState, setAiState] = React.useState({}); // { [assignmentId]: { showAI, aiResult } }
  const [editModeState, setEditModeState] = React.useState({}); // { [assignmentId]: true/false }

  React.useEffect(() => {
    const fetchAssignments = async () => {
      const token = '7c3afb790462432d924aef3f79a90b22';
      const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=mod_assign_get_assignments&courseids[0]=${courseId}&moodlewsrestformat=json`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.courses && data.courses[0]) {
          setAssignments(data.courses[0].assignments);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [courseId]);

  React.useEffect(() => {
    const fetchCourseContents = async () => {
      const token = '7c3afb790462432d924aef3f79a90b22';
      const wsFunction = 'core_course_get_contents';
      const moodleWsRestFormat = 'json';
      const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=${wsFunction}&courseid=${courseId}&moodlewsrestformat=${moodleWsRestFormat}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setCourseData(data);
          localStorage.setItem('courseData', JSON.stringify(data));  //Tối ưu google cache
        } else {
          console.error('Fetched course data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching course contents:', error);
      }
    };

    const fetchPagesByCourses = async () => {
      const token = '7c3afb790462432d924aef3f79a90b22';
      const wsFunction = 'mod_page_get_pages_by_courses';
      const moodleWsRestFormat = 'json';
      const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=${wsFunction}&courseids[0]=${courseId}&moodlewsrestformat=${moodleWsRestFormat}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setPagesData(data.pages);
        localStorage.setItem('pagesData', JSON.stringify(data.pages)); //Tối ưu google cache

        if (data.pages && data.pages.length > 0) {
          setSelectedPageContent(data.pages[0].content);
          setSelectedPageName(data.pages[0].name);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchCourseContents();
    fetchPagesByCourses();
  }, [courseId]);

  const handleModuleClick = async (module) => {
    const pageId = module.instance;
    const page = pagesData.find(p => p.id === pageId);

    if (page) {
      setSelectedPageContent(page.content);
      setSelectedPageName(page.name);
      localStorage.setItem('selectedPageContent', page.content);//Tối ưu google cache
      localStorage.setItem('selectedPageName', page.name);//Tối ưu google cache
    } else {
      console.error('Page not found for module instance:', pageId);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Helper: Danh sách section có bài tập
  const sectionsWithAssignments = React.useMemo(() => {
    return courseData.filter(section =>
      Array.isArray(section.modules) && section.modules.some(m => m.modname === 'assign')
    );
  }, [courseData]);

  // Section đang chọn
  const selectedAssignmentSection = React.useMemo(() => {
    if (!sectionsWithAssignments.length) return null;
    return sectionsWithAssignments.find(s => s.id === selectedAssignmentSectionId) || sectionsWithAssignments[0];
  }, [sectionsWithAssignments, selectedAssignmentSectionId]);

  // Danh sách bài tập của section đang chọn
  const assignmentsInSection = React.useMemo(() => {
    if (!selectedAssignmentSection) return [];
    return selectedAssignmentSection.modules.filter(m => m.modname === 'assign');
  }, [selectedAssignmentSection]);

  // Helper: Format ngày giờ
  const formatDueDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper: Tính thời gian còn lại/quá hạn
  const getTimeRemaining = (duedate) => {
    if (!duedate) return '-';
    const now = new Date();
    const due = new Date(duedate * 1000);
    const diff = due - now;
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      return `Còn lại: ${days} ngày ${hours} giờ`;
    } else {
      const overdue = Math.abs(diff);
      const days = Math.floor(overdue / (1000 * 60 * 60 * 24));
      const hours = Math.floor((overdue / (1000 * 60 * 60)) % 24);
      return `Đã quá hạn: ${days} ngày ${hours} giờ`;
    }
  };

  // Helper: Lấy trạng thái nộp bài từ localStorage (chỉ khi khởi tạo)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem('assignment_submissions');
    if (data) {
      const obj = JSON.parse(data);
      const newState = {};
      Object.keys(obj).forEach(id => {
        newState[id] = { fileName: obj[id].fileName, submitted: true };
      });
      setSubmissionState(newState);
    }
  }, [assignmentsInSection]);

  // Helper: Lưu trạng thái nộp bài vào localStorage
  function saveSubmission(assignmentId, submission) {
    const data = localStorage.getItem('assignment_submissions');
    const obj = data ? JSON.parse(data) : {};
    obj[assignmentId] = submission;
    localStorage.setItem('assignment_submissions', JSON.stringify(obj));
  }

  const aiFeedback = {
    rating: [
      `Bài làm xuất sắc: Bạn đã trình bày đầy đủ, logic, có ví dụ thực tế và sáng tạo vượt mong đợi. Các luận điểm được phát triển mạch lạc, dẫn chứng phong phú, thể hiện sự đầu tư nghiêm túc và hiểu sâu về chủ đề. Đặc biệt, bạn đã biết liên hệ thực tiễn và mở rộng vấn đề, tạo nên một bài viết có chiều sâu và sức thuyết phục cao. Để nâng cao hơn nữa, bạn có thể tham khảo thêm các bài viết chuyên sâu tại <a href='https://vietjack.com' target='_blank'>VietJack</a> hoặc xem video hướng dẫn tại <a href='https://www.youtube.com/watch?v=8lXdyD2Yzls' target='_blank'>YouTube</a>. Ngoài ra, bạn đã sử dụng ngôn ngữ linh hoạt, trình bày mạch lạc, không mắc lỗi chính tả, ngữ pháp. Việc kết hợp giữa lý thuyết và thực tiễn giúp bài làm trở nên sinh động, hấp dẫn và dễ tiếp cận với người đọc. Nếu tiếp tục phát huy phong cách này, bạn sẽ đạt được thành tích cao trong các bài tập tiếp theo. Để phát triển hơn nữa, hãy thử tham gia các diễn đàn học thuật như <a href='https://www.researchgate.net/' target='_blank'>ResearchGate</a> để trao đổi và học hỏi thêm kinh nghiệm từ các chuyên gia trong lĩnh vực của mình.`,
      `Bài làm tốt: Nội dung rõ ràng, có dẫn chứng, đáp ứng đúng yêu cầu đề bài. Bạn đã biết phân tích vấn đề ở nhiều khía cạnh, tuy nhiên nếu bổ sung thêm các ví dụ thực tế hoặc số liệu thống kê thì bài làm sẽ thuyết phục hơn. Cấu trúc bài viết hợp lý, trình bày sạch đẹp. Để hoàn thiện hơn, hãy đọc thêm tài liệu tại <a href='https://www.studocu.com/vn' target='_blank'>StuDocu</a> hoặc tham khảo các bài mẫu trên <a href='https://www.tailieu.vn' target='_blank'>Tài liệu.vn</a>. Ngoài ra, bạn có thể tham khảo thêm các bài giảng trực tuyến để mở rộng kiến thức và nâng cao kỹ năng trình bày. Việc luyện tập viết thường xuyên sẽ giúp bạn cải thiện khả năng diễn đạt và phát triển ý tưởng một cách logic, mạch lạc hơn. Đừng quên kiểm tra lại bài làm trước khi nộp để đảm bảo không còn lỗi nhỏ nào.`,
      `Bài làm đạt yêu cầu: Đã hoàn thành các phần chính, tuy nhiên cần bổ sung thêm ví dụ hoặc phân tích sâu hơn. Một số ý còn sơ lược, chưa thực sự nổi bật. Nếu bạn chú ý hơn đến việc liên hệ thực tiễn và mở rộng các luận điểm, bài làm sẽ hoàn thiện hơn. Bạn có thể xem thêm các ví dụ thực tế tại <a href='https://www.khanacademy.org/' target='_blank'>Khan Academy</a>. Ngoài ra, hãy thử đặt ra các câu hỏi phản biện hoặc mở rộng vấn đề để bài viết trở nên sâu sắc và đa chiều hơn. Việc tham khảo các nguồn tài liệu nước ngoài cũng sẽ giúp bạn có thêm góc nhìn mới và làm giàu nội dung bài viết của mình.`,
      `Bài làm còn thiếu sót: Một số ý chưa rõ ràng, cần bổ sung và trình bày lại cho mạch lạc. Bạn nên chú ý hơn đến việc sắp xếp các luận điểm theo trình tự logic, tránh lặp lại ý và nên kiểm tra lại lỗi chính tả, ngữ pháp. Để cải thiện kỹ năng trình bày, hãy tham khảo khóa học miễn phí tại <a href='https://www.coursera.org/learn/academic-writing' target='_blank'>Coursera</a>. Ngoài ra, bạn nên luyện tập viết dàn ý trước khi bắt đầu để đảm bảo không bỏ sót ý quan trọng. Việc tham khảo ý kiến của bạn bè hoặc thầy cô cũng sẽ giúp bạn nhận được những góp ý hữu ích để hoàn thiện bài làm.`,
      `Bài làm chưa đạt: Thiếu nhiều ý quan trọng, cần xem lại cấu trúc và nội dung. Bạn nên đọc kỹ lại đề bài, xác định rõ các yêu cầu và lập dàn ý trước khi viết để tránh bỏ sót các phần quan trọng. Xem hướng dẫn lập dàn ý tại <a href='https://www.wikihow.com/Outline-an-Essay' target='_blank'>WikiHow</a>. Ngoài ra, hãy chú ý đến việc sử dụng ngôn từ chính xác, tránh lặp lại ý và đảm bảo các luận điểm được phát triển đầy đủ. Nếu gặp khó khăn, bạn có thể tham khảo các bài mẫu hoặc nhờ sự hỗ trợ từ giáo viên để cải thiện kỹ năng viết của mình.`,
      `Bài làm chưa có sự sáng tạo, cần chủ động tìm hiểu thêm tài liệu tham khảo. Việc bổ sung các ví dụ thực tế, số liệu hoặc hình ảnh minh họa sẽ giúp bài làm sinh động và thuyết phục hơn. Tham khảo thêm các nguồn sáng tạo tại <a href='https://www.ted.com/topics/creativity' target='_blank'>TED Talks</a>. Ngoài ra, bạn nên thử áp dụng các phương pháp tư duy sáng tạo như sơ đồ tư duy hoặc brainstorming để phát triển ý tưởng mới và làm cho bài viết trở nên độc đáo hơn. Đừng ngại thử nghiệm các cách tiếp cận khác nhau để tìm ra phong cách phù hợp nhất với bản thân.`,
      `Bài làm có sự nhầm lẫn về khái niệm, cần ôn tập lại lý thuyết. Bạn nên tham khảo thêm sách giáo khoa hoặc tài liệu chuyên ngành để củng cố kiến thức nền tảng. Xem thêm bài giảng tại <a href='https://mooc.org/' target='_blank'>MOOC.org</a>. Ngoài ra, hãy thử làm các bài tập trắc nghiệm hoặc tham gia các nhóm học tập để trao đổi và giải đáp thắc mắc cùng bạn bè. Việc học nhóm sẽ giúp bạn tiếp cận kiến thức một cách đa chiều và hiệu quả hơn.`,
      `Bài làm trình bày đẹp, rõ ràng nhưng còn thiếu chiều sâu phân tích. Bạn nên bổ sung thêm các luận điểm phụ và dẫn chứng thực tế để tăng tính thuyết phục. Có thể tham khảo thêm các bài luận mẫu tại <a href='https://www.collegeessayguy.com/' target='_blank'>College Essay Guy</a>. Ngoài ra, hãy thử liên hệ kiến thức với các vấn đề thực tiễn hoặc các môn học khác để bài viết có chiều sâu và thể hiện tư duy tổng hợp. Việc sử dụng các ví dụ thực tế sẽ giúp người đọc dễ hiểu và ghi nhớ nội dung hơn.`,
      `Bài làm có ý tưởng sáng tạo nhưng cách trình bày còn rối, cần sắp xếp lại bố cục cho hợp lý. Để cải thiện, bạn nên lập dàn ý trước khi viết và tham khảo các bài mẫu tại <a href='https://owl.purdue.edu/owl/general_writing/academic_writing/index.html' target='_blank'>Purdue OWL</a>. Ngoài ra, hãy chú ý đến việc sử dụng các câu chuyển tiếp giữa các đoạn để bài viết liền mạch và dễ theo dõi hơn. Việc luyện tập viết thường xuyên sẽ giúp bạn cải thiện kỹ năng trình bày và phát triển ý tưởng một cách logic hơn.`,
      `Bài làm còn sơ sài, thiếu dẫn chứng và ví dụ minh họa. Bạn nên bổ sung thêm các số liệu, hình ảnh hoặc trích dẫn để bài viết sinh động hơn. Tham khảo cách sử dụng dẫn chứng tại <a href='https://writingcenter.unc.edu/tips-and-tools/evidence/' target='_blank'>UNC Writing Center</a>. Ngoài ra, hãy thử đọc thêm các bài báo khoa học hoặc tài liệu chuyên ngành để làm giàu nội dung và tăng tính thuyết phục cho bài viết của mình.`,
      `Bài làm có sự đầu tư nhưng còn mắc lỗi chính tả, ngữ pháp. Bạn nên kiểm tra lại bài làm trước khi nộp để tránh những lỗi nhỏ không đáng có. Sử dụng công cụ như <a href='https://www.grammarly.com/' target='_blank'>Grammarly</a> để hỗ trợ. Ngoài ra, hãy nhờ bạn bè hoặc thầy cô đọc lại bài làm để phát hiện và sửa các lỗi mà bạn có thể đã bỏ sót. Việc luyện tập viết thường xuyên sẽ giúp bạn nâng cao kỹ năng và tự tin hơn khi làm bài.`,
    ],
    comment: [
      `Bạn đã sử dụng ví dụ minh họa rất tốt, giúp người đọc dễ hiểu hơn. Tuy nhiên, phần phân tích còn có thể mở rộng thêm bằng cách liên hệ với các tình huống thực tế hoặc các vấn đề xã hội liên quan. Nếu bạn bổ sung thêm nhận định cá nhân ở phần kết luận, bài làm sẽ có chiều sâu hơn. Đọc thêm về kỹ năng phân tích tại <a href='https://www.skillsyouneed.com/ips/analytical-skills.html' target='_blank'>SkillsYouNeed</a>. Ngoài ra, bạn có thể thử áp dụng các phương pháp phân tích khác nhau như SWOT, phân tích nguyên nhân - kết quả để làm rõ vấn đề hơn. Việc sử dụng các ví dụ thực tế sẽ giúp bài viết trở nên sinh động và dễ hiểu hơn cho người đọc. Đừng quên kiểm tra lại các luận điểm để đảm bảo tính logic và mạch lạc cho toàn bộ bài làm.`,
      `Phần kết luận của bạn khá ấn tượng, tuy nhiên nên bổ sung thêm nhận định cá nhân hoặc đề xuất hướng giải quyết cho vấn đề. Ngoài ra, bạn có thể đặt ra một số câu hỏi mở để khuyến khích người đọc suy nghĩ thêm. Tham khảo thêm về kỹ năng kết luận tại <a href='https://writingcenter.unc.edu/tips-and-tools/conclusions/' target='_blank'>UNC Writing Center</a>. Bên cạnh đó, hãy thử liên hệ kết luận với các vấn đề thực tiễn hoặc các chủ đề liên quan để tăng tính ứng dụng và chiều sâu cho bài viết. Việc sử dụng các câu kết luận mạnh mẽ sẽ giúp bài làm của bạn để lại ấn tượng tốt với người đọc và người chấm.`,
      `Một số luận điểm còn chung chung, nên phân tích sâu hơn để tăng tính thuyết phục. Bạn có thể sử dụng thêm số liệu, dẫn chứng thực tế hoặc trích dẫn ý kiến chuyên gia để làm rõ quan điểm của mình. Xem ví dụ về phân tích số liệu tại <a href='https://www.statisticshowto.com/' target='_blank'>Statistics How To</a>. Ngoài ra, hãy thử so sánh các quan điểm khác nhau hoặc phân tích ưu nhược điểm của từng giải pháp để bài viết trở nên đa chiều và sâu sắc hơn. Việc tham khảo các nguồn tài liệu uy tín sẽ giúp bạn củng cố lập luận và tăng tính thuyết phục cho bài làm.`,
      `Bạn trình bày rõ ràng, mạch lạc, nhưng cần chú ý hơn về chính tả và ngữ pháp. Việc kiểm tra lại bài làm trước khi nộp sẽ giúp bạn tránh được những lỗi nhỏ không đáng có và tạo ấn tượng tốt với người chấm. Sử dụng công cụ kiểm tra ngữ pháp như <a href='https://www.grammarly.com/' target='_blank'>Grammarly</a>. Ngoài ra, hãy luyện tập viết lại các đoạn văn để rèn kỹ năng diễn đạt và phát triển ý tưởng. Việc đọc thêm các bài mẫu cũng sẽ giúp bạn học hỏi được cách trình bày và sử dụng ngôn từ hiệu quả hơn.`,
      `Nên bổ sung thêm số liệu hoặc hình ảnh minh họa để bài làm sinh động hơn. Việc sử dụng các bảng biểu, sơ đồ hoặc hình ảnh sẽ giúp người đọc dễ hình dung và ghi nhớ nội dung hơn. Tham khảo cách trình bày hình ảnh tại <a href='https://www.canva.com/learn/infographic-design/' target='_blank'>Canva</a>. Ngoài ra, bạn có thể thử sử dụng các phần mềm thiết kế để tạo ra các biểu đồ, sơ đồ tư duy minh họa cho bài viết. Việc kết hợp giữa chữ và hình ảnh sẽ giúp bài làm trở nên hấp dẫn và dễ tiếp cận hơn với người đọc.`,
      `Bạn đã biết liên hệ thực tế, hãy phát huy điểm mạnh này ở các bài tiếp theo. Nếu có thể, hãy chia sẻ thêm trải nghiệm cá nhân hoặc quan sát thực tế để tăng tính thuyết phục cho bài làm. Xem ví dụ về liên hệ thực tế tại <a href='https://www.edutopia.org/' target='_blank'>Edutopia</a>. Ngoài ra, hãy thử liên hệ kiến thức với các môn học khác hoặc các vấn đề xã hội để bài viết có chiều sâu và đa dạng hơn. Việc sử dụng các ví dụ thực tế sẽ giúp người đọc dễ hiểu và ghi nhớ nội dung hơn.`,
      `Cần chú ý hơn về cách sắp xếp ý, tránh lặp lại nội dung. Bạn nên lập dàn ý trước khi viết để đảm bảo các luận điểm được trình bày logic, mạch lạc và không bị trùng lặp. Học cách lập dàn ý tại <a href='https://owl.purdue.edu/owl/general_writing/the_writing_process/developing_an_outline/index.html' target='_blank'>Purdue OWL</a>. Ngoài ra, hãy thử sử dụng các công cụ lập dàn ý trực tuyến để hệ thống hóa ý tưởng trước khi viết. Việc luyện tập viết dàn ý sẽ giúp bạn phát triển ý tưởng một cách logic và mạch lạc hơn.`,
      `Một số phần trình bày còn sơ sài, nên mở rộng thêm các ý phụ. Bạn có thể đặt ra các câu hỏi phụ hoặc mở rộng vấn đề sang các lĩnh vực liên quan để bài làm phong phú hơn. Xem thêm ví dụ mở rộng vấn đề tại <a href='https://www.thoughtco.com/develop-and-organize-a-classification-essay-1690537' target='_blank'>ThoughtCo</a>. Ngoài ra, hãy thử liên hệ các ý phụ với các ví dụ thực tế hoặc các chủ đề liên quan để bài viết trở nên đa dạng và sâu sắc hơn. Việc tham khảo các nguồn tài liệu khác nhau sẽ giúp bạn có thêm ý tưởng để phát triển bài làm.`,
      `Bố cục bài làm hợp lý nhưng phần chuyển ý giữa các đoạn còn gượng ép. Bạn nên sử dụng các câu chuyển tiếp mềm mại hơn để bài viết liền mạch. Tham khảo kỹ năng chuyển đoạn tại <a href='https://writingcenter.fas.harvard.edu/pages/transitions' target='_blank'>Harvard Writing Center</a>. Ngoài ra, hãy luyện tập viết các đoạn chuyển tiếp để bài làm trở nên mượt mà và dễ theo dõi hơn. Việc sử dụng các từ nối hợp lý sẽ giúp bài viết của bạn liền mạch và logic hơn.`,
      `Bạn có ý tưởng sáng tạo nhưng cần phát triển thêm các luận điểm phụ để làm rõ quan điểm. Đọc thêm về phát triển ý tại <a href='https://writingcenter.unc.edu/tips-and-tools/developing-your-thesis/' target='_blank'>UNC Writing Center</a>. Ngoài ra, hãy thử tham khảo ý kiến của bạn bè hoặc thầy cô để nhận được góp ý và hoàn thiện bài làm. Việc trao đổi sẽ giúp bạn có thêm góc nhìn mới và phát triển ý tưởng một cách đa dạng hơn.`,
      `Nên kiểm tra lại các trích dẫn, nguồn tham khảo để đảm bảo tính chính xác và tránh đạo văn. Tham khảo hướng dẫn trích dẫn tại <a href='https://www.citethisforme.com/' target='_blank'>Cite This For Me</a>. Ngoài ra, hãy thử sử dụng các phần mềm quản lý tài liệu tham khảo để hệ thống hóa nguồn tài liệu và tránh nhầm lẫn khi trích dẫn. Việc trích dẫn đúng quy chuẩn sẽ giúp bài làm của bạn chuyên nghiệp và đáng tin cậy hơn.`,
    ],
    suggestion: [
      `Hãy bổ sung ví dụ thực tế hoặc số liệu thống kê để tăng tính thuyết phục cho bài làm. Ngoài ra, bạn nên tham khảo thêm các tài liệu chuyên ngành, bài báo khoa học hoặc các nguồn tin cậy để mở rộng kiến thức và làm giàu nội dung bài viết. Một số nguồn tham khảo: <a href='https://www.sciencedirect.com/' target='_blank'>ScienceDirect</a>, <a href='https://www.researchgate.net/' target='_blank'>ResearchGate</a>. Ngoài ra, hãy thử luyện tập viết lại bài làm nhiều lần để rèn kỹ năng trình bày và phát triển ý. Việc tham khảo ý kiến của bạn bè hoặc thầy cô cũng sẽ giúp bạn hoàn thiện bài làm và có thêm góc nhìn mới. Đừng ngại thử nghiệm các cách tiếp cận khác nhau để tìm ra phong cách phù hợp nhất với bản thân.`,
      `Nên tham khảo thêm các tài liệu chuyên ngành để mở rộng kiến thức. Việc đọc thêm sách, báo, tài liệu nước ngoài sẽ giúp bạn có cái nhìn đa chiều và sâu sắc hơn về vấn đề. Tham khảo thư viện tài liệu tại <a href='https://www.jstor.org/' target='_blank'>JSTOR</a>. Ngoài ra, hãy thử tham gia các khóa học trực tuyến hoặc các diễn đàn học thuật để trao đổi và học hỏi thêm kinh nghiệm từ các chuyên gia trong lĩnh vực của mình. Việc học hỏi từ nhiều nguồn sẽ giúp bạn phát triển tư duy phản biện và nâng cao kỹ năng viết bài.`,
      `Cố gắng trình bày các ý theo trình tự logic, có mở bài, thân bài, kết luận rõ ràng. Bạn nên lập dàn ý chi tiết trước khi viết để đảm bảo không bỏ sót ý và các luận điểm được phát triển đầy đủ. Xem hướng dẫn trình bày tại <a href='https://writingcenter.fas.harvard.edu/pages/essay-structure' target='_blank'>Harvard Writing Center</a>. Ngoài ra, hãy luyện tập viết các đoạn văn ngắn để rèn kỹ năng diễn đạt và phát triển ý tưởng. Việc đọc thêm các bài mẫu cũng sẽ giúp bạn học hỏi được cách trình bày và sử dụng ngôn từ hiệu quả hơn.`,
      `Tăng cường sử dụng hình ảnh, sơ đồ hoặc bảng biểu để minh họa cho nội dung. Việc này không chỉ giúp bài làm sinh động mà còn thể hiện khả năng tổng hợp và trình bày thông tin của bạn. Học cách thiết kế infographic tại <a href='https://piktochart.com/blog/create-infographic/' target='_blank'>Piktochart</a>. Ngoài ra, hãy thử sử dụng các phần mềm thiết kế để tạo ra các biểu đồ, sơ đồ tư duy minh họa cho bài viết. Việc kết hợp giữa chữ và hình ảnh sẽ giúp bài làm trở nên hấp dẫn và dễ tiếp cận hơn với người đọc.`,
      `Chú ý kiểm tra lại lỗi chính tả, ngữ pháp trước khi nộp bài. Bạn có thể nhờ bạn bè đọc lại hoặc sử dụng các công cụ kiểm tra chính tả để đảm bảo bài làm hoàn chỉnh. Tham khảo <a href='https://www.languagetool.org/' target='_blank'>LanguageTool</a>. Ngoài ra, hãy luyện tập viết lại các đoạn văn để rèn kỹ năng diễn đạt và phát triển ý tưởng. Việc đọc thêm các bài mẫu cũng sẽ giúp bạn học hỏi được cách trình bày và sử dụng ngôn từ hiệu quả hơn.`,
      `Hãy thử liên hệ kiến thức với các vấn đề thực tiễn hoặc các môn học khác. Việc liên hệ liên ngành sẽ giúp bài làm của bạn có chiều sâu và thể hiện tư duy tổng hợp. Xem ví dụ liên ngành tại <a href='https://www.interdisciplinary.ox.ac.uk/' target='_blank'>Oxford Interdisciplinary</a>. Ngoài ra, hãy thử liên hệ kiến thức với các chủ đề xã hội hoặc các vấn đề thời sự để bài viết trở nên đa dạng và sâu sắc hơn. Việc sử dụng các ví dụ thực tế sẽ giúp người đọc dễ hiểu và ghi nhớ nội dung hơn.`,
      `Nên đặt ra câu hỏi phản biện hoặc mở rộng vấn đề ở cuối bài để tăng chiều sâu. Việc này sẽ giúp người đọc suy nghĩ thêm và tạo ấn tượng mạnh với người chấm. Tham khảo kỹ năng phản biện tại <a href='https://www.criticalthinking.org/' target='_blank'>Critical Thinking</a>. Ngoài ra, hãy thử đặt ra các câu hỏi mở hoặc các vấn đề liên quan để khuyến khích người đọc suy nghĩ và thảo luận thêm về chủ đề của bài viết.`,
      `Bổ sung thêm nhận xét cá nhân hoặc trải nghiệm thực tế nếu có. Những trải nghiệm cá nhân sẽ làm bài viết của bạn trở nên độc đáo và gần gũi hơn với người đọc. Xem ví dụ tại <a href='https://www.lifehack.org/' target='_blank'>Lifehack</a>. Ngoài ra, hãy thử chia sẻ các câu chuyện thực tế hoặc các trải nghiệm cá nhân liên quan đến chủ đề để bài viết trở nên sinh động và hấp dẫn hơn. Việc sử dụng các ví dụ thực tế sẽ giúp người đọc dễ hiểu và ghi nhớ nội dung hơn.`,
      `Nên luyện tập viết lại bài làm nhiều lần để rèn kỹ năng trình bày và phát triển ý. Tham khảo các bài tập viết tại <a href='https://www.dailywritingtips.com/' target='_blank'>Daily Writing Tips</a>. Ngoài ra, hãy thử tham gia các nhóm học tập hoặc các diễn đàn trực tuyến để trao đổi và học hỏi thêm kinh nghiệm từ các bạn cùng lớp. Việc luyện tập thường xuyên sẽ giúp bạn nâng cao kỹ năng và tự tin hơn khi làm bài.`,
      `Hãy tham khảo ý kiến của bạn bè hoặc thầy cô để nhận được góp ý và hoàn thiện bài làm. Việc trao đổi sẽ giúp bạn có thêm góc nhìn mới. Ngoài ra, hãy thử tham gia các buổi thảo luận nhóm hoặc các hoạt động ngoại khóa để phát triển kỹ năng giao tiếp và làm việc nhóm. Việc học hỏi từ nhiều nguồn sẽ giúp bạn phát triển tư duy phản biện và nâng cao kỹ năng viết bài.`,
      `Nếu có thể, hãy trình bày bài làm bằng sơ đồ tư duy để hệ thống hóa ý tưởng trước khi viết. Tham khảo cách vẽ sơ đồ tại <a href='https://www.mindmeister.com/' target='_blank'>MindMeister</a>. Ngoài ra, hãy thử sử dụng các phần mềm thiết kế để tạo ra các sơ đồ, biểu đồ minh họa cho bài viết. Việc kết hợp giữa chữ và hình ảnh sẽ giúp bài làm trở nên hấp dẫn và dễ tiếp cận hơn với người đọc.`,
    ],
  };

  const handleAI = () => {
    const result = {
      rating: aiFeedback.rating[Math.floor(Math.random() * aiFeedback.rating.length)],
      comment: aiFeedback.comment[Math.floor(Math.random() * aiFeedback.comment.length)],
      suggestion: aiFeedback.suggestion[Math.floor(Math.random() * aiFeedback.suggestion.length)]
    };
    setAiState(prev => ({
      ...prev,
      [assignment.id]: {
        showAI: true,
        aiResult: result
      }
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header vừa phải */}
      <Box sx={{
        width: '100%',
        bgcolor: '#f5f7fa',
        borderBottom: '1.5px solid #e3e8ee',
        px: { xs: 3, md: 6 },
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1,
      }}>
      </Box>
      {/* Tab switcher vừa phải */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', bgcolor: '#fff', borderBottom: '1.5px solid #e3e8ee', mb: 2, px: { xs: 1, md: 5 } }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { height: 3, background: '#1976d2', borderRadius: 2 } }}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: 17,
              px: 3,
              py: 1.2,
              color: '#1976d2',
              borderRadius: 2,
              mx: 0.5,
              transition: 'all 0.15s',
              minHeight: 44,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#ffff',
                color: '#1565c0',
              },
            },
            '& .Mui-selected': {
              color: '#1565c0',
              bgcolor: '#fffff',
              boxShadow: 1,
            },
          }}
        >
          <Tab label="BÀI HỌC" />
          <Tab label="BÀI TẬP" />
        </Tabs>
      </Box>
      {/* PHẦN CÒN LẠI */}
      {tabValue === 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <List>
              {courseData.map((section) => (
                <React.Fragment key={section.id}>
                  <ListItem button onClick={() => toggleSection(section.id)}>
                    <ListItemText primary={section.name} />
                    {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={expandedSections[section.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {section.modules.map((module) => (
                        <ListItem
                          button
                          key={module.id}
                          sx={{ pl: 4 }}
                          onClick={() => handleModuleClick(module)}
                        >
                          <ListItemText primary={module.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 2 }}>
              {selectedPageContent && (
                <>
                  <Typography variant="h6" gutterBottom>{selectedPageName}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: selectedPageContent }} />
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{
          minHeight: '100vh',
          py: { xs: 3, md: 6 },
          px: { xs: 1, md: 0 },
        }}>
          {sectionsWithAssignments.length > 1 && (
            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {sectionsWithAssignments.map(section => (
                <Button
                  key={section.id}
                  variant={selectedAssignmentSection && selectedAssignmentSection.id === section.id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedAssignmentSectionId(section.id)}
                  sx={{ textTransform: 'none', fontWeight: 500, fontSize: 18, borderRadius: 3, px: 3, py: 1.2 }}
                >
                  {section.name}
                </Button>
              ))}
            </Box>
          )}
          <Box sx={{ p: 2 }}>
            {assignmentsInSection.length > 0 ? (
              assignmentsInSection.map((assignment) => {
                const sub = submissionState[assignment.id] || { fileName: '', submitted: false };
                const ai = aiState[assignment.id] || { showAI: false, aiResult: null };
                const editMode = !!editModeState[assignment.id];

                // Xử lý nộp bài
                const handleFileChange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSubmissionState(prev => ({
                      ...prev,
                      [assignment.id]: { ...prev[assignment.id], fileName: file.name, submitted: false }
                    }));
                  }
                };
                const handleSubmit = () => {
                  if (sub.fileName) {
                    saveSubmission(assignment.id, { fileName: sub.fileName });
                    setSubmissionState(prev => ({
                      ...prev,
                      [assignment.id]: { ...prev[assignment.id], submitted: true }
                    }));
                    setEditModeState(prev => ({ ...prev, [assignment.id]: false }));
                  }
                };
                // Xử lý AI feedback
                const handleAI = () => {
                  const result = {
                    rating: aiFeedback.rating[Math.floor(Math.random() * aiFeedback.rating.length)],
                    comment: aiFeedback.comment[Math.floor(Math.random() * aiFeedback.comment.length)],
                    suggestion: aiFeedback.suggestion[Math.floor(Math.random() * aiFeedback.suggestion.length)]
                  };
                  setAiState(prev => ({
                    ...prev,
                    [assignment.id]: {
                      showAI: true,
                      aiResult: result
                    }
                  }));
                };
                // Xử lý chuyển sang chế độ chỉnh sửa
                const handleEdit = () => {
                  setEditModeState(prev => ({ ...prev, [assignment.id]: true }));
                };

                return (
                  <Box key={assignment.id} sx={{ mb: 5 }}>
                    <Box sx={{
                      borderRadius: 4,
                      boxShadow: 6,
                      p: { xs: 3, md: 6 },
                      background: 'linear-gradient(, #f8fafc 0%, #e3f2fd 100%)',
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.01)' },
                      maxWidth: 3000,
                      mx: 'auto',
                      border: '2px solid #e3f2fd',
                      mb: 3
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 2, fontSize: { xs: 24, md: 36 } }}>{assignment.name}</Typography>
                      {assignment.description && (
                        <div dangerouslySetInnerHTML={{ __html: assignment.description }} style={{ marginBottom: 24, fontSize: 20, color: '#333' }} />
                      )}
                      {/* Giao diện nộp bài chi tiết */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Submission status</Typography>
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                          <Box sx={{ display: 'flex', bgcolor: '#f5f5f5' }}>
                            <Box sx={{ width: 220, p: 1.5, fontWeight: 500 }}>Submission status</Box>
                            <Box sx={{ flex: 1, p: 1.5 }}>{sub.submitted ? 'Đã nộp' : 'No attempt'}</Box>
                          </Box>
                          <Box sx={{ display: 'flex', bgcolor: '#fff' }}>
                            <Box sx={{ width: 220, p: 1.5, fontWeight: 500 }}>Grading status</Box>
                            <Box sx={{ flex: 1, p: 1.5, bgcolor: sub.submitted ? '#388e3c' : '#d32f2f', color: 'white', fontWeight: 500 }}>{sub.submitted ? 'Đã nộp' : 'Not graded'}</Box>
                          </Box>
                          <Box sx={{ display: 'flex', bgcolor: '#f5f5f5' }}>
                            <Box sx={{ width: 220, p: 1.5, fontWeight: 500 }}>Due date</Box>
                            <Box sx={{ flex: 1, p: 1.5 }}>{formatDueDate(assignment.dueDate || assignment.duedate)}</Box>
                          </Box>
                          <Box sx={{ display: 'flex', bgcolor: '#fff' }}>
                            <Box sx={{ width: 220, p: 1.5, fontWeight: 500 }}>Time remaining</Box>
                            <Box sx={{ flex: 1, p: 1.5, color: (assignment.dueDate || assignment.duedate) * 1000 < Date.now() ? 'red' : 'green' }}>
                              {getTimeRemaining(assignment.dueDate || assignment.duedate)}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', bgcolor: '#f5f5f5' }}>
                            <Box sx={{ width: 220, p: 1.5, fontWeight: 500 }}>Last modified</Box>
                            <Box sx={{ flex: 1, p: 1.5 }}>-</Box>
                          </Box>
                          <Box sx={{ display: 'flex', bgcolor: '#fff' }}>
                            <Box sx={{ width: 220, p: 1.5, fontWeight: 500 }}>Submission comments</Box>
                            <Box sx={{ flex: 1, p: 1.5 }}><Button variant="outlined" size="small">Comments (0)</Button></Box>
                          </Box>
                        </Box>
                        {/* Nộp bài hoặc hiển thị file đã nộp + nút AI + nút chỉnh sửa */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                          {!sub.submitted || editMode ? (
                            <>
                              <Button
                                variant="contained"
                                component="label"
                                startIcon={<CloudUpload />}
                              >
                                Chọn file
                                <input type="file" hidden onChange={handleFileChange} />
                              </Button>
                              <span>{sub.fileName}</span>
                              <Button variant="contained" color="success" onClick={handleSubmit} disabled={!sub.fileName}>
                                {editMode ? 'Lưu chỉnh sửa' : 'Add submission'}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Typography color="success.main" sx={{ fontWeight: 500 }}>Đã nộp: {sub.fileName}</Typography>
                              {sub.submitted && (
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  startIcon={<SmartToy sx={{ fontSize: 32 }} />}
                                  onClick={handleAI}
                                  sx={{ ml: 2, fontWeight: 700, fontSize: 18, bgcolor: '#ff9800', '&:hover': { bgcolor: '#fb8c00', boxShadow: 4 }, px: 3, py: 1.5 }}
                                >
                                  AI
                                </Button>
                              )}
                              <Button variant="outlined" color="warning" sx={{ ml: 2 }} onClick={handleEdit}>
                                Chỉnh sửa bài nộp
                              </Button>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    {/* Hiển thị đánh giá AI */}
                    {ai.showAI && ai.aiResult && (
                      <Box sx={{
                        mt: 3,
                        p: { xs: 2, md: 4 },
                        border: '3px solid #1976d2',
                        borderRadius: 4,
                        bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
                        boxShadow: 6,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 3,
                        flexDirection: { xs: 'column', md: 'row' },
                        maxWidth: 2000,
                        mx: 'auto',
                        overflow: 'auto',
                        wordBreak: 'break-word',
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
                          <StarIcon sx={{ color: '#1976d2', fontSize: 60, mb: 1 }} />
                          <Info sx={{ color: '#0288d1', fontSize: 36 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, mb: 2, fontSize: 20, color: '#1976d2' }} component="div" dangerouslySetInnerHTML={{ __html: `<b>Đánh giá:</b> ${ai.aiResult.rating}` }} />
                          <Typography sx={{ mb: 2, fontSize: 18 }} component="div" dangerouslySetInnerHTML={{ __html: `<b>Nhận xét:</b> ${ai.aiResult.comment}` }} />
                          <Typography sx={{ fontSize: 18, mb: 2 }} component="div" dangerouslySetInnerHTML={{ __html: `<b>Gợi ý cải thiện:</b> ${ai.aiResult.suggestion}` }} />
                          <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: 17, color: '#1976d2', mb: 1 }}>Tài liệu tham khảo:</Typography>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              <li><a href="https://vietjack.com" target="_blank" rel="noopener noreferrer">VietJack - Bài mẫu, lý thuyết</a></li>
                              <li><a href="https://www.khanacademy.org/" target="_blank" rel="noopener noreferrer">Khan Academy - Video, bài giảng</a></li>
                              <li><a href="https://www.studocu.com/vn" target="_blank" rel="noopener noreferrer">StuDocu - Tài liệu tham khảo</a></li>
                              <li><a href="https://www.ted.com/topics/creativity" target="_blank" rel="noopener noreferrer">TED Talks - Sáng tạo & truyền cảm hứng</a></li>
                              <li><a href="https://writingcenter.fas.harvard.edu/pages/essay-structure" target="_blank" rel="noopener noreferrer">Harvard Writing Center - Cấu trúc bài luận</a></li>
                              <li><a href="https://www.canva.com/learn/infographic-design/" target="_blank" rel="noopener noreferrer">Canva - Thiết kế hình ảnh minh họa</a></li>
                            </ul>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })
            ) : (
              <Typography color="text.secondary">Không có bài tập nào trong chủ đề này.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default CourseContent;
