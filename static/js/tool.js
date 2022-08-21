function getMonthList(startYear) {
    // 获取从startYear到目前为止的双月列表，格式yyyy-MM~yyyy-MM
    let fillZero = num => {
      if (num < 10) {
        return '0' + num;
      }
      return num + '';
    };
    let ret = [];
    let curMonth = new Date().getMonth() + 3;  // getMonth从0开始。。。
    let curYear = new Date().getFullYear();
    if (curMonth > 12) {
      curYear += 1;
      curMonth = 1;
    }
    for (let year = curYear; year >= startYear; --year) {
      for (let month = curMonth; month > 0; month -= 2) {
        let m = Math.ceil(month / 2) * 2;
        ret.push(year + '.' + fillZero(m - 1) + '~' + year + '.' + fillZero(m));
      }
      curMonth = 12;
    }
    return ret;
}

export {
    getMonthList
}