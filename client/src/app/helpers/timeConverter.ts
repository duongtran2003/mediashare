function convertToGMT7(timestamp: string) {
    const date = new Date(timestamp);
    let dayOfMonth = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    while (dayOfMonth.length < 2) {
        dayOfMonth = '0' + dayOfMonth;
    }
    while (month.length < 2) {
        month = '0' + month;
    }
    while (year.length < 4) {
        year = '0' + year;
    }
    while (hour.length < 2) {
        hour = '0' + hour;
    }
    while (minute.length < 2) {
        minute = '0' + minute;
    }
    let formatted = `${hour}:${minute}, ${dayOfMonth}/${month}/${year}`;
    return formatted;
}

export {
    convertToGMT7,
}