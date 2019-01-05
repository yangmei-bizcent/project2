export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

export function formatDate2(val) {
    var value = new Date(val); 
    var year = value.getFullYear(); 
    var month = padDate(value.getMonth() + 1); 
    var day = padDate(value.getDate()); 
    var hour = padDate(value.getHours());
     var minutes = padDate(value.getMinutes()); 
     var seconds = padDate(value.getSeconds()); 
     return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;

};

export function formatWeekDate (date) {
    let deltaDay = date.getDay() - 0 === 0 ? 7 : date.getDay() - 0;
    let result = [];
    date.setDate(date.getDate() - deltaDay);
    for (let i = 0; i < 8; i++) {
        date.setDate(date.getDate() + 1);
        result.push(formatDate(date, 'yyyy-MM-dd'));
    }
    return result;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
function padDate(va){
    va=va<10?'0'+va:va;
    return va
}