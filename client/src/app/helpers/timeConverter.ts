function convertToGMT7(timestamp: string) {
    const date = new Date(timestamp);
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const formatted = `${hour}:${minute}:${second}, ${dayOfMonth}/${month}/${year}`;
    return formatted;
}

export {
    convertToGMT7,
}