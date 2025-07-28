function timeFormat(time: number): string {
    const date = new Date(time);
    // 时间格式化 1999-09-09 09:09:09
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 + '').padStart(2, '0') + '-';
    const D = (date.getDate() + '').padStart(2, '0') + ' ';
    const h = (date.getHours() + '').padStart(2, '0') + ':';
    const m = (date.getMinutes() + '').padStart(2, '0') + ':';
    const s = (date.getSeconds() + '').padStart(2, '0');
    return Y + M + D + h + m + s;
}

function timeFormatDate(time: number): string {
    const date = new Date(time);
    // 时间格式化 1999-09-09
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 + '').padStart(2, '0') + '-';
    const D = (date.getDate() + '').padStart(2, '0');
    return Y + M + D;
}

export { timeFormat, timeFormatDate };