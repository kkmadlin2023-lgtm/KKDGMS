// Date Utilities

export const formatDate = (dateInput, format = 'DD/MM/YYYY') => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  switch (format) {
    case 'YYYY-MM-DD': return \`\${year}-\${month}-\${day}\`;
    case 'MM/DD/YYYY': return \`\${month}/\${day}/\${year}\`;
    case 'DD-MMM-YYYY': 
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return \`\${day}-\${monthNames[d.getMonth()]}-\${year}\`;
    default: return \`\${day}/\${month}/\${year}\`;
  }
};

export const formatTime = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';

  let hours = d.getHours();
  let minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return \`\${hours}:\${minutes} \${ampm}\`;
};

export const formatDateTime = (dateInput) => {
  return \`\${formatDate(dateInput)} \${formatTime(dateInput)}\`;
};

export const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }
  
  if (days < 0) {
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months--;
  }

  return { years, months, days };
};

export const getAcademicYear = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11
  
  // Assuming academic year starts in June (month 5)
  if (month >= 5) {
    return \`\${year}-\${year + 1}\`;
  } else {
    return \`\${year - 1}-\${year}\`;
  }
};

export const isToday = (dateInput) => {
  const d = new Date(dateInput);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

export const isYesterday = (dateInput) => {
  const d = new Date(dateInput);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
};

export const isThisWeek = (dateInput) => {
  const d = new Date(dateInput);
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6)); // Saturday
  return d >= startOfWeek && d <= endOfWeek;
};

export const isThisMonth = (dateInput) => {
  const d = new Date(dateInput);
  const today = new Date();
  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
};

export const timeAgo = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  const now = new Date();
  const seconds = Math.round((now - d) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 30) return 'Just now';
  if (seconds < 60) return \`\${seconds} seconds ago\`;
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return \`\${minutes} minutes ago\`;
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return \`\${hours} hours ago\`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return \`\${days} days ago\`;
  
  return formatDate(d);
};

export const getWorkingDays = (startDate, endDate, holidays = []) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  
  const holidayDates = holidays.map(h => new Date(h).toDateString());

  const curDate = new Date(start.getTime());
  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    const isWeekend = (dayOfWeek === 0); // Sunday only for schools, adjust if Saturday is off
    const isHoliday = holidayDates.includes(curDate.toDateString());
    
    if (!isWeekend && !isHoliday) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (monthIndex) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[monthIndex];
};

export const getDayName = (dayIndex) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex];
};
