function convertToGMT7(timestamp: string) {
    const date = new Date(timestamp);
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    let formatted = `${hour}:${minute}, ${dayOfMonth}/${month}/${year}`;
    if (hour < 10) {
        formatted = '0' + formatted;
    }
    return formatted;
}

export {
    convertToGMT7,
}