document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    //  SECTION 1: 核心資料與設定
    // =================================================================
    const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const BRANCH_TO_PALACE_ID = {'子':'pZi','丑':'pChou','寅':'pYin','卯':'pMao','辰':'pChen','巳':'pSi','午':'pWu','未':'pWei','申':'pShen','酉':'pYou','戌':'pXu','亥':'pHai', '乾':'pQian', '坤':'pKun', '艮':'pGen', '巽':'pXun'};
    const PALACE_ID_TO_BRANCH = Object.fromEntries(Object.entries(BRANCH_TO_PALACE_ID).map(([k, v]) => [v, k]));
    const VALID_PALACES_CLOCKWISE = [ 'pZi', 'pChou', 'pYin', 'pMao', 'pChen', 'pSi', 'pWu', 'pWei', 'pShen', 'pYou', 'pXu', 'pHai' ];
    const LIFE_PALACE_NAMES = [ '命', '兄', '妻', '孫', '財', '田', '官', '奴', '疾', '福', '貌', '父' ];
    const AGE_LIMIT_DATA = [ '1-15', '16-20', '21-31', '32-35.5', '35.6-40', '41-45', '46-60', '61-64.5', '64.6-71.5', '71.6-82.5', '82.6-96.5', '96.6-106' ];
    const ANNUAL_LIMIT_DISPLAY_YEARS = 8; // 顯示當前歲數。您可以隨意修改這個數字 (例如改成 7 或 15)

    // ▼▼▼ 盤面的位置設定 ▼▼▼ 
    const RADIAL_LAYOUT = {
        center: { x: 395.5, y: 418.5 },
        angles: { pYou:0, pXu:22.5, pQian:45, pHai:66.5, pZi:90, pChou:113.5, pGen:135, pYin:157.5, pMao:180, pChen:202.5, pXun:225, pSi:246.5, pWu:270, pWei:293.5, pKun:315, pShen:337.5 },
        angleOffset: 6,
        bottomPalaceRadiusOffset: 20, // 控制巳午未宮位文字要再離圓心多遠
        radii: {
            lineLeft:   { fieldA: 135, fieldB: 175, fieldG: 215 },
            lineCenter: { fieldC: 135, fieldD: 165, fieldC2: 195, fieldD2: 225 },
            lineRight:  { fieldE: 135, fieldF: 165, fieldE2: 195, fieldF2: 225 }
        },
        // ▼▼▼ 定義圓心 4 個欄位的座標 ▼▼▼
        centerFields: {
            field1: { x: 397, y: 408 }, field2: { x: 397, y: 438 },
            field3: { x: 381, y: 420 }, field4: { x: 413, y: 420 }
        },
        
        lifePalacesRing: { radius: 100, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'], color: '#792e13ff' },
        ageLimitRing: { radius: 122, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'], flipPalaces: ['pZi','pHai','pSi','pXu','pYou','pShen'], color: '#626363', className: 'age-limit-style' },
        sdrRing: { radius: 110, hOffset: 6.5, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'] },
        yueJiangRing: { radius: 288, rotationOffset: 6, palaces: ['pZi','pHai','pXu','pYou','pShen','pWei','pWu','pSi','pChen','pMao','pYin','pChou'], flipPalaces: ['pHai','pSi','pXu','pYou','pShen'], color: '#501dd3' },
        guiRenRing: { radius: 288, rotationOffset: -5, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'], flipPalaces: ['pZi','pHai','pSi','pXu','pYou','pWu','pShen'], color: '#ae00ff' },
        outerRing: { radius: 257, palaces: ['pZi', 'pGen', 'pMao', 'pXun', 'pWu', 'pKun', 'pYou', 'pQian']},
        xingNianRing: { radius: 303, flipPalaces: ['pZi', 'pHai', 'pXu', 'pYou', 'pShen', 'pSi']},
        yangJiuRing: { radius: 331, rotationOffset: 5, className: 'yang-jiu-style', flipPalaces: ['pHai','pSi','pXu','pYou','pShen'] },
        baiLiuRing: { radius: 331, rotationOffset: -5.5, className: 'bai-liu-style', flipPalaces: ['pZi', 'pHai', 'pWu', 'pXu', 'pYou', 'pShen', 'pSi'] }, 
        baiLiuXiaoXianRing: { radius: 317, rotationOffset: -5.5, className: 'bai-liu-style', flipPalaces: ['pZi', 'pHai', 'pWu', 'pXu', 'pYou', 'pShen', 'pSi'] },
        daYouZhenXianRing: { radius: 317, rotationOffset: 5, className: 'da-you-zhen-xian-style', flipPalaces: ['pHai','pSi','pXu','pYou','pShen'] },
        feiLuDaXianRing: { radius: 344, rotationOffset: 5, className: 'fei-lu-da-xian-style', flipPalaces: ['pHai','pSi','pXu','pYou','pShen'] },
        feiMaDaXianRing: { radius: 344, rotationOffset: -5.5, className: 'fei-ma-da-xian-style', flipPalaces: ['pZi', 'pHai', 'pWu', 'pXu', 'pYou', 'pShen', 'pSi'] },
        feiLuLiuNianRing: { radius: 272, rotationOffset: 7, className: 'fei-lu-liu-nian-style', flipPalaces: ['pHai','pSi','pXu','pYou','pShen'] },
        feiMaLiuNianRing: { radius: 272, rotationOffset: -6, className: 'fei-ma-da-xian-style', flipPalaces: ['pZi', 'pHai', 'pWu', 'pXu', 'pYou', 'pShen', 'pSi'] },
        heiFuRing: { radius: 272, rotationOffset: 0, className: 'hei-fu-style', flipPalaces: ['pZi', 'pHai', 'pXu', 'pYou', 'pShen', 'pSi'] }
        
    };

    // ▼▼▼ 中文月份名稱 ▼▼▼
    const MONTH_NAMES_CHINESE = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

    // ▼▼▼ 夏至冬至基準點資料庫 (1900-2030) ▼▼▼
    const SOLSTICE_DATA = {
    1900: { summer: { date: new Date("1900-06-22T05:39:00"), dayPillar: "丙寅", dayBureau: 39, dayJishu: 11386982 }, winter: { date: new Date("1900-12-22T14:41:00"), dayPillar: "己巳", dayBureau: 6, dayJishu: 11387165 } },
    1901: { summer: { date: new Date("1901-06-22T11:27:00"), dayPillar: "辛未", dayBureau: 44, dayJishu: 11387347 }, winter: { date: new Date("1901-12-22T20:36:00"), dayPillar: "甲戌", dayBureau: 11, dayJishu: 11387530 } },
    1902: { summer: { date: new Date("1902-06-22T17:15:00"), dayPillar: "丙子", dayBureau: 49, dayJishu: 11387712 }, winter: { date: new Date("1902-12-23T02:35:00"), dayPillar: "庚辰", dayBureau: 17, dayJishu: 11387896 } },
    1903: { summer: { date: new Date("1903-06-22T23:04:00"), dayPillar: "辛巳", dayBureau: 54, dayJishu: 11388077 }, winter: { date: new Date("1903-12-23T08:20:00"), dayPillar: "乙酉", dayBureau: 22, dayJishu: 11388261 } },
    1904: { summer: { date: new Date("1904-06-22T04:51:00"), dayPillar: "丁亥", dayBureau: 60, dayJishu: 11388443 }, winter: { date: new Date("1904-12-22T14:13:00"), dayPillar: "庚寅", dayBureau: 27, dayJishu: 11388626 } },
    1905: { summer: { date: new Date("1905-06-22T10:51:00"), dayPillar: "壬辰", dayBureau: 65, dayJishu: 11388808 }, winter: { date: new Date("1905-12-22T20:03:00"), dayPillar: "乙未", dayBureau: 32, dayJishu: 11388991 } },
    1906: { summer: { date: new Date("1906-06-22T16:41:00"), dayPillar: "丁酉", dayBureau: 70, dayJishu: 11389173 }, winter: { date: new Date("1906-12-23T01:53:00"), dayPillar: "辛丑", dayBureau: 38, dayJishu: 11389357 } },
    1907: { summer: { date: new Date("1907-06-22T22:22:00"), dayPillar: "壬寅", dayBureau: 3, dayJishu: 11389538 }, winter: { date: new Date("1907-12-23T07:51:00"), dayPillar: "丙午", dayBureau: 43, dayJishu: 11389722 } },
    1908: { summer: { date: new Date("1908-06-22T04:19:00"), dayPillar: "戊申", dayBureau: 9, dayJishu: 11389904 }, winter: { date: new Date("1908-12-22T13:33:00"), dayPillar: "辛亥", dayBureau: 48, dayJishu: 11390087 } },
    1909: { summer: { date: new Date("1909-06-22T10:05:00"), dayPillar: "癸丑", dayBureau: 14, dayJishu: 11390269 }, winter: { date: new Date("1909-12-22T19:19:00"), dayPillar: "丙辰", dayBureau: 53, dayJishu: 11390452 } },
    1910: { summer: { date: new Date("1910-06-22T15:48:00"), dayPillar: "戊午", dayBureau: 19, dayJishu: 11390634 }, winter: { date: new Date("1910-12-23T01:11:00"), dayPillar: "壬戌", dayBureau: 59, dayJishu: 11390818 } },
    1911: { summer: { date: new Date("1911-06-22T21:35:00"), dayPillar: "癸亥", dayBureau: 24, dayJishu: 11390999 }, winter: { date: new Date("1911-12-23T06:53:00"), dayPillar: "丁卯", dayBureau: 64, dayJishu: 11391183 } },
    1912: { summer: { date: new Date("1912-06-22T03:16:00"), dayPillar: "己巳", dayBureau: 30, dayJishu: 11391365 }, winter: { date: new Date("1912-12-22T12:44:00"), dayPillar: "壬申", dayBureau: 69, dayJishu: 11391548 } },
    1913: { summer: { date: new Date("1913-06-22T09:09:00"), dayPillar: "甲戌", dayBureau: 35, dayJishu: 11391730 }, winter: { date: new Date("1913-12-22T18:34:00"), dayPillar: "丁丑", dayBureau: 2, dayJishu: 11391913 } },
    1914: { summer: { date: new Date("1914-06-22T14:54:00"), dayPillar: "己卯", dayBureau: 40, dayJishu: 11392095 }, winter: { date: new Date("1914-12-23T00:22:00"), dayPillar: "癸未", dayBureau: 8, dayJishu: 11392279 } },
    1915: { summer: { date: new Date("1915-06-22T20:29:00"), dayPillar: "甲申", dayBureau: 45, dayJishu: 11392460 }, winter: { date: new Date("1915-12-23T06:15:00"), dayPillar: "戊子", dayBureau: 13, dayJishu: 11392644 } },
    1916: { summer: { date: new Date("1916-06-22T02:24:00"), dayPillar: "庚寅", dayBureau: 51, dayJishu: 11392826 }, winter: { date: new Date("1916-12-22T11:58:00"), dayPillar: "癸巳", dayBureau: 18, dayJishu: 11393009 } },
    1917: { summer: { date: new Date("1917-06-22T08:14:00"), dayPillar: "乙未", dayBureau: 56, dayJishu: 11393191 }, winter: { date: new Date("1917-12-22T17:45:00"), dayPillar: "戊戌", dayBureau: 23, dayJishu: 11393374 } },
    1918: { summer: { date: new Date("1918-06-22T13:59:00"), dayPillar: "庚子", dayBureau: 61, dayJishu: 11393556 }, winter: { date: new Date("1918-12-22T23:41:00"), dayPillar: "癸卯", dayBureau: 29, dayJishu: 11393740 } },
    1919: { summer: { date: new Date("1919-06-22T19:53:00"), dayPillar: "乙巳", dayBureau: 66, dayJishu: 11393921 }, winter: { date: new Date("1919-12-23T05:27:00"), dayPillar: "己酉", dayBureau: 34, dayJishu: 11394105 } },
    1920: { summer: { date: new Date("1920-06-22T01:39:00"), dayPillar: "辛亥", dayBureau: 72, dayJishu: 11394287 }, winter: { date: new Date("1920-12-22T11:16:00"), dayPillar: "甲寅", dayBureau: 39, dayJishu: 11394470 } },
    1921: { summer: { date: new Date("1921-06-22T07:35:00"), dayPillar: "丙辰", dayBureau: 5, dayJishu: 11394652 }, winter: { date: new Date("1921-12-22T17:07:00"), dayPillar: "己未", dayBureau: 44, dayJishu: 11394835 } },
    1922: { summer: { date: new Date("1922-06-22T13:26:00"), dayPillar: "辛酉", dayBureau: 10, dayJishu: 11395017 }, winter: { date: new Date("1922-12-22T22:56:00"), dayPillar: "甲子", dayBureau: 49, dayJishu: 11395200 } },
    1923: { summer: { date: new Date("1923-06-22T19:02:00"), dayPillar: "丙寅", dayBureau: 15, dayJishu: 11395382 }, winter: { date: new Date("1923-12-23T04:53:00"), dayPillar: "庚午", dayBureau: 55, dayJishu: 11395566 } },
    1924: { summer: { date: new Date("1924-06-22T00:59:00"), dayPillar: "壬申", dayBureau: 21, dayJishu: 11395748 }, winter: { date: new Date("1924-12-22T10:45:00"), dayPillar: "乙亥", dayBureau: 60, dayJishu: 11395931 } },
    1925: { summer: { date: new Date("1925-06-22T06:49:00"), dayPillar: "丁丑", dayBureau: 26, dayJishu: 11396113 }, winter: { date: new Date("1925-12-22T16:36:00"), dayPillar: "庚辰", dayBureau: 65, dayJishu: 11396296 } },
    1926: { summer: { date: new Date("1926-06-22T12:29:00"), dayPillar: "壬午", dayBureau: 31, dayJishu: 11396478 }, winter: { date: new Date("1926-12-22T22:33:00"), dayPillar: "乙酉", dayBureau: 70, dayJishu: 11396661 } },
    1927: { summer: { date: new Date("1927-06-22T18:22:00"), dayPillar: "丁亥", dayBureau: 36, dayJishu: 11396843 }, winter: { date: new Date("1927-12-23T04:18:00"), dayPillar: "辛卯", dayBureau: 4, dayJishu: 11397027 } },
    1928: { summer: { date: new Date("1928-06-22T00:06:00"), dayPillar: "癸巳", dayBureau: 42, dayJishu: 11397209 }, winter: { date: new Date("1928-12-22T10:03:00"), dayPillar: "丙申", dayBureau: 9, dayJishu: 11397392 } },
    1929: { summer: { date: new Date("1929-06-22T06:00:00"), dayPillar: "戊戌", dayBureau: 47, dayJishu: 11397574 }, winter: { date: new Date("1929-12-22T15:52:00"), dayPillar: "辛丑", dayBureau: 14, dayJishu: 11397757 } },
    1930: { summer: { date: new Date("1930-06-22T11:52:00"), dayPillar: "癸卯", dayBureau: 52, dayJishu: 11397939 }, winter: { date: new Date("1930-12-22T21:39:00"), dayPillar: "丙午", dayBureau: 19, dayJishu: 11398122 } },
    1931: { summer: { date: new Date("1931-06-22T17:28:00"), dayPillar: "戊申", dayBureau: 57, dayJishu: 11398304 }, winter: { date: new Date("1931-12-23T03:29:00"), dayPillar: "壬子", dayBureau: 25, dayJishu: 11398488 } },
    1932: { summer: { date: new Date("1932-06-21T23:22:00"), dayPillar: "癸丑", dayBureau: 62, dayJishu: 11398669 }, winter: { date: new Date("1932-12-22T09:14:00"), dayPillar: "丁巳", dayBureau: 30, dayJishu: 11398853 } },
    1933: { summer: { date: new Date("1933-06-22T05:11:00"), dayPillar: "己未", dayBureau: 68, dayJishu: 11399035 }, winter: { date: new Date("1933-12-22T14:57:00"), dayPillar: "壬戌", dayBureau: 35, dayJishu: 11399218 } },
    1934: { summer: { date: new Date("1934-06-22T10:47:00"), dayPillar: "甲子", dayBureau: 1, dayJishu: 11399400 }, winter: { date: new Date("1934-12-22T20:49:00"), dayPillar: "丁卯", dayBureau: 40, dayJishu: 11399583 } },
    1935: { summer: { date: new Date("1935-06-22T16:37:00"), dayPillar: "己巳", dayBureau: 6, dayJishu: 11399765 }, winter: { date: new Date("1935-12-23T02:37:00"), dayPillar: "癸酉", dayBureau: 46, dayJishu: 11399949 } },
    1936: { summer: { date: new Date("1936-06-21T22:21:00"), dayPillar: "甲戌", dayBureau: 11, dayJishu: 11400130 }, winter: { date: new Date("1936-12-22T08:26:00"), dayPillar: "戊寅", dayBureau: 51, dayJishu: 11400314 } },
    1937: { summer: { date: new Date("1937-06-22T04:11:00"), dayPillar: "庚辰", dayBureau: 17, dayJishu: 11400496 }, winter: { date: new Date("1937-12-22T14:21:00"), dayPillar: "癸未", dayBureau: 56, dayJishu: 11400679 } },
    1938: { summer: { date: new Date("1938-06-22T10:03:00"), dayPillar: "乙酉", dayBureau: 22, dayJishu: 11400861 }, winter: { date: new Date("1938-12-22T20:13:00"), dayPillar: "戊子", dayBureau: 61, dayJishu: 11401044 } },
    1939: { summer: { date: new Date("1939-06-22T15:39:00"), dayPillar: "庚寅", dayBureau: 27, dayJishu: 11401226 }, winter: { date: new Date("1939-12-23T02:05:00"), dayPillar: "甲午", dayBureau: 67, dayJishu: 11401410 } },
    1940: { summer: { date: new Date("1940-06-21T21:36:00"), dayPillar: "乙未", dayBureau: 32, dayJishu: 11401591 }, winter: { date: new Date("1940-12-22T07:54:00"), dayPillar: "己亥", dayBureau: 72, dayJishu: 11401775 } },
    1941: { summer: { date: new Date("1941-06-22T03:33:00"), dayPillar: "辛丑", dayBureau: 38, dayJishu: 11401957 }, winter: { date: new Date("1941-12-22T13:44:00"), dayPillar: "甲辰", dayBureau: 5, dayJishu: 11402140 } },
    1942: { summer: { date: new Date("1942-06-22T09:16:00"), dayPillar: "丙午", dayBureau: 43, dayJishu: 11402322 }, winter: { date: new Date("1942-12-22T19:39:00"), dayPillar: "己酉", dayBureau: 10, dayJishu: 11402505 } },
    1943: { summer: { date: new Date("1943-06-22T15:12:00"), dayPillar: "辛亥", dayBureau: 48, dayJishu: 11402687 }, winter: { date: new Date("1943-12-23T01:29:00"), dayPillar: "乙卯", dayBureau: 16, dayJishu: 11402871 } },
    1944: { summer: { date: new Date("1944-06-21T21:02:00"), dayPillar: "丙辰", dayBureau: 53, dayJishu: 11403052 }, winter: { date: new Date("1944-12-22T07:14:00"), dayPillar: "庚申", dayBureau: 21, dayJishu: 11403236 } },
    1945: { summer: { date: new Date("1945-06-22T02:52:00"), dayPillar: "壬戌", dayBureau: 59, dayJishu: 11403418 }, winter: { date: new Date("1945-12-22T13:03:00"), dayPillar: "乙丑", dayBureau: 26, dayJishu: 11403601 } },
    1946: { summer: { date: new Date("1946-06-22T08:44:00"), dayPillar: "丁卯", dayBureau: 64, dayJishu: 11403783 }, winter: { date: new Date("1946-12-22T18:53:00"), dayPillar: "庚午", dayBureau: 31, dayJishu: 11403966 } },
    1947: { summer: { date: new Date("1947-06-22T14:18:00"), dayPillar: "壬申", dayBureau: 69, dayJishu: 11404148 }, winter: { date: new Date("1947-12-23T00:42:00"), dayPillar: "丙子", dayBureau: 37, dayJishu: 11404332 } },
    1948: { summer: { date: new Date("1948-06-21T20:10:00"), dayPillar: "丁丑", dayBureau: 2, dayJishu: 11404513 }, winter: { date: new Date("1948-12-22T06:33:00"), dayPillar: "辛巳", dayBureau: 42, dayJishu: 11404697 } },
    1949: { summer: { date: new Date("1949-06-22T02:02:00"), dayPillar: "癸未", dayBureau: 8, dayJishu: 11404879 }, winter: { date: new Date("1949-12-22T12:22:00"), dayPillar: "丙戌", dayBureau: 47, dayJishu: 11405062 } },
    1950: { summer: { date: new Date("1950-06-22T07:35:00"), dayPillar: "戊子", dayBureau: 13, dayJishu: 11405244 }, winter: { date: new Date("1950-12-22T18:13:00"), dayPillar: "辛卯", dayBureau: 52, dayJishu: 11405427 } },
    1951: { summer: { date: new Date("1951-06-22T13:24:00"), dayPillar: "癸巳", dayBureau: 18, dayJishu: 11405609 }, winter: { date: new Date("1951-12-23T00:00:00"), dayPillar: "丁酉", dayBureau: 58, dayJishu: 11405793 } },
    1952: { summer: { date: new Date("1952-06-21T19:12:00"), dayPillar: "戊戌", dayBureau: 23, dayJishu: 11405974 }, winter: { date: new Date("1952-12-22T05:43:00"), dayPillar: "壬寅", dayBureau: 63, dayJishu: 11406158 } },
    1953: { summer: { date: new Date("1953-06-22T00:59:00"), dayPillar: "甲辰", dayBureau: 29, dayJishu: 11406340 }, winter: { date: new Date("1953-12-22T11:31:00"), dayPillar: "丁未", dayBureau: 68, dayJishu: 11406523 } },
    1954: { summer: { date: new Date("1954-06-22T06:53:00"), dayPillar: "己酉", dayBureau: 34, dayJishu: 11406705 }, winter: { date: new Date("1954-12-22T17:24:00"), dayPillar: "壬子", dayBureau: 1, dayJishu: 11406888 } },
    1955: { summer: { date: new Date("1955-06-22T12:31:00"), dayPillar: "甲寅", dayBureau: 39, dayJishu: 11407070 }, winter: { date: new Date("1955-12-22T23:10:00"), dayPillar: "丁巳", dayBureau: 6, dayJishu: 11407254 } },
    1956: { summer: { date: new Date("1956-06-21T18:23:00"), dayPillar: "己未", dayBureau: 44, dayJishu: 11407435 }, winter: { date: new Date("1956-12-22T04:59:00"), dayPillar: "癸亥", dayBureau: 12, dayJishu: 11407619 } },
    1957: { summer: { date: new Date("1957-06-22T00:20:00"), dayPillar: "乙丑", dayBureau: 50, dayJishu: 11407801 }, winter: { date: new Date("1957-12-22T10:48:00"), dayPillar: "戊辰", dayBureau: 17, dayJishu: 11407984 } },
    1958: { summer: { date: new Date("1958-06-22T05:56:00"), dayPillar: "庚午", dayBureau: 55, dayJishu: 11408166 }, winter: { date: new Date("1958-12-22T16:39:00"), dayPillar: "癸酉", dayBureau: 22, dayJishu: 11408349 } },
    1959: { summer: { date: new Date("1959-06-22T11:49:00"), dayPillar: "乙亥", dayBureau: 60, dayJishu: 11408531 }, winter: { date: new Date("1959-12-22T22:34:00"), dayPillar: "戊寅", dayBureau: 27, dayJishu: 11408714 } },
    1960: { summer: { date: new Date("1960-06-21T17:42:00"), dayPillar: "庚辰", dayBureau: 65, dayJishu: 11408896 }, winter: { date: new Date("1960-12-22T04:25:00"), dayPillar: "甲申", dayBureau: 33, dayJishu: 11409080 } },
    1961: { summer: { date: new Date("1961-06-21T23:30:00"), dayPillar: "乙酉", dayBureau: 70, dayJishu: 11409261 }, winter: { date: new Date("1961-12-22T10:19:00"), dayPillar: "己丑", dayBureau: 38, dayJishu: 11409445 } },
    1962: { summer: { date: new Date("1962-06-22T05:24:00"), dayPillar: "辛卯", dayBureau: 4, dayJishu: 11409627 }, winter: { date: new Date("1962-12-22T16:15:00"), dayPillar: "甲午", dayBureau: 43, dayJishu: 11409810 } },
    1963: { summer: { date: new Date("1963-06-22T11:03:00"), dayPillar: "丙申", dayBureau: 9, dayJishu: 11409992 }, winter: { date: new Date("1963-12-22T22:01:00"), dayPillar: "己亥", dayBureau: 48, dayJishu: 11410175 } },
    1964: { summer: { date: new Date("1964-06-21T16:56:00"), dayPillar: "辛丑", dayBureau: 14, dayJishu: 11410357 }, winter: { date: new Date("1964-12-22T03:49:00"), dayPillar: "乙巳", dayBureau: 54, dayJishu: 11410541 } },
    1965: { summer: { date: new Date("1965-06-21T22:55:00"), dayPillar: "丙午", dayBureau: 19, dayJishu: 11410722 }, winter: { date: new Date("1965-12-22T09:40:00"), dayPillar: "庚戌", dayBureau: 59, dayJishu: 11410906 } },
    1966: { summer: { date: new Date("1966-06-22T04:33:00"), dayPillar: "壬子", dayBureau: 25, dayJishu: 11411088 }, winter: { date: new Date("1966-12-22T15:28:00"), dayPillar: "乙卯", dayBureau: 64, dayJishu: 11411271 } },
    1967: { summer: { date: new Date("1967-06-22T10:22:00"), dayPillar: "丁巳", dayBureau: 30, dayJishu: 11411453 }, winter: { date: new Date("1967-12-22T21:16:00"), dayPillar: "庚申", dayBureau: 69, dayJishu: 11411636 } },
    1968: { summer: { date: new Date("1968-06-21T16:13:00"), dayPillar: "壬戌", dayBureau: 35, dayJishu: 11411818 }, winter: { date: new Date("1968-12-22T02:59:00"), dayPillar: "丙寅", dayBureau: 3, dayJishu: 11412002 } },
    1969: { summer: { date: new Date("1969-06-21T21:55:00"), dayPillar: "丁卯", dayBureau: 40, dayJishu: 11412183 }, winter: { date: new Date("1969-12-22T08:43:00"), dayPillar: "辛未", dayBureau: 8, dayJishu: 11412367 } },
    1970: { summer: { date: new Date("1970-06-22T03:42:00"), dayPillar: "癸酉", dayBureau: 46, dayJishu: 11412549 }, winter: { date: new Date("1970-12-22T14:35:00"), dayPillar: "丙子", dayBureau: 13, dayJishu: 11412732 } },
    1971: { summer: { date: new Date("1971-06-22T09:19:00"), dayPillar: "戊寅", dayBureau: 51, dayJishu: 11412914 }, winter: { date: new Date("1971-12-22T20:23:00"), dayPillar: "辛巳", dayBureau: 18, dayJishu: 11413097 } },
    1972: { summer: { date: new Date("1972-06-21T15:06:00"), dayPillar: "癸未", dayBureau: 56, dayJishu: 11413279 }, winter: { date: new Date("1972-12-22T02:12:00"), dayPillar: "丁亥", dayBureau: 24, dayJishu: 11413463 } },
    1973: { summer: { date: new Date("1973-06-21T21:00:00"), dayPillar: "戊子", dayBureau: 61, dayJishu: 11413644 }, winter: { date: new Date("1973-12-22T08:07:00"), dayPillar: "壬辰", dayBureau: 29, dayJishu: 11413828 } },
    1974: { summer: { date: new Date("1974-06-22T02:37:00"), dayPillar: "甲午", dayBureau: 67, dayJishu: 11414010 }, winter: { date: new Date("1974-12-22T13:55:00"), dayPillar: "丁酉", dayBureau: 34, dayJishu: 11414193 } },
    1975: { summer: { date: new Date("1975-06-22T08:26:00"), dayPillar: "己亥", dayBureau: 72, dayJishu: 11414375 }, winter: { date: new Date("1975-12-22T19:45:00"), dayPillar: "壬寅", dayBureau: 39, dayJishu: 11414558 } },
    1976: { summer: { date: new Date("1976-06-21T14:24:00"), dayPillar: "甲辰", dayBureau: 5, dayJishu: 11414740 }, winter: { date: new Date("1976-12-22T01:35:00"), dayPillar: "戊申", dayBureau: 45, dayJishu: 11414924 } },
    1977: { summer: { date: new Date("1977-06-21T20:13:00"), dayPillar: "己酉", dayBureau: 10, dayJishu: 11415105 }, winter: { date: new Date("1977-12-22T07:23:00"), dayPillar: "癸丑", dayBureau: 50, dayJishu: 11415289 } },
    1978: { summer: { date: new Date("1978-06-22T02:09:00"), dayPillar: "乙卯", dayBureau: 16, dayJishu: 11415471 }, winter: { date: new Date("1978-12-22T13:20:00"), dayPillar: "戊午", dayBureau: 55, dayJishu: 11415654 } },
    1979: { summer: { date: new Date("1979-06-22T07:56:00"), dayPillar: "庚申", dayBureau: 21, dayJishu: 11415836 }, winter: { date: new Date("1979-12-22T19:09:00"), dayPillar: "癸亥", dayBureau: 60, dayJishu: 11416019 } },
    1980: { summer: { date: new Date("1980-06-21T13:47:00"), dayPillar: "乙丑", dayBureau: 26, dayJishu: 11416201 }, winter: { date: new Date("1980-12-22T00:56:00"), dayPillar: "己巳", dayBureau: 66, dayJishu: 11416385 } },
    1981: { summer: { date: new Date("1981-06-21T19:44:00"), dayPillar: "庚午", dayBureau: 31, dayJishu: 11416566 }, winter: { date: new Date("1981-12-22T06:50:00"), dayPillar: "甲戌", dayBureau: 71, dayJishu: 11416750 } },
    1982: { summer: { date: new Date("1982-06-22T01:22:00"), dayPillar: "丙子", dayBureau: 37, dayJishu: 11416932 }, winter: { date: new Date("1982-12-22T12:38:00"), dayPillar: "己卯", dayBureau: 4, dayJishu: 11417115 } },
    1983: { summer: { date: new Date("1983-06-22T07:08:00"), dayPillar: "辛巳", dayBureau: 42, dayJishu: 11417297 }, winter: { date: new Date("1983-12-22T18:29:00"), dayPillar: "甲申", dayBureau: 9, dayJishu: 11417480 } },
    1984: { summer: { date: new Date("1984-06-21T13:02:00"), dayPillar: "丙戌", dayBureau: 47, dayJishu: 11417662 }, winter: { date: new Date("1984-12-22T00:22:00"), dayPillar: "庚寅", dayBureau: 15, dayJishu: 11417846 } },
    1985: { summer: { date: new Date("1985-06-21T18:44:00"), dayPillar: "辛卯", dayBureau: 52, dayJishu: 11418027 }, winter: { date: new Date("1985-12-22T06:07:00"), dayPillar: "乙未", dayBureau: 20, dayJishu: 11418211 } },
    1986: { summer: { date: new Date("1986-06-22T00:29:00"), dayPillar: "丁酉", dayBureau: 58, dayJishu: 11418393 }, winter: { date: new Date("1986-12-22T12:02:00"), dayPillar: "庚子", dayBureau: 25, dayJishu: 11418576 } },
    1987: { summer: { date: new Date("1987-06-22T06:10:00"), dayPillar: "壬寅", dayBureau: 63, dayJishu: 11418758 }, winter: { date: new Date("1987-12-22T17:45:00"), dayPillar: "乙巳", dayBureau: 30, dayJishu: 11418941 } },
    1988: { summer: { date: new Date("1988-06-21T11:56:00"), dayPillar: "丁未", dayBureau: 68, dayJishu: 11419123 }, winter: { date: new Date("1988-12-21T23:27:00"), dayPillar: "庚戌", dayBureau: 35, dayJishu: 11419307 } },
    1989: { summer: { date: new Date("1989-06-21T17:53:00"), dayPillar: "壬子", dayBureau: 1, dayJishu: 11419488 }, winter: { date: new Date("1989-12-22T05:22:00"), dayPillar: "丙辰", dayBureau: 41, dayJishu: 11419672 } },
    1990: { summer: { date: new Date("1990-06-21T23:32:00"), dayPillar: "丁巳", dayBureau: 6, dayJishu: 11419853 }, winter: { date: new Date("1990-12-22T11:06:00"), dayPillar: "辛酉", dayBureau: 46, dayJishu: 11420037 } },
    1991: { summer: { date: new Date("1991-06-22T05:18:00"), dayPillar: "癸亥", dayBureau: 12, dayJishu: 11420219 }, winter: { date: new Date("1991-12-22T16:53:00"), dayPillar: "丙寅", dayBureau: 51, dayJishu: 11420402 } },
    1992: { summer: { date: new Date("1992-06-21T11:14:00"), dayPillar: "戊辰", dayBureau: 17, dayJishu: 11420584 }, winter: { date: new Date("1992-12-21T22:43:00"), dayPillar: "辛未", dayBureau: 56, dayJishu: 11420767 } },
    1993: { summer: { date: new Date("1993-06-21T16:59:00"), dayPillar: "癸酉", dayBureau: 22, dayJishu: 11420949 }, winter: { date: new Date("1993-12-22T04:25:00"), dayPillar: "丁丑", dayBureau: 62, dayJishu: 11421133 } },
    1994: { summer: { date: new Date("1994-06-21T22:47:00"), dayPillar: "戊寅", dayBureau: 27, dayJishu: 11421314 }, winter: { date: new Date("1994-12-22T10:22:00"), dayPillar: "壬午", dayBureau: 67, dayJishu: 11421498 } },
    1995: { summer: { date: new Date("1995-06-22T04:34:00"), dayPillar: "甲申", dayBureau: 33, dayJishu: 11421680 }, winter: { date: new Date("1995-12-22T16:16:00"), dayPillar: "丁亥", dayBureau: 72, dayJishu: 11421863 } },
    1996: { summer: { date: new Date("1996-06-21T10:23:00"), dayPillar: "己丑", dayBureau: 38, dayJishu: 11422045 }, winter: { date: new Date("1996-12-21T22:05:00"), dayPillar: "壬辰", dayBureau: 5, dayJishu: 11422228 } },
    1997: { summer: { date: new Date("1997-06-21T16:19:00"), dayPillar: "甲午", dayBureau: 43, dayJishu: 11422410 }, winter: { date: new Date("1997-12-22T04:07:00"), dayPillar: "戊戌", dayBureau: 11, dayJishu: 11422594 } },
    1998: { summer: { date: new Date("1998-06-21T22:02:00"), dayPillar: "己亥", dayBureau: 48, dayJishu: 11422775 }, winter: { date: new Date("1998-12-22T09:56:00"), dayPillar: "癸卯", dayBureau: 16, dayJishu: 11422959 } },
    1999: { summer: { date: new Date("1999-06-22T03:49:00"), dayPillar: "乙巳", dayBureau: 54, dayJishu: 11423141 }, winter: { date: new Date("1999-12-22T15:43:00"), dayPillar: "戊申", dayBureau: 21, dayJishu: 11423324 } },
    2000: { summer: { date: new Date("2000-06-21T09:47:00"), dayPillar: "庚戌", dayBureau: 59, dayJishu: 11423506 }, winter: { date: new Date("2000-12-21T21:37:00"), dayPillar: "癸丑", dayBureau: 26, dayJishu: 11423689 } },
    2001: { summer: { date: new Date("2001-06-21T15:37:00"), dayPillar: "乙卯", dayBureau: 64, dayJishu: 11423871 }, winter: { date: new Date("2001-12-22T03:21:00"), dayPillar: "己未", dayBureau: 32, dayJishu: 11424055 } },
    2002: { summer: { date: new Date("2002-06-21T21:24:00"), dayPillar: "庚申", dayBureau: 69, dayJishu: 11424236 }, winter: { date: new Date("2002-12-22T09:14:00"), dayPillar: "甲子", dayBureau: 37, dayJishu: 11424420 } },
    2003: { summer: { date: new Date("2003-06-22T03:10:00"), dayPillar: "丙寅", dayBureau: 3, dayJishu: 11424602 }, winter: { date: new Date("2003-12-22T15:03:00"), dayPillar: "己巳", dayBureau: 42, dayJishu: 11424785 } },
    2004: { summer: { date: new Date("2004-06-21T08:56:00"), dayPillar: "辛未", dayBureau: 8, dayJishu: 11424967 }, winter: { date: new Date("2004-12-21T20:41:00"), dayPillar: "甲戌", dayBureau: 47, dayJishu: 11425150 } },
    2005: { summer: { date: new Date("2005-06-21T14:46:00"), dayPillar: "丙子", dayBureau: 13, dayJishu: 11425332 }, winter: { date: new Date("2005-12-22T02:34:00"), dayPillar: "庚辰", dayBureau: 53, dayJishu: 11425516 } },
    2006: { summer: { date: new Date("2006-06-21T20:25:00"), dayPillar: "辛巳", dayBureau: 18, dayJishu: 11425697 }, winter: { date: new Date("2006-12-22T08:22:00"), dayPillar: "乙酉", dayBureau: 58, dayJishu: 11425881 } },
    2007: { summer: { date: new Date("2007-06-22T02:06:00"), dayPillar: "丁亥", dayBureau: 24, dayJishu: 11426063 }, winter: { date: new Date("2007-12-22T14:07:00"), dayPillar: "庚寅", dayBureau: 63, dayJishu: 11426246 } },
    2008: { summer: { date: new Date("2008-06-21T07:59:00"), dayPillar: "壬辰", dayBureau: 29, dayJishu: 11426428 }, winter: { date: new Date("2008-12-21T20:03:00"), dayPillar: "乙未", dayBureau: 68, dayJishu: 11426611 } },
    2009: { summer: { date: new Date("2009-06-21T13:45:00"), dayPillar: "丁酉", dayBureau: 34, dayJishu: 11426793 }, winter: { date: new Date("2009-12-22T01:46:00"), dayPillar: "辛丑", dayBureau: 2, dayJishu: 11426977 } },
    2010: { summer: { date: new Date("2010-06-21T19:28:00"), dayPillar: "壬寅", dayBureau: 39, dayJishu: 11427158 }, winter: { date: new Date("2010-12-22T07:38:00"), dayPillar: "丙午", dayBureau: 7, dayJishu: 11427342 } },
    2011: { summer: { date: new Date("2011-06-22T01:16:00"), dayPillar: "戊申", dayBureau: 45, dayJishu: 11427524 }, winter: { date: new Date("2011-12-22T13:30:00"), dayPillar: "辛亥", dayBureau: 12, dayJishu: 11427707 } },
    2012: { summer: { date: new Date("2012-06-21T07:08:00"), dayPillar: "癸丑", dayBureau: 50, dayJishu: 11427889 }, winter: { date: new Date("2012-12-21T19:11:00"), dayPillar: "丙辰", dayBureau: 17, dayJishu: 11428072 } },
    2013: { summer: { date: new Date("2013-06-21T13:03:00"), dayPillar: "戊午", dayBureau: 55, dayJishu: 11428254 }, winter: { date: new Date("2013-12-22T01:10:00"), dayPillar: "壬戌", dayBureau: 23, dayJishu: 11428438 } },
    2014: { summer: { date: new Date("2014-06-21T18:51:00"), dayPillar: "癸亥", dayBureau: 60, dayJishu: 11428619 }, winter: { date: new Date("2014-12-22T07:02:00"), dayPillar: "丁卯", dayBureau: 28, dayJishu: 11428803 } },
    2015: { summer: { date: new Date("2015-06-22T00:37:00"), dayPillar: "己巳", dayBureau: 66, dayJishu: 11428985 }, winter: { date: new Date("2015-12-22T12:47:00"), dayPillar: "壬申", dayBureau: 33, dayJishu: 11429168 } },
    2016: { summer: { date: new Date("2016-06-21T06:34:00"), dayPillar: "甲戌", dayBureau: 71, dayJishu: 11429350 }, winter: { date: new Date("2016-12-21T18:44:00"), dayPillar: "丁丑", dayBureau: 38, dayJishu: 11429533 } },
    2017: { summer: { date: new Date("2017-06-21T12:24:00"), dayPillar: "己卯", dayBureau: 4, dayJishu: 11429715 }, winter: { date: new Date("2017-12-22T00:27:00"), dayPillar: "癸未", dayBureau: 44, dayJishu: 11429899 } },
    2018: { summer: { date: new Date("2018-06-21T18:07:00"), dayPillar: "甲申", dayBureau: 9, dayJishu: 11430080 }, winter: { date: new Date("2018-12-22T06:22:00"), dayPillar: "戊子", dayBureau: 49, dayJishu: 11430264 } },
    2019: { summer: { date: new Date("2019-06-21T23:54:00"), dayPillar: "己丑", dayBureau: 14, dayJishu: 11430445 }, winter: { date: new Date("2019-12-22T12:19:00"), dayPillar: "癸巳", dayBureau: 54, dayJishu: 11430629 } },
    2020: { summer: { date: new Date("2020-06-21T05:43:00"), dayPillar: "乙未", dayBureau: 20, dayJishu: 11430811 }, winter: { date: new Date("2020-12-21T18:02:00"), dayPillar: "戊戌", dayBureau: 59, dayJishu: 11430994 } },
    2021: { summer: { date: new Date("2021-06-21T11:31:00"), dayPillar: "庚子", dayBureau: 25, dayJishu: 11431176 }, winter: { date: new Date("2021-12-21T23:59:00"), dayPillar: "癸卯", dayBureau: 65, dayJishu: 11431360 } },
    2022: { summer: { date: new Date("2022-06-21T17:13:00"), dayPillar: "乙巳", dayBureau: 30, dayJishu: 11431541 }, winter: { date: new Date("2022-12-22T05:48:00"), dayPillar: "己酉", dayBureau: 70, dayJishu: 11431725 } },
    2023: { summer: { date: new Date("2023-06-21T22:57:00"), dayPillar: "庚戌", dayBureau: 35, dayJishu: 11431906 }, winter: { date: new Date("2023-12-22T11:27:00"), dayPillar: "甲寅", dayBureau: 3, dayJishu: 11432090 } },
    2024: { summer: { date: new Date("2024-06-21T04:50:00"), dayPillar: "丙辰", dayBureau: 41, dayJishu: 11432272 }, winter: { date: new Date("2024-12-21T17:20:00"), dayPillar: "己未", dayBureau: 8, dayJishu: 11432455 } },
    2025: { summer: { date: new Date("2025-06-21T10:41:00"), dayPillar: "辛酉", dayBureau: 46, dayJishu: 11432637 }, winter: { date: new Date("2025-12-21T23:02:00"), dayPillar: "甲子", dayBureau: 13, dayJishu: 11432820 } },
    2026: { summer: { date: new Date("2026-06-21T16:24:00"), dayPillar: "丙寅", dayBureau: 51, dayJishu: 11433002 }, winter: { date: new Date("2026-12-22T04:49:00"), dayPillar: "庚午", dayBureau: 19, dayJishu: 11433186 } },
    2027: { summer: { date: new Date("2027-06-21T22:10:00"), dayPillar: "辛未", dayBureau: 56, dayJishu: 11433367 }, winter: { date: new Date("2027-12-22T10:41:00"), dayPillar: "乙亥", dayBureau: 24, dayJishu: 11433551 } },
    2028: { summer: { date: new Date("2028-06-21T04:01:00"), dayPillar: "丁丑", dayBureau: 62, dayJishu: 11433733 }, winter: { date: new Date("2028-12-21T16:19:00"), dayPillar: "庚辰", dayBureau: 29, dayJishu: 11433916 } },
    2029: { summer: { date: new Date("2029-06-21T09:47:00"), dayPillar: "壬午", dayBureau: 67, dayJishu: 11434098 }, winter: { date: new Date("2029-12-21T22:13:00"), dayPillar: "乙酉", dayBureau: 34, dayJishu: 11434281 } },
    2030: { summer: { date: new Date("2030-06-21T15:30:00"), dayPillar: "丁亥", dayBureau: 72, dayJishu: 11434463 }, winter: { date: new Date("2030-12-22T04:09:00"), dayPillar: "辛卯", dayBureau: 40, dayJishu: 11434647 } }
    };

    // ▼▼▼ 144局的完整資料庫 (已新增「定目」) ▼▼▼
    const BUREAU_DATA = [
    {"局":"陽1局","太乙":"乾","文昌":"申","始擊":"坤","定目":"坤","主算":7,"客算":13,"定算":13},
    {"局":"陽2局","太乙":"乾","文昌":"酉","始擊":"戌","定目":"戌","主算":6,"客算":1,"定算":1},
    {"局":"陽3局","太乙":"乾","文昌":"戌","始擊":"亥","定目":"丑","主算":1,"客算":40,"定算":32},
    {"局":"陽4局","太乙":"午","文昌":"乾","始擊":"丑","定目":"辰","主算":25,"客算":17,"定算":10},
    {"局":"陽5局","太乙":"午","文昌":"乾","始擊":"寅","定目":"巳","主算":25,"客算":14,"定算":1},
    {"局":"陽6局","太乙":"午","文昌":"亥","始擊":"辰","定目":"申","主算":25,"客算":10,"定算":32},
    {"局":"陽7局","太乙":"艮","文昌":"子","始擊":"巳","定目":"亥","主算":8,"客算":25,"定算":9},
    {"局":"陽8局","太乙":"艮","文昌":"丑","始擊":"坤","定目":"艮","主算":1,"客算":22,"定算":3},
    {"局":"陽9局","太乙":"艮","文昌":"艮","始擊":"酉","定目":"巽","主算":3,"客算":15,"定算":33},
    {"局":"陽10局","太乙":"卯","文昌":"寅","始擊":"乾","定目":"坤","主算":1,"客算":12,"定算":25},
    {"局":"陽11局","太乙":"卯","文昌":"卯","始擊":"丑","定目":"戌","主算":4,"客算":4,"定算":13},
    {"局":"陽12局","太乙":"卯","文昌":"辰","始擊":"寅","定目":"丑","主算":37,"客算":1,"定算":4},
    {"局":"陽13局","太乙":"酉","文昌":"巽","始擊":"辰","定目":"辰","主算":18,"客算":19,"定算":19},
    {"局":"陽14局","太乙":"酉","文昌":"巳","始擊":"午","定目":"午","主算":10,"客算":9,"定算":9},
    {"局":"陽15局","太乙":"酉","文昌":"午","始擊":"坤","定目":"酉","主算":9,"客算":7,"定算":6},
    {"局":"陽16局","太乙":"坤","文昌":"未","始擊":"酉","定目":"子","主算":1,"客算":33,"定算":26},
    {"局":"陽17局","太乙":"坤","文昌":"坤","始擊":"亥","定目":"寅","主算":7,"客算":27,"定算":16},
    {"局":"陽18局","太乙":"坤","文昌":"坤","始擊":"子","定目":"巽","主算":7,"客算":26,"定算":11},
    {"局":"陽19局","太乙":"子","文昌":"申","始擊":"艮","定目":"坤","主算":8,"客算":32,"定算":14},
    {"局":"陽20局","太乙":"子","文昌":"酉","始擊":"辰","定目":"戌","主算":7,"客算":26,"定算":2},
    {"局":"陽21局","太乙":"子","文昌":"戌","始擊":"巳","定目":"丑","主算":2,"客算":17,"定算":33},
    {"局":"陽22局","太乙":"巽","文昌":"乾","始擊":"未","定目":"辰","主算":16,"客算":30,"定算":1},
    {"局":"陽23局","太乙":"巽","文昌":"乾","始擊":"申","定目":"巳","主算":16,"客算":23,"定算":32},
    {"局":"陽24局","太乙":"巽","文昌":"亥","始擊":"戌","定目":"申","主算":16,"客算":17,"定算":23},
    {"局":"陽25局","太乙":"乾","文昌":"子","始擊":"亥","定目":"亥","主算":39,"客算":40,"定算":40},
    {"局":"陽26局","太乙":"乾","文昌":"丑","始擊":"艮","定目":"艮","主算":32,"客算":31,"定算":31},
    {"局":"陽27局","太乙":"乾","文昌":"艮","始擊":"卯","定目":"巽","主算":31,"客算":28,"定算":24},
    {"局":"陽28局","太乙":"午","文昌":"寅","始擊":"巽","定目":"坤","主算":14,"客算":9,"定算":38},
    {"局":"陽29局","太乙":"午","文昌":"卯","始擊":"未","定目":"戌","主算":13,"客算":39,"定算":26},
    {"局":"陽30局","太乙":"午","文昌":"辰","始擊":"申","定目":"丑","主算":10,"客算":32,"定算":17},
    {"局":"陽31局","太乙":"艮","文昌":"巽","始擊":"戌","定目":"辰","主算":33,"客算":10,"定算":34},
    {"局":"陽32局","太乙":"艮","文昌":"巳","始擊":"子","定目":"午","主算":25,"客算":8,"定算":24},
    {"局":"陽33局","太乙":"艮","文昌":"午","始擊":"艮","定目":"酉","主算":24,"客算":3,"定算":15},
    {"局":"陽34局","太乙":"卯","文昌":"未","始擊":"卯","定目":"子","主算":26,"客算":4,"定算":11},
    {"局":"陽35局","太乙":"卯","文昌":"坤","始擊":"巳","定目":"寅","主算":25,"客算":28,"定算":1},
    {"局":"陽36局","太乙":"卯","文昌":"坤","始擊":"午","定目":"巽","主算":25,"客算":27,"定算":36},
    {"局":"陽37局","太乙":"酉","文昌":"申","始擊":"坤","定目":"坤","主算":1,"客算":7,"定算":7},
    {"局":"陽38局","太乙":"酉","文昌":"酉","始擊":"戌","定目":"戌","主算":6,"客算":35,"定算":35},
    {"局":"陽39局","太乙":"酉","文昌":"戌","始擊":"亥","定目":"丑","主算":35,"客算":34,"定算":26},
    {"局":"陽40局","太乙":"坤","文昌":"乾","始擊":"丑","定目":"辰","主算":27,"客算":19,"定算":12},
    {"局":"陽41局","太乙":"坤","文昌":"乾","始擊":"寅","定目":"巳","主算":27,"客算":16,"定算":3},
    {"局":"陽42局","太乙":"坤","文昌":"亥","始擊":"辰","定目":"申","主算":27,"客算":12,"定算":34},
    {"局":"陽43局","太乙":"子","文昌":"子","始擊":"巳","定目":"亥","主算":8,"客算":17,"定算":1},
    {"局":"陽44局","太乙":"子","文昌":"丑","始擊":"坤","定目":"艮","主算":33,"客算":14,"定算":32},
    {"局":"陽45局","太乙":"子","文昌":"艮","始擊":"酉","定目":"巽","主算":32,"客算":7,"定算":25},
    {"局":"陽46局","太乙":"巽","文昌":"寅","始擊":"乾","定目":"坤","主算":5,"客算":16,"定算":29},
    {"局":"陽47局","太乙":"巽","文昌":"卯","始擊":"丑","定目":"戌","主算":4,"客算":8,"定算":17},
    {"局":"陽48局","太乙":"巽","文昌":"辰","始擊":"寅","定目":"丑","主算":1,"客算":5,"定算":8},
    {"局":"陽49局","太乙":"乾","文昌":"巽","始擊":"辰","定目":"辰","主算":24,"客算":25,"定算":25},
    {"局":"陽50局","太乙":"乾","文昌":"巳","始擊":"午","定目":"午","主算":16,"客算":15,"定算":15},
    {"局":"陽51局","太乙":"乾","文昌":"午","始擊":"坤","定目":"酉","主算":15,"客算":13,"定算":6},
    {"局":"陽52局","太乙":"午","文昌":"未","始擊":"酉","定目":"子","主算":39,"客算":31,"定算":24},
    {"局":"陽53局","太乙":"午","文昌":"坤","始擊":"亥","定目":"寅","主算":38,"客算":25,"定算":14},
    {"局":"陽54局","太乙":"午","文昌":"坤","始擊":"子","定目":"巽","主算":38,"客算":24,"定算":9},
    {"局":"陽55局","太乙":"艮","文昌":"申","始擊":"艮","定目":"坤","主算":16,"客算":3,"定算":22},
    {"局":"陽56局","太乙":"艮","文昌":"酉","始擊":"辰","定目":"戌","主算":15,"客算":34,"定算":10},
    {"局":"陽57局","太乙":"艮","文昌":"戌","始擊":"巳","定目":"丑","主算":10,"客算":25,"定算":1},
    {"局":"陽58局","太乙":"卯","文昌":"乾","始擊":"未","定目":"辰","主算":12,"客算":26,"定算":37},
    {"局":"陽59局","太乙":"卯","文昌":"乾","始擊":"申","定目":"巳","主算":12,"客算":19,"定算":28},
    {"局":"陽60局","太乙":"卯","文昌":"亥","始擊":"戌","定目":"申","主算":12,"客算":13,"定算":19},
    {"局":"陽61局","太乙":"酉","文昌":"子","始擊":"亥","定目":"亥","主算":33,"客算":34,"定算":34},
    {"局":"陽62局","太乙":"酉","文昌":"丑","始擊":"艮","定目":"艮","主算":26,"客算":25,"定算":25},
    {"局":"陽63局","太乙":"酉","文昌":"艮","始擊":"卯","定目":"巽","主算":25,"客算":22,"定算":18},
    {"局":"陽64局","太乙":"坤","文昌":"寅","始擊":"巽","定目":"坤","主算":16,"客算":11,"定算":7},
    {"局":"陽65局","太乙":"坤","文昌":"卯","始擊":"未","定目":"戌","主算":15,"客算":1,"定算":28},
    {"局":"陽66局","太乙":"坤","文昌":"辰","始擊":"申","定目":"丑","主算":12,"客算":34,"定算":19},
    {"局":"陽67局","太乙":"子","文昌":"巽","始擊":"戌","定目":"辰","主算":25,"客算":2,"定算":26},
    {"局":"陽68局","太乙":"子","文昌":"巳","始擊":"子","定目":"午","主算":17,"客算":8,"定算":16},
    {"局":"陽69局","太乙":"子","文昌":"午","始擊":"艮","定目":"酉","主算":16,"客算":32,"定算":7},
    {"局":"陽70局","太乙":"巽","文昌":"未","始擊":"卯","定目":"子","主算":30,"客算":4,"定算":15},
    {"局":"陽71局","太乙":"巽","文昌":"坤","始擊":"巳","定目":"寅","主算":29,"客算":32,"定算":5},
    {"局":"陽72局","太乙":"巽","文昌":"坤","始擊":"午","定目":"巽","主算":29,"客算":31,"定算":9},
    {"局":"陰1局","太乙":"巽","文昌":"寅","始擊":"坤","定目":"艮","主算":5,"客算":29,"定算":7},
    {"局":"陰2局","太乙":"巽","文昌":"卯","始擊":"戌","定目":"辰","主算":4,"客算":17,"定算":1},
    {"局":"陰3局","太乙":"巽","文昌":"辰","始擊":"亥","定目":"未","主算":1,"客算":16,"定算":30},
    {"局":"陰4局","太乙":"子","文昌":"巽","始擊":"丑","定目":"戌","主算":25,"客算":33,"定算":2},
    {"局":"陰5局","太乙":"子","文昌":"巽","始擊":"寅","定目":"亥","主算":25,"客算":30,"定算":1},
    {"局":"陰6局","太乙":"子","文昌":"巳","始擊":"辰","定目":"寅","主算":17,"客算":26,"定算":30},
    {"局":"陰7局","太乙":"坤","文昌":"午","始擊":"巳","定目":"巳","主算":2,"客算":3,"定算":3},
    {"局":"陰8局","太乙":"坤","文昌":"未","始擊":"坤","定目":"坤","主算":1,"客算":7,"定算":7},
    {"局":"陰9局","太乙":"坤","文昌":"坤","始擊":"酉","定目":"乾","主算":7,"客算":33,"定算":27},
    {"局":"陰10局","太乙":"酉","文昌":"申","始擊":"乾","定目":"艮","主算":1,"客算":34,"定算":25},
    {"局":"陰11局","太乙":"酉","文昌":"酉","始擊":"丑","定目":"辰","主算":6,"客算":26,"定算":19},
    {"局":"陰12局","太乙":"酉","文昌":"戌","始擊":"寅","定目":"未","主算":35,"客算":23,"定算":8},
    {"局":"陰13局","太乙":"卯","文昌":"乾","始擊":"辰","定目":"戌","主算":12,"客算":37,"定算":13},
    {"局":"陰14局","太乙":"卯","文昌":"亥","始擊":"午","定目":"子","主算":12,"客算":27,"定算":11},
    {"局":"陰15局","太乙":"卯","文昌":"子","始擊":"坤","定目":"卯","主算":11,"客算":25,"定算":4},
    {"局":"陰16局","太乙":"艮","文昌":"丑","始擊":"酉","定目":"午","主算":1,"客算":15,"定算":24},
    {"局":"陰17局","太乙":"艮","文昌":"艮","始擊":"亥","定目":"申","主算":3,"客算":9,"定算":16},
    {"局":"陰18局","太乙":"艮","文昌":"艮","始擊":"子","定目":"乾","主算":3,"客算":8,"定算":9},
    {"局":"陰19局","太乙":"午","文昌":"寅","始擊":"艮","定目":"艮","主算":14,"客算":16,"定算":16},
    {"局":"陰20局","太乙":"午","文昌":"卯","始擊":"辰","定目":"辰","主算":13,"客算":10,"定算":10},
    {"局":"陰21局","太乙":"午","文昌":"辰","始擊":"巳","定目":"未","主算":10,"客算":1,"定算":39},
    {"局":"陰22局","太乙":"乾","文昌":"巽","始擊":"未","定目":"戌","主算":24,"客算":14,"定算":1},
    {"局":"陰23局","太乙":"乾","文昌":"巽","始擊":"申","定目":"亥","主算":24,"客算":7,"定算":40},
    {"局":"陰24局","太乙":"乾","文昌":"巳","始擊":"戌","定目":"寅","主算":16,"客算":1,"定算":29},
    {"局":"陰25局","太乙":"巽","文昌":"午","始擊":"亥","定目":"巳","主算":31,"客算":16,"定算":32},
    {"局":"陰26局","太乙":"巽","文昌":"未","始擊":"艮","定目":"坤","主算":30,"客算":7,"定算":29},
    {"局":"陰27局","太乙":"巽","文昌":"坤","始擊":"卯","定目":"乾","主算":29,"客算":4,"定算":16},
    {"局":"陰28局","太乙":"子","文昌":"申","始擊":"巽","定目":"艮","主算":8,"客算":25,"定算":32},
    {"局":"陰29局","太乙":"子","文昌":"酉","始擊":"未","定目":"辰","主算":7,"客算":15,"定算":26},
    {"局":"陰30局","太乙":"子","文昌":"戌","始擊":"申","定目":"未","主算":2,"客算":8,"定算":15},
    {"局":"陰31局","太乙":"坤","文昌":"乾","始擊":"戌","定目":"戌","主算":27,"客算":28,"定算":28},
    {"局":"陰32局","太乙":"坤","文昌":"亥","始擊":"子","定目":"子","主算":27,"客算":26,"定算":26},
    {"局":"陰33局","太乙":"坤","文昌":"子","始擊":"艮","定目":"卯","主算":26,"客算":18,"定算":15},
    {"局":"陰34局","太乙":"酉","文昌":"丑","始擊":"卯","定目":"午","主算":26,"客算":22,"定算":9},
    {"局":"陰35局","太乙":"酉","文昌":"艮","始擊":"巳","定目":"申","主算":25,"客算":10,"定算":1},
    {"局":"陰36局","太乙":"酉","文昌":"艮","始擊":"午","定目":"乾","主算":25,"客算":9,"定算":34},
    {"局":"陰37局","太乙":"卯","文昌":"寅","始擊":"坤","定目":"艮","主算":1,"客算":25,"定算":3},
    {"局":"陰38局","太乙":"卯","文昌":"卯","始擊":"戌","定目":"辰","主算":4,"客算":13,"定算":37},
    {"局":"陰39局","太乙":"卯","文昌":"辰","始擊":"亥","定目":"未","主算":37,"客算":12,"定算":26},
    {"局":"陰40局","太乙":"艮","文昌":"巽","始擊":"丑","定目":"戌","主算":33,"客算":1,"定算":10},
    {"局":"陰41局","太乙":"艮","文昌":"巽","始擊":"寅","定目":"亥","主算":33,"客算":38,"定算":9},
    {"局":"陰42局","太乙":"艮","文昌":"巳","始擊":"辰","定目":"寅","主算":25,"客算":34,"定算":38},
    {"局":"陰43局","太乙":"午","文昌":"午","始擊":"巳","定目":"巳","主算":2,"客算":1,"定算":1},
    {"局":"陰44局","太乙":"午","文昌":"未","始擊":"坤","定目":"坤","主算":39,"客算":38,"定算":38},
    {"局":"陰45局","太乙":"午","文昌":"坤","始擊":"酉","定目":"乾","主算":38,"客算":31,"定算":25},
    {"局":"陰46局","太乙":"乾","文昌":"申","始擊":"乾","定目":"艮","主算":7,"客算":1,"定算":31},
    {"局":"陰47局","太乙":"乾","文昌":"酉","始擊":"丑","定目":"辰","主算":6,"客算":32,"定算":25},
    {"局":"陰48局","太乙":"乾","文昌":"戌","始擊":"寅","定目":"未","主算":1,"客算":29,"定算":14},
    {"局":"陰49局","太乙":"巽","文昌":"乾","始擊":"辰","定目":"戌","主算":16,"客算":1,"定算":17},
    {"局":"陰50局","太乙":"巽","文昌":"亥","始擊":"午","定目":"子","主算":16,"客算":31,"定算":15},
    {"局":"陰51局","太乙":"巽","文昌":"子","始擊":"坤","定目":"卯","主算":15,"客算":29,"定算":4},
    {"局":"陰52局","太乙":"子","文昌":"丑","始擊":"酉","定目":"午","主算":33,"客算":7,"定算":16},
    {"局":"陰53局","太乙":"子","文昌":"艮","始擊":"亥","定目":"申","主算":32,"客算":1,"定算":8},
    {"局":"陰54局","太乙":"子","文昌":"艮","始擊":"子","定目":"乾","主算":32,"客算":8,"定算":1},
    {"局":"陰55局","太乙":"坤","文昌":"寅","始擊":"艮","定目":"艮","主算":16,"客算":18,"定算":18},
    {"局":"陰56局","太乙":"坤","文昌":"卯","始擊":"辰","定目":"辰","主算":15,"客算":12,"定算":12},
    {"局":"陰57局","太乙":"坤","文昌":"辰","始擊":"巳","定目":"未","主算":12,"客算":3,"定算":1},
    {"局":"陰58局","太乙":"酉","文昌":"巽","始擊":"未","定目":"戌","主算":18,"客算":8,"定算":35},
    {"局":"陰59局","太乙":"酉","文昌":"巽","始擊":"申","定目":"亥","主算":18,"客算":1,"定算":34},
    {"局":"陰60局","太乙":"酉","文昌":"巳","始擊":"戌","定目":"寅","主算":10,"客算":35,"定算":23},
    {"局":"陰61局","太乙":"卯","文昌":"午","始擊":"亥","定目":"巳","主算":27,"客算":12,"定算":28},
    {"局":"陰62局","太乙":"卯","文昌":"未","始擊":"艮","定目":"坤","主算":26,"客算":3,"定算":25},
    {"局":"陰63局","太乙":"卯","文昌":"坤","始擊":"卯","定目":"乾","主算":25,"客算":4,"定算":12},
    {"局":"陰64局","太乙":"艮","文昌":"申","始擊":"巽","定目":"艮","主算":16,"客算":33,"定算":3},
    {"局":"陰65局","太乙":"艮","文昌":"酉","始擊":"未","定目":"辰","主算":15,"客算":23,"定算":34},
    {"局":"陰66局","太乙":"艮","文昌":"戌","始擊":"申","定目":"未","主算":10,"客算":16,"定算":23},
    {"局":"陰67局","太乙":"午","文昌":"乾","始擊":"戌","定目":"戌","主算":25,"客算":26,"定算":26},
    {"局":"陰68局","太乙":"午","文昌":"亥","始擊":"子","定目":"子","主算":25,"客算":24,"定算":24},
    {"局":"陰69局","太乙":"午","文昌":"子","始擊":"艮","定目":"卯","主算":24,"客算":16,"定算":13},
    {"局":"陰70局","太乙":"乾","文昌":"丑","始擊":"卯","定目":"午","主算":32,"客算":28,"定算":15},
    {"局":"陰71局","太乙":"乾","文昌":"艮","始擊":"巳","定目":"申","主算":31,"客算":16,"定算":7},
    {"局":"陰72局","太乙":"乾","文昌":"艮","始擊":"午","定目":"乾","主算":31,"客算":15,"定算":1}
    ]

    // ▼▼▼ 六十甲子標準順序 ▼▼▼
    const JIAZI_CYCLE_ORDER = [
    '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
    '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
    '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
    '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
    '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
    '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
    ];

    // ▼▼▼ 六十甲子天地生成數 ▼▼▼
    const GANZI_GENERATION_NUMBERS = {
    '甲子': 31, '甲戌': 35, '甲申': 31, '甲午': 33, '甲辰': 35, '甲寅': 29,
    '乙丑': 39, '乙亥': 27, '乙酉': 31, '乙未': 39, '乙巳': 29, '乙卯': 29,
    '丙寅': 29, '丙子': 23, '丙戌': 39, '丙申': 31, '丙午': 25, '丙辰': 39,
    '丁卯': 29, '丁丑': 31, '丁亥': 31, '丁酉': 31, '丁未': 31, '丁巳': 33,
    '戊辰': 41, '戊寅': 41, '戊子': 31, '戊戌': 41, '戊申': 43, '戊午': 33,
    '己巳': 35, '己卯': 41, '己丑': 39, '己亥': 33, '己酉': 43, '己未': 39,
    '庚午': 37, '庚辰': 41, '庚寅': 35, '庚子': 35, '庚戌': 41, '庚申': 37,
    '辛未': 43, '辛巳': 35, '辛卯': 35, '辛丑': 43, '辛亥': 33, '辛酉': 37,
    '壬申': 33, '壬午': 27, '壬辰': 29, '壬寅': 31, '壬子': 25, '壬戌': 29,
    '癸酉': 33, '癸未': 33, '癸巳': 23, '癸卯': 31, '癸丑': 33, '癸亥': 21
    };

    // ▼▼▼ 易經六十四卦資料庫 (已升級卦象描述) ▼▼▼
    const I_CHING_HEXAGRAMS = [
    { number: 1,  name: '乾為天',    symbol: '䷀', description: '創造與進取，剛健自強。廣大包容之象' },
    { number: 2,  name: '坤為地',    symbol: '䷁', description: '包容承載，順應萬物。君倡臣和之象' },
    { number: 3,  name: '水雷屯',    symbol: '䷂', description: '萬事起頭難，困境中成長。萬物如生之象' },
    { number: 4,  name: '山水蒙',    symbol: '䷃', description: '蒙昧未明，需啟蒙學習。萬物發生之象' },
    { number: 5,  name: '水天需',    symbol: '䷄', description: '蓄勢待時，耐心等待。密雲不雨之象' },
    { number: 6,  name: '天水訟',    symbol: '䷅', description: '爭訟不利，慎防爭端。天水相違之象' },
    { number: 7,  name: '地水師',    symbol: '䷆', description: '師眾齊心，領導用兵。以寡服眾之象' },
    { number: 8,  name: '水地比',    symbol: '䷇', description: '親比合群，團隊合作。水行地上之象' },
    { number: 9,  name: '風天小畜',  symbol: '䷈', description: '小有積蓄，漸進不躁。密雲不雨之象' },
    { number: 10, name: '天澤履',    symbol: '䷉', description: '謹慎前行，腳踏實地。安中防危之象' },
    { number: 11, name: '地天泰',    symbol: '䷊', description: '天地交泰，和諧亨通。小往大來之象' },
    { number: 12, name: '天地否',    symbol: '䷋', description: '陰陽不交，閉塞不通。人口不實之象' },
    { number: 13, name: '天火同人',  symbol: '䷌', description: '志同道合，共同合作。二人分金之象' },
    { number: 14, name: '火天大有',  symbol: '䷍', description: '富有充實，光明順遂。日麗中天之象' },
    { number: 15, name: '地山謙',    symbol: '䷎', description: '謙遜處世，以退為進。仰高就下之象' },
    { number: 16, name: '雷地豫',    symbol: '䷏', description: '喜樂和順，居安思危。萬物發生之象' },
    { number: 17, name: '澤雷隨',    symbol: '䷐', description: '隨順時勢，靈活應變。如水推車之象' },
    { number: 18, name: '山風蠱',    symbol: '䷑', description: '整頓腐敗，革故鼎新。以惡害義之象' },
    { number: 19, name: '地澤臨',    symbol: '䷒', description: '君子臨下，教化眾人。以上臨下之象' },
    { number: 20, name: '風地觀',    symbol: '䷓', description: '觀察省思，以德感人。春花競發之象' },
    { number: 21, name: '火雷噬嗑',  symbol: '䷔', description: '以剛破險，懲惡揚善。順中有物之象' },
    { number: 22, name: '山火賁',    symbol: '䷕', description: '文飾外表，內守真實。光明通泰之象' },
    { number: 23, name: '山地剝',    symbol: '䷖', description: '否極泰來，萬物剝落。去舊生新之象' },
    { number: 24, name: '地雷復',    symbol: '䷗', description: '失而復得，循環更新。反復往來之象' },
    { number: 25, name: '天雷无妄',  symbol: '䷘', description: '順應自然，真誠無妄。守舊安常之象' },
    { number: 26, name: '山天大畜',  symbol: '䷙', description: '積蓄能量，以待時機。積小成大之象' },
    { number: 27, name: '山雷頤',    symbol: '䷚', description: '養生之道，修身養性。遷善遠惡之象' },
    { number: 28, name: '澤風大過',  symbol: '䷛', description: '陰陽失衡，承重過大。本末俱弱之象' },
    { number: 29, name: '坎為水',    symbol: '䷜', description: '重險之境，反覆考驗。外虛中實之象' },
    { number: 30, name: '離為火',    symbol: '䷝', description: '光明照耀，文明進取。大明當天之象' },
    { number: 31, name: '澤山咸',    symbol: '䷞', description: '以感化人，兩情相悅。至誠感神之象' },
    { number: 32, name: '雷風恆',    symbol: '䷟', description: '恆久不變，堅守正道。四時不沒之象' },
    { number: 33, name: '天山遯',    symbol: '䷠', description: '避險退隱，明哲保身。守道去惡之象' },
    { number: 34, name: '雷天大壯',  symbol: '䷡', description: '剛健壯盛，須防妄動。先曲後順之象' },
    { number: 35, name: '火地晉',    symbol: '䷢', description: '進取向上，光明前途。以臣遇君之象' },
    { number: 36, name: '地火明夷',  symbol: '䷣', description: '智者避世，光明受傷。出明入暗之象' },
    { number: 37, name: '風火家人',  symbol: '䷤', description: '齊家之道，內外有序。開花結子之象' },
    { number: 38, name: '火澤睽',    symbol: '䷥', description: '分歧矛盾，異中求同。猛虎陷阱之象' },
    { number: 39, name: '水山蹇',    symbol: '䷦', description: '艱難困阻，謹慎前行。背明向暗之象' },
    { number: 40, name: '雷水解',    symbol: '䷧', description: '困境化解，解難得助。患難解散之象' },
    { number: 41, name: '山澤損',    symbol: '䷨', description: '減損有益，損中有得。鑿石見玉之象' },
    { number: 42, name: '風雷益',    symbol: '䷩', description: '損上益下，積善得福。河水溢出之象' },
    { number: 43, name: '澤天夬',    symbol: '䷪', description: '果決斷行，剛健能和。先損後益之象' },
    { number: 44, name: '天風姤',    symbol: '䷫', description: '陽遇陰，偶然相逢。或聚或散之象' },
    { number: 45, name: '澤地萃',    symbol: '䷬', description: '萃聚人心，群體團結。魚龍會聚之象' },
    { number: 46, name: '地風升',    symbol: '䷭', description: '節節高升，漸進發展。積小成大之象' },
    { number: 47, name: '澤水困',    symbol: '䷮', description: '陷入困境，內心堅忍。守己待時之象' },
    { number: 48, name: '水風井',    symbol: '䷯', description: '取之不竭，資源共享。守靜安常之象' },
    { number: 49, name: '澤火革',    symbol: '䷰', description: '革新變革，順應時代。改舊從新之象' },
    { number: 50, name: '火風鼎',    symbol: '䷱', description: '鼎新立業，革故鼎新。去故取新之象' },
    { number: 51, name: '震為雷',    symbol: '䷲', description: '動盪驚雷，警醒人心。震驚百里之象' },
    { number: 52, name: '艮為山',    symbol: '䷳', description: '靜止止步，內心安定。積小成高之象' },
    { number: 53, name: '風山漸',    symbol: '䷴', description: '漸進之道，循序漸進。積小成大之象' },
    { number: 54, name: '雷澤歸妹',  symbol: '䷵', description: '婚姻成家，社會秩序。陰陽不交之象' },
    { number: 55, name: '雷火豐',    symbol: '䷶', description: '豐盛繁榮，需防盈滿。藏暗向明之象' },
    { number: 56, name: '火山旅',    symbol: '䷷', description: '遊歷漂泊，異地發展。歡極哀生之象' },
    { number: 57, name: '巽為風',    symbol: '䷸', description: '謙遜入微，柔順滲透。上行下放之象' },
    { number: 58, name: '兌為澤',    symbol: '䷹', description: '喜悅交流，柔中帶剛。天峰雨澤之象' },
    { number: 59, name: '風水渙',    symbol: '䷺', description: '分散化解，團結一心。大風吹物之象' },
    { number: 60, name: '水澤節',    symbol: '䷻', description: '節制有度，分寸得宜。寒暑有節之象' },
    { number: 61, name: '風澤中孚',  symbol: '䷼', description: '誠信中正，內外相應。事有定期之象' },
    { number: 62, name: '雷山小過',  symbol: '䷽', description: '謹慎行事，小心謙遜。上逆下順之象' },
    { number: 63, name: '水火既濟',  symbol: '䷾', description: '事事圓滿，盛極須防。陰陽配合之象' },
    { number: 64, name: '火水未濟',  symbol: '䷿', description: '未竟之業，臨終待成。憂中望喜之象' }
    ];

    // ▼▼▼ 易經六十四卦數位化資料庫 爻的順序由下到上 (初爻 -> 上爻)，1為陽爻，0為陰爻 ▼▼▼// 
    const HEXAGRAM_DATA = {
    '䷀': "111111", '䷁': "000000", '䷂': "100010", '䷃': "010001", '䷄': "111010",
    '䷅': "010111", '䷆': "010000", '䷇': "000010", '䷈': "111011", '䷉': "110111",
    '䷊': "111000", '䷋': "000111", '䷌': "101111", '䷍': "111101", '䷎': "001000",
    '䷏': "000100", '䷐': "100110", '䷑': "011001", '䷒': "110000", '䷓': "000011",
    '䷔': "100101", '䷕': "101001", '䷖': "000001", '䷗': "100000", '䷘': "100111",
    '䷙': "111001", '䷚': "100001", '䷛': "011110", '䷜': "010010", '䷝': "101101",
    '䷞': "001110", '䷟': "011100", '䷠': "001111", '䷡': "111100", '䷢': "000101",
    '䷣': "101000", '䷤': "101011", '䷥': "110101", '䷦': "001010", '䷧': "010100",
    '䷨': "110001", '䷩': "100011", '䷪': "111110", '䷫': "011111", '䷬': "000110",
    '䷭': "011000", '䷮': "010110", '䷯': "011010", '䷰': "101110", '䷱': "011101",
    '䷲': "100100", '䷳': "001001", '䷴': "001011", '䷵': "110100", '䷶': "101100",
    '䷷': "001101", '䷸': "011011", '䷹': "110110", '䷺': "010011", '䷻': "110010",
    '䷼': "110011", '䷽': "001100", '䷾': "101010", '䷿': "010101"
    };  

    // ▼▼▼ 太歲合神計神的判斷式 ▼▼▼
    const DEITY_RULES_DATA = [
        {"陰陽局":"陽局","時支":"子","太歲":"子","合神":"丑","計神":"寅"}, {"陰陽局":"陽局","時支":"丑","太歲":"丑","合神":"子","計神":"丑"}, {"陰陽局":"陽局","時支":"寅","太歲":"寅","合神":"亥","計神":"子"}, {"陰陽局":"陽局","時支":"卯","太歲":"卯","合神":"戌","計神":"亥"}, {"陰陽局":"陽局","時支":"辰","太歲":"辰","合神":"酉","計神":"戌"}, {"陰陽局":"陽局","時支":"巳","太歲":"巳","合神":"申","計神":"酉"}, {"陰陽局":"陽局","時支":"午","太歲":"午","合神":"未","計神":"申"}, {"陰陽局":"陽局","時支":"未","太歲":"未","合神":"午","計神":"未"}, {"陰陽局":"陽局","時支":"申","太歲":"申","合神":"巳","計神":"午"}, {"陰陽局":"陽局","時支":"酉","太歲":"酉","合神":"辰","計神":"巳"}, {"陰陽局":"陽局","時支":"戌","太歲":"戌","合神":"卯","計神":"辰"}, {"陰陽局":"陽局","時支":"亥","太歲":"亥","合神":"寅","計神":"卯"},
        {"陰陽局":"陰局","時支":"子","太歲":"子","合神":"丑","計神":"申"}, {"陰陽局":"陰局","時支":"丑","太歲":"丑","合神":"子","計神":"未"}, {"陰陽局":"陰局","時支":"寅","太歲":"寅","合神":"亥","計神":"午"}, {"陰陽局":"陰局","時支":"卯","太歲":"卯","合神":"戌","計神":"巳"}, {"陰陽局":"陰局","時支":"辰","太歲":"辰","合神":"酉","計神":"辰"}, {"陰陽局":"陰局","時支":"巳","太歲":"巳","合神":"申","計神":"卯"}, {"陰陽局":"陰局","時支":"午","太歲":"午","合神":"未","計神":"寅"}, {"陰陽局":"陰局","時支":"未","太歲":"未","合神":"午","計神":"丑"}, {"陰陽局":"陰局","時支":"申","太歲":"申","合神":"巳","計神":"子"}, {"陰陽局":"陰局","時支":"酉","太歲":"酉","合神":"辰","計神":"亥"}, {"陰陽局":"陰局","時支":"戌","太歲":"戌","合神":"卯","計神":"戌"}, {"陰陽局":"陰局","時支":"亥","太歲":"亥","合神":"寅","計神":"酉"}
    ];

    // ▼▼▼ 主參客參定參的規則資料庫 ▼▼▼
    const SUAN_DIGIT_RULES = {
        '1': { Da: '乾', Can: '艮' }, '2': { Da: '午', Can: '酉' }, '3': { Da: '艮', Can: '巽' },
        '4': { Da: '卯', Can: '午' }, '5': { Da: '中', Can: '中' }, '6': { Da: '酉', Can: '子' },
        '7': { Da: '坤', Can: '乾' }, '8': { Da: '子', Can: '卯' }, '9': { Da: '巽', Can: '坤' },
        '0': { Da: '乾', Can: '艮' }
    };
    
    const SHI_WU_FU_ORDER = ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'];
    const XIAO_YOU_ORDER = ['亥', '午', '寅', '卯', '酉', '申', '子', '巳'];
    const JUN_CHEN_JI_ORDER = ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'];
    const MIN_JI_ORDER = ['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'];
    const TIAN_YI_ORDER = ['酉', '申', '子', '巳', '戌', '未', '丑', '亥', '午', '寅', '卯', '辰'];
    const DI_YI_ORDER = ['巳', '戌', '未', '丑', '亥', '午', '寅', '卯', '辰', '酉', '申', '子'];
    const SI_SHEN_ORDER = ['亥', '午', '寅', '卯', '辰', '酉', '申', '子', '巳', '戌', '未', '丑'];
    const FEI_FU_ORDER = ['辰', '酉', '申', '子', '巳', '戌', '未', '丑', '亥', '午', '寅', '卯'];
    const DA_YOU_ORDER = ['坤', '子', '巽', '乾', '午', '艮', '卯', '酉'];

    // ▼▼▼ 月將十二神的規則資料 ▼▼▼
    const MONTHLY_GENERALS_MAPPING = [
        null, '神后子', null, '登明亥', null, '河魁戌', null, '從魁酉',
        null, '傳送申', null, '小吉未', null, '勝光午', null, '太乙巳',
        null, '天罡辰', null, '太衝卯', null, '功曹寅', null, '大吉丑'
    ];
    const FULL_GENERALS_ORDER = [
        '神后子', '大吉丑', '功曹寅', '太衝卯', '天罡辰', '太乙巳',
        '勝光午', '小吉未', '傳送申', '從魁酉', '河魁戌', '登明亥'
    ];
    // 1. 貴人十二神的完整順時鐘順序
    const GUI_REN_ORDER = [
        '貴人', '騰蛇', '朱雀', '六合', '勾陳', '青龍', 
        '天空', '白虎', '太常', '玄武', '太陰', '天后'
    ];
    // 2. 日干對應的起始月將表
    const GUI_REN_YUE_JIANG_MAP = {
        '甲': { day: '小吉未', night: '大吉丑' }, '己': { day: '神后子', night: '傳送申' },
        '乙': { day: '傳送申', night: '神后子' }, '庚': { day: '大吉丑', night: '小吉未' },
        '丙': { day: '從魁酉', night: '登明亥' }, '辛': { day: '功曹寅', night: '勝光午' },
        '丁': { day: '登明亥', night: '從魁酉' }, '壬': { day: '太衝卯', night: '太乙巳' },
        '戊': { day: '大吉丑', night: '小吉未' }, '癸': { day: '太乙巳', night: '太衝卯' }
    };
    // 3. 用來判斷貴人十二神順逆時鐘的宮位群組
    const GUI_REN_DAY_BRANCHES = ['卯', '辰', '巳', '午', '未', '申']; // 晝貴
    const GUI_REN_NIGHT_BRANCHES = ['酉', '戌', '亥', '子', '丑', '寅']; // 夜貴
    const CLOCKWISE_PALACES = ['亥', '子', '丑', '寅', '卯', '辰'];

    // ▼▼▼ 奇門遁甲八門的規則資料 ▼▼▼
    const EIGHT_GATES_ORDER = ['開', '休', '生', '傷', '杜', '景', '死', '驚'];
    const YANG_START_GATES = ['開', '生', '驚', '休'];
    const YIN_START_GATES = ['杜', '死', '傷', '景'];

    // ▼▼▼ 年干化曜規則資料庫 ▼▼▼
    const NIAN_GAN_HUA_YAO = {
        '甲': { tianYuan: ['小遊'], ganYuan: ['小遊'], fuMu: ['客大'] },
        '乙': { tianYuan: ['主大'], ganYuan: ['客參'], fuMu: ['主參'] },
        '丙': { tianYuan: ['客大'], ganYuan: ['始擊'], fuMu: ['小遊'] },
        '丁': { tianYuan: ['小遊'], ganYuan: ['飛符'], fuMu: ['客參'] },
        '戊': { tianYuan: ['臣基', '始擊'], ganYuan: ['君基'], fuMu: ['始擊'] },
        '己': { tianYuan: ['民基'], ganYuan: ['臣基'], fuMu: ['飛符'] },
        '庚': { tianYuan: ['主大'], ganYuan: ['主大'], fuMu: ['臣基'] },
        '辛': { tianYuan: ['時五福'], ganYuan: ['天乙'], fuMu: ['民基'] },
        '壬': { tianYuan: ['時五福'], ganYuan: ['客大'], fuMu: ['主大'] },
        '癸': { tianYuan: ['始擊'], ganYuan: ['主參'], fuMu: ['天乙'] }
    };
    // ▼▼▼ 日干化曜規則資料庫 ▼▼▼
    const RI_GAN_HUA_YAO = {
        '甲': { luZhu: ['君基'], pianLu: ['臣基'], guanXing: ['天乙'], qiCai: ['臣基'], jiXing: ['小遊'], guiXing: ['主大'] },
        '乙': { luZhu: ['主大'], pianLu: ['臣基'], guanXing: ['主大'], qiCai: ['民基'], jiXing: ['始擊'], guiXing: ['天乙'] },
        '丙': { luZhu: ['客大'], pianLu: [], guanXing: ['四神'], qiCai: ['主大'], jiXing: ['地乙'], guiXing: ['客大'] },
        '丁': { luZhu: ['小遊'], pianLu: [], guanXing: ['客大'], qiCai: ['天乙'], jiXing: ['天乙'], guiXing: ['四神'] },
        '戊': { luZhu: ['始擊'], pianLu: ['民基', '地乙'], guanXing: ['客參'], qiCai: ['客大'], jiXing: ['四神'], guiXing: ['小遊'] },
        '己': { luZhu: ['君基'], pianLu: ['臣基', '計神', '文昌'], guanXing: ['小遊'], qiCai: ['四神'], jiXing: ['小遊'], guiXing: ['客參'] },
        '庚': { luZhu: ['主大'], pianLu: [], guanXing: ['飛符'], qiCai: ['小遊'], jiXing: ['始擊'], guiXing: ['始擊'] },
        '辛': { luZhu: ['客大'], pianLu: ['五福'], guanXing: ['始擊'], qiCai: ['客參'], jiXing: ['地乙'], guiXing: ['飛符'] },
        '壬': { luZhu: ['小遊'], pianLu: ['五福'], guanXing: ['民基'], qiCai: ['始擊'], jiXing: ['天乙'], guiXing: ['計神'] },
        '癸': { luZhu: ['始擊'], pianLu: [], guanXing: ['臣基'], qiCai: ['飛符'], jiXing: ['四神'], guiXing: ['地乙'] }
    };
    // ▼▼▼ 日支化曜規則資料庫 ▼▼▼
    const RI_ZHI_HUA_YAO = {
        '子': { fuXing: ['客大', '客參'] }, '辰': { fuXing: ['客大', '客參'] }, '申': { fuXing: ['客大', '客參'] },
        '丑': { fuXing: ['民基', '主大'] }, '巳': { fuXing: ['民基', '主大'] }, '酉': { fuXing: ['民基', '主大'] },
        '寅': { fuXing: ['君基', '文昌'] }, '午': { fuXing: ['君基', '文昌'] }, '戌': { fuXing: ['君基', '文昌'] },
        '卯': { fuXing: ['臣基', '始擊'] }, '未': { fuXing: ['臣基', '始擊'] }, '亥': { fuXing: ['臣基', '始擊'] }
    };
    // ▼▼▼ 中英文化曜名稱) ▼▼▼
    const HUA_YAO_ROLE_MAP = {
    // 年干
    tianYuan: '天元官星', ganYuan: '干元星', fuMu: '父母星',
    // 日干
    luZhu: '天元祿主', pianLu: '偏祿', guanXing: '官星', qiCai: '妻財', jiXing: '忌星', guiXing: '鬼星',
    // 日支
    fuXing: '地元福星'
    };
    // ▼▼▼ 星曜強旺程度資料庫 (使用者校對版) ▼▼▼
    const STAR_STRENGTH_DATA = {
    '小遊':   { '寅': '侍 祿庫', '卯': '入廟', '未': '祿庫', '亥': '科名' },
    '文昌':   { '子': '入侍', '丑': '入廟', '辰': '祿庫', '申': '科名', '亥': '廟 科名' },
    '始擊':   { '寅': '科名', '午': '入廟', '戌': '入侍' },
    '君基':   { '子': '貴人', '辰': '祿庫', '巳': '貴人', '申': '科名 貴人', '戌': '入廟', '亥': '貴人' },
    '臣基':   { '子': '入侍', '辰': '祿庫', '未': '貴人', '申': '科名 貴人', '戌': '入廟', '亥': '貴人' },
    '民基':   { '子': '入侍', '辰': '入廟', '申': '科名' },
    '時五福': { '丑': '祿庫', '辰': '入廟', '申': '科名' },
    '計神':   { '申': '科名', '戌': '入廟', '亥': '廟 科名' },
    '主大':   { '丑': '入侍', '巳': '科名', '申': '廟 科名', '酉': '入廟' },
    '主參':   { '子': '入廟', '申': '科名' },
    '客大':   { '子': '入廟', '辰': '入廟', '申': '廟 科名' },
    '客參':   { '卯': '入廟', '亥': '科名' },
    '天乙':   { '丑': '入廟', '巳': '科名' },
    '地乙':   { '辰': '入侍', '申': '科名', '戌': '入廟' },
    '四神':   { '子': '入廟', '辰': '入侍' },
    '飛符':   { '寅': '科名', '午': '入廟' }
    };

    // ▼▼▼ 行年歲數的規則資料庫 ▼▼▼
    // 1. 男命 1-60 歲的行年干支 (順時鐘)
    const XINGNIAN_GANZHI_MALE = [
        '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥',
        '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未', '甲申', '乙酉',
        '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未',
        '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯', '甲辰', '乙巳',
        '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑', '甲寅', '乙卯',
        '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥', '甲子', '乙丑'
    ];
    // 2. 女命 1-60 歲的行年干支 (逆時鐘)
    const XINGNIAN_GANZHI_FEMALE = [
        '壬申', '辛未', '庚午', '己巳', '戊辰', '丁卯', '丙寅', '乙丑', '甲子', '癸亥',
        '壬戌', '辛酉', '庚申', '己未', '戊午', '丁巳', '丙辰', '乙卯', '甲寅', '癸丑',
        '壬子', '辛亥', '庚戌', '己酉', '戊申', '丁未', '丙午', '乙巳', '甲辰', '癸卯',
        '壬寅', '辛丑', '庚子', '己亥', '戊戌', '丁酉', '丙申', '乙未', '甲午', '癸巳',
        '壬辰', '辛卯', '庚寅', '己丑', '戊子', '丁亥', '丙戌', '乙酉', '甲戌', '癸未',
        '壬午', '辛巳', '庚辰', '己卯', '戊寅', '丁丑', '丙子', '乙亥', '甲申', '癸酉'
    ];

    // ▼▼▼ 主算、客算、定算數字的屬性列表 ▼▼▼
    const SUAN_ATTRIBUTE_DATA = {
        '1': '雜陽數、短數、無天之數、無地之數',
        '2': '純陰數、短數、無天之數、無地之數',
        '3': '純陽數、短數、無天之數、無地之數',
        '4': '雜陰數、短數、無天之數、無地之數',
        '5': '短數、杜塞無門、無天之數',
        '6': '純陰數、短數、無天之數',
        '7': '雜陽數、短數、無天之數',
        '8': '雜陰數、短數、無天之數',
        '9': '純陽數、短數、無天之數',
        '10': '單陽數、無人之數',
        '11': '陰中重陽數、孤陽數、無地之數',
        '12': '下合之數、無地之數',
        '13': '雜重陽數、孤陽數、無地之數',
        '14': '上合之數、無地之數',
        '15': '杜塞無門',
        '16': '下合之數、三才數',
        '17': '陰中重陽數、三才數',
        '18': '上合之數、三才數',
        '19': '雜重陽數、三才數',
        '20': '單陰數、無人之數',
        '21': '下合之數、無地之數',
        '22': '重陰數、無地之數',
        '23': '次合之數、無地之數',
        '24': '雜重陰數、孤陰數、無地之數',
        '25': '杜塞無門',
        '26': '重陰數、三才數',
        '27': '下合之數、三才數',
        '28': '雜重陰數、三才數',
        '29': '次合之數、三才數',
        '30': '單陽數、無人之數',
        '31': '雜重陽數、無地之數',
        '32': '次合之數、無地之數',
        '33': '重陽數、無地之數',
        '34': '下合之數、無地之數',
        '35': '杜塞無門',
        '36': '次合之數、三才數',
        '37': '雜重陽、孤陽數、三才數',
        '38': '下合之數、三才數',
        '39': '重陽數、三才數',
        '40': '單陰數、無人之數'
    };

    // ▼▼▼ 皇恩星的規則資料庫 ▼▼▼
    const HUANG_EN_RULES = {
        '子': '申', '丑': '巳', '寅': '寅', '卯': '亥',
        '辰': '申', '巳': '巳', '午': '寅', '未': '亥',
        '申': '申', '酉': '巳', '戌': '寅', '亥': '亥'
    };

    // ▼▼▼ 陽九大限的規則資料庫 ▼▼▼
    const YANG_JIU_RULES = {
    '甲': { startBranch: '午', firstAge: 5 }, '己': { startBranch: '午', firstAge: 5 },
    '乙': { startBranch: '巳', firstAge: 4 }, '庚': { startBranch: '巳', firstAge: 4 },
    '丙': { startBranch: '申', firstAge: 1 }, '辛': { startBranch: '申', firstAge: 1 },
    '丁': { startBranch: '亥', firstAge: 3 }, '壬': { startBranch: '亥', firstAge: 3 },
    '戊': { startBranch: '寅', firstAge: 2 }, '癸': { startBranch: '寅', firstAge: 2 }
    };

    // ▼▼▼ 百六小限的規則資料庫 ▼▼▼
    const BAI_LIU_XIAO_XIAN_RULES = {
    '甲': { startBranch: '午', startAge: 5 }, '己': { startBranch: '午', startAge: 5 },
    '乙': { startBranch: '巳', startAge: 4 }, '庚': { startBranch: '巳', startAge: 4 },
    '丙': { startBranch: '申', startAge: 1 }, '辛': { startBranch: '申', startAge: 1 },
    '丁': { startBranch: '亥', startAge: 3 }, '壬': { startBranch: '亥', startAge: 3 },
    '戊': { startBranch: '寅', startAge: 2 }, '癸': { startBranch: '寅', startAge: 2 }
    };

    // ▼▼▼ 大遊真限規則資料庫 ▼▼▼
    const ZHI_SIX_HARMONIES = {
    '子': '丑', '丑': '子', '寅': '亥', '卯': '戌', '辰': '酉', '巳': '申',
    '午': '未', '未': '午', '申': '巳', '酉': '辰', '戌': '卯', '亥': '寅'
    };
    const DA_YOU_SEQUENCE = [
    '丑', '酉', '午', '亥', '寅', '巳', '子', '卯', '辰', '未', '申', '戌'
    ];
    const DA_YOU_DURATIONS = {
    '丑': 5, '酉': 6, '午': 7, '亥': 7, '寅': 11, '巳': 4,
    '子': 4, '卯': 13, '辰': 12, '未': 6, '申': 5, '戌': 5
    };

    // ▼▼▼ 飛祿大限的規則資料庫 ▼▼▼
    const FEI_LU_LIMIT_RULES = {
    '甲': { startBranch: '亥', firstAge: 3 }, '乙': { startBranch: '亥', firstAge: 3 },
    '丙': { startBranch: '寅', firstAge: 2 }, '丁': { startBranch: '寅', firstAge: 2 },
    '戊': { startBranch: '午', firstAge: 5 }, '己': { startBranch: '午', firstAge: 5 },
    '庚': { startBranch: '巳', firstAge: 4 }, '辛': { startBranch: '巳', firstAge: 4 },
    '壬': { startBranch: '申', firstAge: 1 }, '癸': { startBranch: '申', firstAge: 1 }
    };

    // ▼▼▼ 飛祿流年(小限)的規則資料庫 ▼▼▼
    const FEI_LU_ANNUAL_RULES = {
    '甲': { startBranch: '亥', startAge: 1 }, '乙': { startBranch: '亥', startAge: 1 },
    '丙': { startBranch: '寅', startAge: 1 }, '丁': { startBranch: '寅', startAge: 1 },
    '戊': { startBranch: '午', startAge: 1 }, '己': { startBranch: '午', startAge: 1 },
    '庚': { startBranch: '巳', startAge: 1 }, '辛': { startBranch: '巳', startAge: 1 },
    '壬': { startBranch: '申', startAge: 1 }, '癸': { startBranch: '申', startAge: 1 }
    };

    // ▼▼▼ 黑符的規則資料庫 ▼▼▼
    const HEI_FU_RULES = {
    '甲': '寅', '乙': '卯', '丙': '子', '丁': '亥', '戊': '戌',
    '己': '酉', '庚': '申', '辛': '未', '壬': '午', '癸': '巳'
    };

    // ▼▼▼ 陽性陰性地支列表 ▼▼▼
    const YANG_BRANCHES = ['子', '寅', '辰', '午', '申', '戌'];
    const YIN_BRANCHES = ['丑', '卯', '巳', '未', '酉', '亥'];

    // ▼▼▼ 星曜上中下等級資料庫 ▼▼▼
    const STAR_RATING_DATA = {
    '小遊':   { '子': '中', '丑': '中', '寅': '上', '卯': '上', '辰': '中', '巳': '下', '午': '下', '未': '上', '申': '下', '酉': '下', '戌': '中', '亥': '上' },
    '計神':   { '子': '中', '丑': '上', '寅': '下', '卯': '下', '辰': '上', '巳': '中', '午': '中', '未': '上', '申': '中', '酉': '中', '戌': '上', '亥': '中' },
    '文昌':   { '子': '下', '丑': '上', '寅': '下', '卯': '下', '辰': '上', '巳': '中', '午': '中', '未': '中', '申': '上', '酉': '中', '戌': '中', '亥': '上' },
    '始擊':   { '子': '中', '丑': '中', '寅': '上', '卯': '下', '辰': '中', '巳': '上', '午': '上', '未': '中', '申': '下', '酉': '下', '戌': '上', '亥': '下' },
    '時五福': { '子': '中', '丑': '上', '寅': '下', '卯': '下', '辰': '上', '巳': '中', '午': '中', '未': '中', '申': '上', '酉': '中', '戌': '中', '亥': '上' },
    '君基':   { '子': '上', '丑': '上', '寅': '下', '卯': '下', '辰': '上', '巳': '中', '午': '上', '未': '上', '申': '中', '酉': '下', '戌': '上', '亥': '中' },
    '臣基':   { '子': '中', '丑': '上', '寅': '下', '卯': '下', '辰': '上', '巳': '中', '午': '中', '未': '上', '申': '中', '酉': '下', '戌': '上', '亥': '中' },
    '民基':   { '子': '上', '丑': '中', '寅': '下', '卯': '下', '辰': '上', '巳': '中', '午': '中', '未': '中', '申': '上', '酉': '下', '戌': '中', '亥': '上' },
    '天乙':   { '子': '中', '丑': '上', '寅': '下', '卯': '下', '辰': '中', '巳': '下', '午': '下', '未': '中', '申': '上', '酉': '上', '戌': '中', '亥': '中' },
    '地乙':   { '子': '中', '丑': '上', '寅': '下', '卯': '下', '辰': '上', '巳': '中', '午': '中', '未': '上', '申': '中', '酉': '下', '戌': '上', '亥': '下' },
    '四神':   { '子': '上', '丑': '中', '寅': '下', '卯': '下', '辰': '上', '巳': '下', '午': '中', '未': '下', '申': '上', '酉': '下', '戌': '中', '亥': '上' },
    '飛符':   { '子': '下', '丑': '中', '寅': '上', '卯': '下', '辰': '中', '巳': '上', '午': '上', '未': '中', '申': '中', '酉': '下', '戌': '上', '亥': '下' },
    '主大':   { '子': '中', '丑': '上', '寅': '下', '卯': '中', '辰': '中', '巳': '上', '午': '下', '未': '中', '申': '上', '酉': '上', '戌': '下', '亥': '中' },
    '主參':   { '子': '上', '丑': '下', '寅': '中', '卯': '下', '辰': '上', '巳': '中', '午': '中', '未': '下', '申': '上', '酉': '中', '戌': '下', '亥': '上' },
    '客大':   { '子': '上', '丑': '中', '寅': '中', '卯': '下', '辰': '上', '巳': '下', '午': '下', '未': '中', '申': '上', '酉': '中', '戌': '下', '亥': '上' },
    '客參':   { '子': '中', '丑': '中', '寅': '上', '卯': '上', '辰': '中', '巳': '下', '午': '下', '未': '上', '申': '下', '酉': '下', '戌': '中', '亥': '上' }
    };

    // ▼▼▼ 星曜屬性資料庫 (五行/吉凶/描述) ▼▼▼
    const STAR_PROPERTIES = {
    '小遊':   { element: '陽木', luck: '吉星', description: '歲星之精，正直之星' },
    '計神':   { element: '陰土', luck: '吉星', description: '財庫天機星' },
    '文昌':   { element: '陽土', luck: '吉星', description: '文才之星' },
    '始擊':   { element: '陽火', luck: '凶星', description: '酒色星' },
    '時五福': { element: '陽土', luck: '吉星', description: '天上賜福之神' },
    '君基':   { element: '陽土', luck: '吉星', description: '科甲貴人星' },
    '臣基':   { element: '陽土', luck: '吉星', description: '招搖吉星' },
    '民基':   { element: '陰土', luck: '吉星', description: '財富星，食祿之神' },
    '天乙':   { element: '陰金', luck: '凶星', description: '孤獨之星' },
    '地乙':   { element: '陰土', luck: '凶星', description: '孤寡之星' },
    '四神':   { element: '陰水', luck: '凶星', description: '聚散之星，又號孤星' },
    '飛符':   { element: '陰火', luck: '凶星', description: '兇暴之星' },
    '主大':   { element: '陽金', luck: '吉星', description: '魁鉞之星' },
    '主參':   { element: '陰水', luck: '吉星', description: '副帥之星' },
    '客大':   { element: '陽水', luck: '吉星', description: '邊疆顯達，巨商大賈' },
    '客參':   { element: '陰木', luck: '吉星', description: '副將之星，旅星孤星' }
    };

    // ▼▼▼ 寄宮規則資料庫 ▼▼▼
    const JI_GONG_MAP = {
    'pQian': 'pHai', // 乾寄亥
    'pGen':  'pYin', // 艮寄寅
    'pXun':  'pSi',  // 巽寄巳
    'pKun':  'pShen' // 坤寄申
    };

    // ▼▼▼ 十二宮對宮關係資料庫 ▼▼▼
    const OPPOSITE_PALACE_MAP = {
    'pZi': 'pWu', 'pChou': 'pWei', 'pYin': 'pShen', 'pMao': 'pYou', 'pChen': 'pXu', 'pSi': 'pHai',
    'pWu': 'pZi', 'pWei': 'pChou', 'pShen': 'pYin', 'pYou': 'pMao', 'pXu': 'pChen', 'pHai': 'pSi'
    };

    // ▼▼▼ 星曜等級對應分數 ▼▼▼
    const RATING_SCORES = { '上': 20, '中': 10, '平': 0, '下': -10 };

    // ▼▼▼ 論命分析中需要排除的星曜列表 ▼▼▼
    const EXCLUDED_STARS_FROM_ANALYSIS = ['太乙', '定目', '定大', '定參', '大遊', '太歲', '合神'];

    // ▼▼▼ 中宮寄宮規則資料庫 ▼▼▼
    const CENTER_PALACE_JI_GONG_RULES = {
    '主算': {
        '5':  { '主大': '戌', '主參': '辰' },
        '15': { '主大': '未', '主參': '丑' },
        '25': { '主大': '戌', '主參': '辰' },
        '35': { '主大': '丑', '主參': '未' }
    },
    '客算': {
        '5':  { '客大': '辰', '客參': '戌' },
        '15': { '客大': '未', '客參': '丑' },
        '25': { '客大': '戌', '客參': '辰' },
        '35': { '客大': '丑', '客參': '未' }
    }
    };

    // ▼▼▼ 十二宮職全名對照表 ▼▼▼
    const PALACE_FULL_NAME_MAP = { 
    '命':'命宮', '兄':'兄弟宮', '妻':'夫妻宮', '孫':'子孫宮', 
    '財':'財帛宮', '田':'田宅宮', '官':'官祿宮', '奴':'奴僕宮', 
    '疾':'疾厄宮', '福':'福德宮', '貌':'相貌宮', '父':'父母宮' 
    };

    // ▼▼▼ 星曜十二宮代表意義資料庫 ▼▼▼
    const STAR_PALACE_DESCRIPTIONS = {
    '小遊':   { '命宮': '主科甲，天資出眾，在身宮善於記憶。在命宮善於辨識善偽。', '兄弟宮': '主兄長品德好，兄弟和睦。或晚年弟弟多。', '夫妻宮': '主妻愛整潔，善家事。', '子孫宮': '主一子為貴，多子則秀氣散，反不能貴。', '財帛宮': '財帛豐盛，只愁日用不足，此為隔年愁星。', '田宅宮': '旺宮主家業田茂地盛，居陷先盛後蕭條。', '官祿宮': '居旺宮，一路功名跟隨到白頭。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '計神':   { '命宮': '主機智多端，百事成就。在旺宮為為館閣之貴（距離權力核心近）。', '兄弟宮': '主兄弟兩母無益。', '夫妻宮': '主妻能治家，善理財記帳。', '子孫宮': '主子孫才學出眾，居旺宮有二子。', '財帛宮': '善會計記帳，生財利，財帛充實。', '田宅宮': '主家宅華麗美觀。', '官祿宮': '主早年聲名，名高位顯。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '文昌':   { '命宮': '主仁識義理，化詞館星。遇到五福君基，為館閣之貴（距離權力核心近）。', '兄弟宮': '主兄弟文秀才美。', '夫妻宮': '主妻能治家。才美之婚，詩禮之門。', '子孫宮': '主子孫博學多聞，居旺宮有四子。', '財帛宮': '因文字書寫發財獲利。', '田宅宮': '主讀書起家，因文物書畫立業。', '官祿宮': '主文章蓋世，朝野聞名。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '始擊':   { '命宮': '主將帥。戊癸日生人，主貴。居陷為邊帥。幼時遠離父母。', '兄弟宮': '主孤兄獨弟，各自離散。', '夫妻宮': '主須防三妻四妾。主好酒色。', '子孫宮': '剋子息，可認義子。剋一二方保。', '財帛宮': '財帛聚散無常，居旺宮主突然發達，亦主積蓄不長久。見飛符要小心盜賊。', '田宅宮': '主破祖業而成家，居陷小心水火之厄。居旺則無礙。', '官祿宮': '主武職蓋世，名震邊城。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '時五福': { '命宮': '主福壽顯貴，享五福造化。在寅卯宮或入空亡宮，主清福孤高。', '兄弟宮': '主兄弟富貴，我卑微。將我的福份減半之意。', '夫妻宮': '主得妻力，獲得妻家財產資助。', '子孫宮': '主子孫顯貴，晚景安樂。在日時宮有二子。', '財帛宮': '坐旺宮金玉滿堂。', '田宅宮': '主享祖業厚產，祖上父母庇蔭。', '官祿宮': '官祿之途得五福佑之，無驚懼，若居陷利祿難成。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '君基':   { '命宮': '主顯貴，品德寬厚，對人尊重，話少。', '兄弟宮': '主兄弟貴，我微弱。奪我福祿，分我財產之意。', '夫妻宮': '主妻為極貴之人，若不應，則剋首任妻子。若四神同臨，妻好道奉佛，心慈樂善。', '子孫宮': '若一子，極貴。若三至四子，則秀氣散，反不能貴。年少即得兒。', '財帛宮': '主吃公家飯，得貴人財帛。', '田宅宮': '主良田萬頃，大廈高堂。最怕坐空亡宮。', '官祿宮': '主早發功名，登科甲。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '臣基':   { '命宮': '輔佐型人才，品德正直，為人守本分，謹言多思。', '兄弟宮': '主有姊無兄。或姊妹多，兄弟少。', '夫妻宮': '主妻能治家掌權，家業充實。', '子孫宮': '主女多男少，宜先女後男。', '財帛宮': '主財物豐盛，得女人財，或得妻家之財。', '田宅宮': '主多資產，宜朝北的房宅最利。', '官祿宮': '會吉星，必主大貴。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '民基':   { '命宮': '主富祿，好德享福。戊日生人，主遠離家鄉，發福大富。', '兄弟宮': '主兄弟成家，合德合心。', '夫妻宮': '主妻能治家，有積蓄，能得妻家財。', '子孫宮': '主子孫富厚，勤儉成家，居旺宮有三子。', '財帛宮': '主資財豐盛，大富。', '田宅宮': '主財富田多，主大門宅第之房。', '官祿宮': '會吉星，主納栗求名。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '天乙':   { '命宮': '主性孤剛強，不為錢與人同流合污。遇三基五福可國外貿易。適合離祖發展。', '兄弟宮': '主兄弟壽不長，可能有夭折兄弟。', '夫妻宮': '主妻善持家，但中途妻家家道衰敗。可娶年長妻。', '子孫宮': '主長子不利，寄名方保。', '財帛宮': '主財帛聚散不常，先散後聚，多積蓄，只愁日用不足，此為隔年愁星。', '田宅宮': '主祖業消散，自立成家，居旺宮得五金之利。', '官祿宮': '主武強文弱。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '地乙':   { '命宮': '主守土疆，性孤剛強，不為錢與人同流合污。適合離祖發展。', '兄弟宮': '主過房隔脈，孤立成長。', '夫妻宮': '主宜長配，可娶年長妻。否則易有病刑傷，二三任妻則無剋。', '子孫宮': '主多災，早生難育。剋三方保。', '財帛宮': '主得田園之利，成敗無常，先散後聚。', '田宅宮': '主祖業悠久，祖孫相繼。', '官祿宮': '主文武雙全。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '四神':   { '命宮': '主孤獨，六親疏離。得舟船魚鹽酒水之利。適合離祖發展。', '兄弟宮': '主兄弟離異不睦。', '夫妻宮': '命主有個性潔癖，個性沈靜，不一定會結婚。', '子孫宮': '主長子不利，剋三方保。申子宮一兒平安。', '財帛宮': '主財帛聚散不常，居旺宮主財帛豐盈。', '田宅宮': '主房產近水，離祖成家，享天廚之樂。', '官祿宮': '主功名悠久。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '飛符':   { '命宮': '主聰明伶俐，慷慨成性，喜符法爐火。適合離祖發展。', '兄弟宮': '主有隔脈的手足，分居二地。', '夫妻宮': '初婚刑剋首妻，二三任妻則無剋。', '子孫宮': '主不易有子，初得子而後喪，若只一女多富貴。', '財帛宮': '主蓄財聚散不常，居旺宮主突然發達，見始擊要小心盜賊。', '田宅宮': '主祖業更遷，居陷小心火厄。', '官祿宮': '主功名驟發。居陷因名破家，此星名為剝官煞，文職難就，唯利武職。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '主大':   { '命宮': '主高貴有權。旺宮為人清秀，陷宮身似蛇型。逢君基五福，有貴人提拔。', '兄弟宮': '主身為老大，有兄弟。', '夫妻宮': '主妻分擔夫權，可偕老。', '子孫宮': '主一子為貴。居旺宮得五子，反不能貴。', '財帛宮': '財發如泉湧，錦上添花。', '田宅宮': '主資產在市中心，田宅得利。', '官祿宮': '主清顯節名，朝野聞名，早年必發。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '主參':   { '命宮': '主依貴成事。需藉由貴人之力而發福。忌小遊與五凶同宮。', '兄弟宮': '主有隔脈的手足。', '夫妻宮': '主小三扶正掌家，二三任妻則無剋。', '子孫宮': '主庶出遲生。可得二子。', '財帛宮': '得外人扶持得財，因人成事，借力使力的獲財方式。', '田宅宮': '主依附祖父輩資產，基業壯盛。', '官祿宮': '主得貴人提攜，成就功名。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '客大':   { '命宮': '主性華麗，喜賓朋，近貴利，官顯達。會民基主蓋世英雄。遠離家鄉發展佳。', '兄弟宮': '主兄弟二人，相處上沒那麼和睦。', '夫妻宮': '主入贅妻家，否則易二婚離散。', '子孫宮': '主寄養過房。才能保住子孫。', '財帛宮': '主遊歷在外從商得財，經營得厚利，或合夥生財。', '田宅宮': '主離祖成家，產業興隆。', '官祿宮': '主遊歷發福，或歷邊疆之任。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' },
    '客參':   { '命宮': '主依貴成事。需藉由貴人之力而發福。遠離家鄉發展佳，可從商。', '兄弟宮': '主有隔脈的手足。', '夫妻宮': '主入贅妻家，妻妾2人。', '子孫宮': '主庶出遲生。可得二子。', '財帛宮': '得外人扶持得財，因人成事，因貿易而獲利。', '田宅宮': '主離祖成家，依貴人享福。', '官祿宮': '主依貴食祿，事業需傍貴而成。', '奴僕宮': '待完成', '疾厄宮': '待完成', '福德宮': '待完成', '相貌宮': '待完成', '父母宮': '待完成' }
    };  




// =================================================================
//  SECTION 2: SVG 圖盤繪製邏輯 (最終整理版)
// =================================================================
const svgPlate = document.getElementById('taiyi-plate');
const SVG_NS = "http://www.w3.org/2000/svg";
const dynamicGroup = document.createElementNS(SVG_NS, 'g');
dynamicGroup.setAttribute('id', 'dynamic-text-group');
if (svgPlate) { svgPlate.appendChild(dynamicGroup); }
let pathCounter = 0;

// --- 所有的繪圖「工具函式」都集中在這裡 ---
// ▼▼▼ 繪製放射狀文字的工具函式 (可翻轉版) ▼▼▼
// ▼▼▼ 繪製放射狀文字的工具函式 (可針對特定宮位翻轉) ▼▼▼
// ▼▼▼ 繪製放射狀文字的工具函式 (可翻轉、可調整距離版) ▼▼▼
function addRadialText(palaceId, angle, startRadius, text, className) {
    
    const targetPalacesForFlip = ['pSi', 'pWu', 'pWei'];
    
    // 預設使用傳入的原始半徑
    let effectiveRadius = startRadius;

    // 檢查是否是需要特殊處理的宮位
    if (targetPalacesForFlip.includes(palaceId)) {
        // 如果是，就從設定檔讀取額外的距離並加上去
        const offset = RADIAL_LAYOUT.bottomPalaceRadiusOffset || 0;
        effectiveRadius = startRadius + offset;
    }

    // --- 以下為繪圖邏輯 ---
    if (targetPalacesForFlip.includes(palaceId)) {
        const angleRad = angle * (Math.PI / 180);
        const x = RADIAL_LAYOUT.center.x + effectiveRadius * Math.cos(angleRad);
        const y = RADIAL_LAYOUT.center.y + effectiveRadius * Math.sin(angleRad);
        
        // 採用您驗證可行的旋轉角度
        let rotation = angle - 90 + 180;

        const textElement = document.createElementNS(SVG_NS, 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
        textElement.setAttribute('class', 'dynamic-text ' + className);
        textElement.setAttribute('dominant-baseline', 'central');
        textElement.setAttribute('text-anchor', 'middle');
        textElement.textContent = text;
        dynamicGroup.appendChild(textElement);

    } else {
        // 其他宮位，維持原本的 <textPath> 方法
        pathCounter++;
        const pathId = `radial-path-${pathCounter}`;
        const angleRad = angle * (Math.PI / 180);
        const endX = RADIAL_LAYOUT.center.x + 600 * Math.cos(angleRad);
        const endY = RADIAL_LAYOUT.center.y + 600 * Math.sin(angleRad);
        
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('id', pathId);
        path.setAttribute('d', `M ${RADIAL_LAYOUT.center.x},${RADIAL_LAYOUT.center.y} L ${endX},${endY}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'none');
        dynamicGroup.appendChild(path);
        
        const textElement = document.createElementNS(SVG_NS, 'text');
        textElement.setAttribute('class', 'dynamic-text ' + className);
        
        const textPath = document.createElementNS(SVG_NS, 'textPath');
        textPath.setAttribute('href', '#' + pathId);
        textPath.setAttribute('startOffset', startRadius); // 注意：這裡仍然使用原始的 startRadius
        textPath.textContent = text;
        
        textElement.appendChild(textPath);
        dynamicGroup.appendChild(textElement);
    }
}
function addSingleCharRing(data, ringConfig) {
    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        if (!char) continue;
        const palaceKey = ringConfig.palaces[i];
        const angle = RADIAL_LAYOUT.angles[palaceKey];
        const angleRad = angle * (Math.PI / 180);
        const x = RADIAL_LAYOUT.center.x + ringConfig.radius * Math.cos(angleRad);
        const y = RADIAL_LAYOUT.center.y + ringConfig.radius * Math.sin(angleRad);
        const textElement = document.createElementNS(SVG_NS, 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'central');
        textElement.setAttribute('class', 'dynamic-text sub-info-style');
        if (ringConfig.color) {
            textElement.setAttribute('style', `fill: ${ringConfig.color};`);
        }
        textElement.textContent = char;
        dynamicGroup.appendChild(textElement);
    }
}
function addRotatedRingText(data, ringConfig) {
    const rotationOffset = ringConfig.rotationOffset || 0;
    for (let i = 0; i < data.length; i++) {
        const text = data[i];
        if (!text) continue;
        const palaceKey = ringConfig.palaces[i];
        const angle = RADIAL_LAYOUT.angles[palaceKey] + rotationOffset;
        const angleRad = angle * (Math.PI / 180);
        const x = RADIAL_LAYOUT.center.x + ringConfig.radius * Math.cos(angleRad);
        const y = RADIAL_LAYOUT.center.y + ringConfig.radius * Math.sin(angleRad);
        let rotation = angle + 90;
        if (angle > 90 && angle < 270) {
            rotation = angle - 90;
        }
        if (ringConfig.flipPalaces && ringConfig.flipPalaces.includes(palaceKey)) {
            rotation += 180;
        }
        const textElement = document.createElementNS(SVG_NS, 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'central');
        const className = ringConfig.className || 'sub-info-style';
        textElement.setAttribute('class', 'dynamic-text ' + className);
        let styleString = 'writing-mode: horizontal-tb;';
        if (ringConfig.color) {
            styleString += ` fill: ${ringConfig.color};`;
        }
        textElement.setAttribute('style', styleString);
        textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
        textElement.textContent = text;
        dynamicGroup.appendChild(textElement);
    }
}
function addSdrRing(sdrDataObject, ringConfig) {
    if (!sdrDataObject || !ringConfig) return;
    for (const palaceKey in sdrDataObject) {
        const chars = sdrDataObject[palaceKey];
        if (!chars || chars.length === 0 || RADIAL_LAYOUT.angles[palaceKey] === undefined) continue;
        const centerAngle = RADIAL_LAYOUT.angles[palaceKey];
        let angles = [];
        if (chars.length === 1) { angles = [centerAngle]; } 
        else if (chars.length === 2) { angles = [centerAngle - ringConfig.hOffset, centerAngle + ringConfig.hOffset]; } 
        else if (chars.length === 3) { angles = [centerAngle - ringConfig.hOffset, centerAngle, centerAngle + ringConfig.hOffset]; }
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const angle = angles[i];
            if (angle === undefined) continue;
            const angleRad = angle * (Math.PI / 180);
            const x = RADIAL_LAYOUT.center.x + ringConfig.radius * Math.cos(angleRad);
            const y = RADIAL_LAYOUT.center.y + ringConfig.radius * Math.sin(angleRad);
            const textElement = document.createElementNS(SVG_NS, 'text');
            textElement.setAttribute('x', x);
            textElement.setAttribute('y', y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'central');
            textElement.setAttribute('class', 'dynamic-text sdr-style');
            textElement.textContent = char;
            dynamicGroup.appendChild(textElement);
        }
    }
}
function addEncircledText(text, x, y, rotation, textClassName, circleClassName) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${x}, ${y})`);
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', 9);
    circle.setAttribute('class', circleClassName);
    const textElement = document.createElementNS(SVG_NS, 'text');
    textElement.setAttribute('x', 0);
    textElement.setAttribute('y', 0);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'central');
    textElement.setAttribute('class', 'dynamic-text ' + textClassName);
    textElement.setAttribute('transform', `rotate(${rotation})`);
    textElement.textContent = text;
    group.appendChild(circle);
    group.appendChild(textElement);
    dynamicGroup.appendChild(group);
}
function clearDynamicData() {
    if (dynamicGroup) {
        dynamicGroup.innerHTML = '';
    }
}
function addCenterText(text, coords, className) {
    if (!text || !coords) return;
    const textElement = document.createElementNS(SVG_NS, 'text');
    textElement.setAttribute('x', coords.x);
    textElement.setAttribute('y', coords.y);
    textElement.setAttribute('class', `dynamic-text ${className}`);
    textElement.textContent = text;
    textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
    dynamicGroup.appendChild(textElement);
}

// --- 繪圖主函式 (最終整理版) ---
function renderChart(mainData, palacesData, agesData, sdrData, centerData, outerRingData, xingNianData, yangJiuData, baiLiuData, baiLiuXiaoXianData, daYouZhenXianData, feiLuDaXianData, feiMaDaXianData, feiLuLiuNianData, feiMaLiuNianData, heiFuData) {    
    clearDynamicData();
        if (outerRingData) {
            const ringConfig = RADIAL_LAYOUT.outerRing;
            for (const palaceId in outerRingData) {
                if (ringConfig.palaces.includes(palaceId)) {
                    const text = outerRingData[palaceId];
                    const angle = RADIAL_LAYOUT.angles[palaceId];
                    const angleRad = angle * (Math.PI / 180);
                    const x = RADIAL_LAYOUT.center.x + ringConfig.radius * Math.cos(angleRad);
                    const y = RADIAL_LAYOUT.center.y + ringConfig.radius * Math.sin(angleRad);
                    addEncircledText(text, x, y, 0, 'main-info-style', 'highlight-circle');
                }
            }
        }
        
        if (centerData) {
            addCenterText(centerData.field1, RADIAL_LAYOUT.centerFields.field1, 'center-info-style');
            addCenterText(centerData.field2, RADIAL_LAYOUT.centerFields.field2, 'center-info-style');
            addCenterText(centerData.field3, RADIAL_LAYOUT.centerFields.field3, 'center-info-style');
            addCenterText(centerData.field4, RADIAL_LAYOUT.centerFields.field4, 'center-info-style');
        }
        for (const palaceKey in mainData) {
            if (!mainData[palaceKey]) continue;
            const centerAngle = RADIAL_LAYOUT.angles[palaceKey];
            const pData = mainData[palaceKey];
            if (centerAngle === undefined || !pData) continue;
            const angleLeft = centerAngle - RADIAL_LAYOUT.angleOffset;
            const angleCenter = centerAngle;
            const angleRight = centerAngle + RADIAL_LAYOUT.angleOffset;
            if (pData.lineLeft) {
                const getLineLeftClass = (starName) => {
                    if (starName === '定目') return 'ding-mu-style';
                    return 'main-info-style';
                };
                if (pData.lineLeft.fieldA) addRadialText(palaceKey, angleLeft, RADIAL_LAYOUT.radii.lineLeft.fieldA, pData.lineLeft.fieldA, getLineLeftClass(pData.lineLeft.fieldA));
                if (pData.lineLeft.fieldB) addRadialText(palaceKey, angleLeft, RADIAL_LAYOUT.radii.lineLeft.fieldB, pData.lineLeft.fieldB, getLineLeftClass(pData.lineLeft.fieldB));
                if (pData.lineLeft.fieldG) addRadialText(palaceKey, angleLeft, RADIAL_LAYOUT.radii.lineLeft.fieldG, pData.lineLeft.fieldG, getLineLeftClass(pData.lineLeft.fieldG));
            }
            if (pData.lineCenter) {
                const getLineCenterClass = (starName) => {
                    if (['君基', '臣基', '民基'].includes(starName)) return 'ji-star-style';
                    return 'sub-info-style';
                };
                if (pData.lineCenter.fieldC) addRadialText(palaceKey, angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldC, pData.lineCenter.fieldC, getLineCenterClass(pData.lineCenter.fieldC));
                if (pData.lineCenter.fieldD) addRadialText(palaceKey, angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldD, pData.lineCenter.fieldD, getLineCenterClass(pData.lineCenter.fieldD));
                if (pData.lineCenter.fieldC2) addRadialText(palaceKey, angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldC2, pData.lineCenter.fieldC2, getLineCenterClass(pData.lineCenter.fieldC2));
                if (pData.lineCenter.fieldD2) addRadialText(palaceKey, angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldD2, pData.lineCenter.fieldD2, getLineCenterClass(pData.lineCenter.fieldD2));
            }
            if (pData.lineRight) {
                const getLineRightClass = (starName) => {
                    if (starName === '小遊') return 'xiaoyou-style'; 
                    if (starName === '大遊') return 'dayou-style';
                    if (['天乙', '地乙', '四神', '飛符'].includes(starName)) return 'celestial-messenger-style';
                    if (starName === '皇恩星') return 'huang-en-style'; return 'deity-style';
                }; 
                if (pData.lineRight.fieldE) addRadialText(palaceKey, angleRight, RADIAL_LAYOUT.radii.lineRight.fieldE, pData.lineRight.fieldE, getLineRightClass(pData.lineRight.fieldE));
                if (pData.lineRight.fieldF) addRadialText(palaceKey, angleRight, RADIAL_LAYOUT.radii.lineRight.fieldF, pData.lineRight.fieldF, getLineRightClass(pData.lineRight.fieldF));
                if (pData.lineRight.fieldE2) addRadialText(palaceKey, angleRight, RADIAL_LAYOUT.radii.lineRight.fieldE2, pData.lineRight.fieldE2, getLineRightClass(pData.lineRight.fieldE2));
                if (pData.lineRight.fieldF2) addRadialText(palaceKey, angleRight, RADIAL_LAYOUT.radii.lineRight.fieldF2, pData.lineRight.fieldF2, getLineRightClass(pData.lineRight.fieldF2));
            }
            
        }
        // 繪製其他環圈
    addSingleCharRing(palacesData, RADIAL_LAYOUT.lifePalacesRing);
    addSdrRing(sdrData, RADIAL_LAYOUT.sdrRing);
    addRotatedRingText(agesData, RADIAL_LAYOUT.ageLimitRing);
    
    // ▼▼▼ 繪製月將十二神環圈 ▼▼▼
    if (mainData && mainData.yueJiangData) {
        addRotatedRingText(mainData.yueJiangData, RADIAL_LAYOUT.yueJiangRing);}

    // ▼▼▼ 繪製貴人十二神環圈 ▼▼▼
     if (mainData && mainData.guiRenData) {
         addRotatedRingText(mainData.guiRenData, RADIAL_LAYOUT.guiRenRing);}

    // ▼▼▼ 繪製行年歲數 ▼▼▼
    if (xingNianData) {
            // 1. 準備一份嚴格按照「子丑寅卯...」順序排列的歲數資料陣列
            const ageDataForRing = VALID_PALACES_CLOCKWISE.map(palaceId => {
                // 如果該宮位有歲數資料，就將其組合成字串，否則為空字串
                return xingNianData[palaceId] ? xingNianData[palaceId].ages.join('  ') : "";
            });
            
            // 2. 準備一份符合 addRotatedRingText 需求的設定檔
            const xingNianRingConfig = { 
                ...RADIAL_LAYOUT.xingNianRing, // 複製原本的 radius 設定
                palaces: VALID_PALACES_CLOCKWISE, // 吿訴它要按照「子丑寅卯...」的順序來畫
                className: 'xing-nian-style'      // 指定文字樣式
            };
            
            // 3. 呼叫正確的繪圖函式
            addRotatedRingText(ageDataForRing, xingNianRingConfig);
    }
    // ▼▼▼ 繪製陽九限 ▼▼▼
    if (yangJiuData && yangJiuData.palaceId) {
        const config = RADIAL_LAYOUT.yangJiuRing;
        const palaceId = yangJiuData.palaceId;
        const text = yangJiuData.text;
        const rotationOffset = config.rotationOffset || 0;
        const angle = RADIAL_LAYOUT.angles[palaceId] + rotationOffset;
        const angleRad = angle * (Math.PI / 180);
        const x = RADIAL_LAYOUT.center.x + config.radius * Math.cos(angleRad);
        const y = RADIAL_LAYOUT.center.y + config.radius * Math.sin(angleRad);
        let rotation = angle + 90;
        if (angle > 90 && angle < 270) { rotation = angle - 90; }
        if (config.flipPalaces.includes(palaceId)) { rotation += 180; }
        const textElement = document.createElementNS(SVG_NS, 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'central');
        textElement.setAttribute('class', `dynamic-text ${config.className}`);
        textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
        textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
        textElement.textContent = text;
        dynamicGroup.appendChild(textElement);
    }
    // ▼▼▼ 繪製百六限 ▼▼▼
    if (baiLiuData && baiLiuData.palaceId) {
        const config = RADIAL_LAYOUT.baiLiuRing;
        const palaceId = baiLiuData.palaceId; // <-- 已修正
        const text = baiLiuData.text;         // <-- 已修正
        const rotationOffset = config.rotationOffset || 0;
        const angle = RADIAL_LAYOUT.angles[palaceId] + rotationOffset;
        const angleRad = angle * (Math.PI / 180);
        const x = RADIAL_LAYOUT.center.x + config.radius * Math.cos(angleRad);
        const y = RADIAL_LAYOUT.center.y + config.radius * Math.sin(angleRad);
        let rotation = angle + 90;
        if (angle > 90 && angle < 270) { rotation = angle - 90; }
        if (config.flipPalaces.includes(palaceId)) { rotation += 180; }
        const textElement = document.createElementNS(SVG_NS, 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'central');
        textElement.setAttribute('class', `dynamic-text ${config.className}`);
        textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
        textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
        textElement.textContent = text;
        dynamicGroup.appendChild(textElement);
    }
    // ▼▼▼ 繪製百六小限 ▼▼▼
    if (baiLiuXiaoXianData) {
        // 1. 將計算結果整理成繪圖函式需要的格式 (一個12元素的陣列)
        const displayData = VALID_PALACES_CLOCKWISE.map(palaceId => {
            // 如果某個宮位有歲數資料，就把它們用空格連接起來，否則留空
            return baiLiuXiaoXianData[palaceId] ? baiLiuXiaoXianData[palaceId].join(' ') : "";
        });

        // 2. 準備設定檔，告訴繪圖函式使用哪個環圈設定、以及資料要對應到哪個宮位
        const ringConfig = { 
            ...RADIAL_LAYOUT.baiLiuXiaoXianRing, // 複製我們在第一區的設定
            palaces: VALID_PALACES_CLOCKWISE     // 告訴它要按照「子丑寅卯...」的順序來畫
        };
        
        // 3. 呼叫我們現有的、強大的 addRotatedRingText 工具函式來繪製
        addRotatedRingText(displayData, ringConfig);
    }
    // ▼▼▼ 繪製大遊真限 (最多三個) ▼▼▼
    if (daYouZhenXianData && daYouZhenXianData.length > 0) {
        const config = RADIAL_LAYOUT.daYouZhenXianRing;

        daYouZhenXianData.forEach(item => {
            if (!item || !item.palaceId) return;

            const palaceId = item.palaceId;
            const text = item.text;
            
            const rotationOffset = config.rotationOffset || 0;
            const angle = RADIAL_LAYOUT.angles[palaceId] + rotationOffset;
            
            const angleRad = angle * (Math.PI / 180);
            const x = RADIAL_LAYOUT.center.x + config.radius * Math.cos(angleRad);
            const y = RADIAL_LAYOUT.center.y + config.radius * Math.sin(angleRad);

            let rotation = angle + 90;
            if (angle > 90 && angle < 270) { rotation = angle - 90; }
            if (config.flipPalaces.includes(palaceId)) { rotation += 180; }
            
            const textElement = document.createElementNS(SVG_NS, 'text');
            textElement.setAttribute('x', x);
            textElement.setAttribute('y', y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'central');
            textElement.setAttribute('class', `dynamic-text ${config.className}`);
            textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
            textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            textElement.textContent = text;
            dynamicGroup.appendChild(textElement);
        });
    }
    // ▼▼▼ 繪製飛祿大限 (最多三個) ▼▼▼
    if (feiLuDaXianData && feiLuDaXianData.length > 0) {
        const config = RADIAL_LAYOUT.feiLuDaXianRing;

        feiLuDaXianData.forEach(item => {
            if (!item || !item.palaceId) return;
            const { palaceId, text } = item;
            
            const rotationOffset = config.rotationOffset || 0;
            const angle = RADIAL_LAYOUT.angles[palaceId] + rotationOffset;
            
            const angleRad = angle * (Math.PI / 180);
            const x = RADIAL_LAYOUT.center.x + config.radius * Math.cos(angleRad);
            const y = RADIAL_LAYOUT.center.y + config.radius * Math.sin(angleRad);

            let rotation = angle + 90;
            if (angle > 90 && angle < 270) { rotation = angle - 90; }
            if (config.flipPalaces.includes(palaceId)) { rotation += 180; }
            
            const textElement = document.createElementNS(SVG_NS, 'text');
            textElement.setAttribute('x', x);
            textElement.setAttribute('y', y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'central');
            textElement.setAttribute('class', `dynamic-text ${config.className}`);
            textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
            textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            textElement.textContent = text;
            dynamicGroup.appendChild(textElement);
        });
    }
    // ▼▼▼ 繪製飛馬大限 (最多三個) ▼▼▼
    if (feiMaDaXianData && feiMaDaXianData.length > 0) {
        const config = RADIAL_LAYOUT.feiMaDaXianRing;

        feiMaDaXianData.forEach(item => {
            if (!item || !item.palaceId) return;
            const { palaceId, text } = item;
            
            const rotationOffset = config.rotationOffset || 0;
            const angle = RADIAL_LAYOUT.angles[palaceId] + rotationOffset;
            
            const angleRad = angle * (Math.PI / 180);
            const x = RADIAL_LAYOUT.center.x + config.radius * Math.cos(angleRad);
            const y = RADIAL_LAYOUT.center.y + config.radius * Math.sin(angleRad);

            let rotation = angle + 90;
            if (angle > 90 && angle < 270) { rotation = angle - 90; }
            if (config.flipPalaces.includes(palaceId)) { rotation += 180; }
            
            const textElement = document.createElementNS(SVG_NS, 'text');
            textElement.setAttribute('x', x);
            textElement.setAttribute('y', y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'central');
            textElement.setAttribute('class', `dynamic-text ${config.className}`);
            textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
            textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            textElement.textContent = text;
            dynamicGroup.appendChild(textElement);
        });
    }
    // ▼▼▼ 繪製飛祿流年 ▼▼▼
    if (feiLuLiuNianData && feiLuLiuNianData.length > 0) {
        const config = RADIAL_LAYOUT.feiLuLiuNianRing;
        feiLuLiuNianData.forEach(item => {
            if (!item || !item.palaceId) return;
            const { palaceId, text } = item;
            // (以下繪圖邏輯與其他環圈完全相同)
            const rotationOffset = config.rotationOffset || 0;
            const angle = RADIAL_LAYOUT.angles[palaceId] + rotationOffset;
            const angleRad = angle * (Math.PI / 180);
            const x = RADIAL_LAYOUT.center.x + config.radius * Math.cos(angleRad);
            const y = RADIAL_LAYOUT.center.y + config.radius * Math.sin(angleRad);
            let rotation = angle + 90;
            if (angle > 90 && angle < 270) { rotation = angle - 90; }
            if (config.flipPalaces.includes(palaceId)) { rotation += 180; }
            const textElement = document.createElementNS(SVG_NS, 'text');
            textElement.setAttribute('x', x); textElement.setAttribute('y', y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'central');
            textElement.setAttribute('class', `dynamic-text ${config.className}`);
            textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
            textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            textElement.textContent = text;
            dynamicGroup.appendChild(textElement);
        });
    }
    // ▼▼▼ 繪製飛馬流年 ▼▼▼
    if (feiMaLiuNianData && feiMaLiuNianData.length > 0) {
        const config = RADIAL_LAYOUT.feiMaLiuNianRing;
        feiMaLiuNianData.forEach(item => {
            if (!item || !item.palaceId) return;
            const { palaceId, text } = item;
            
            const rotationOffset = config.rotationOffset || 0;
            const angle = RADIAL_LAYOUT.angles[palaceId] + rotationOffset;
            
            // (以下繪圖邏輯與其他環圈完全相同)
            const angleRad = angle * (Math.PI / 180);
            const x = RADIAL_LAYOUT.center.x + config.radius * Math.cos(angleRad);
            const y = RADIAL_LAYOUT.center.y + config.radius * Math.sin(angleRad);
            let rotation = angle + 90;
            if (angle > 90 && angle < 270) { rotation = angle - 90; }
            if (config.flipPalaces.includes(palaceId)) { rotation += 180; }
            const textElement = document.createElementNS(SVG_NS, 'text');
            textElement.setAttribute('x', x); textElement.setAttribute('y', y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'central');
            textElement.setAttribute('class', `dynamic-text ${config.className}`);
            textElement.setAttribute('style', 'writing-mode: horizontal-tb;');
            textElement.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            textElement.textContent = text;
            dynamicGroup.appendChild(textElement);
        });
    }
    // ▼▼▼ 繪製黑符流年 ▼▼▼
    if (heiFuData) {
        // 1. 將計算結果整理成繪圖函式需要的格式
        const displayData = VALID_PALACES_CLOCKWISE.map(palaceId => {
            const ages = heiFuData[palaceId];
            // 在數字前面加上前綴「黑」
            return ages ? ages.map(age => `黑${age}`).join(' ') : "";
        });

        // 2. 準備設定檔
        const ringConfig = { 
            ...RADIAL_LAYOUT.heiFuRing,
            palaces: VALID_PALACES_CLOCKWISE
        };
        
        // 3. 呼叫工具函式來繪製
        addRotatedRingText(displayData, ringConfig);
    }
}

// ▼▼▼ 繪製運勢趨勢圖的函式 ▼▼▼
let fortuneChartInstance = null; // 用來存放圖表實例
function renderFortuneChart(ageLabels, scoreData) {
    const ctx = document.getElementById('fortune-chart').getContext('2d');

    if (fortuneChartInstance) {
        fortuneChartInstance.destroy();
    }

    fortuneChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ageLabels,
            datasets: [{
                label: '人生能量趨勢',
                data: scoreData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
    

    // =================================================================
    //  SECTION 3: 核心演算法 (整合新功能)
    // =================================================================
    function determineDirection(yearStem, gender) {
        const yangStems = ['甲', '丙', '戊', '庚', '壬'];
        const isYangYear = yangStems.includes(yearStem);
        return ((isYangYear && gender === '男') || (!isYangYear && gender === '女')) ? 'clockwise' : 'counter-clockwise';
    }
    function findPalaceByCounting(yearBranch, countFromBranch, countToBranch, direction) {
        const startPalaceId = BRANCH_TO_PALACE_ID[yearBranch];
        const startIndex = VALID_PALACES_CLOCKWISE.indexOf(startPalaceId);
        if (startIndex === -1) return undefined;
        let fromIndex = EARTHLY_BRANCHES.indexOf(countFromBranch);
        let toIndex = EARTHLY_BRANCHES.indexOf(countToBranch);
        if (fromIndex === -1 || toIndex === -1) return undefined;
        let steps = toIndex - fromIndex;
        if (steps < 0) steps += 12;
        let finalIndex;
        if (direction === 'clockwise') {
            finalIndex = (startIndex + steps) % 12;
        } else {
            finalIndex = (startIndex - steps + 12 * 12) % 12;
        }
        return VALID_PALACES_CLOCKWISE[finalIndex];
    }
    function arrangeLifePalaces(lifePalaceId, direction) {
        const lifePalaceIndexInValid = VALID_PALACES_CLOCKWISE.indexOf(lifePalaceId);
        const arranged = new Array(12).fill("");
        for (let i = 0; i < 12; i++) {
            let targetIndex;
            if (direction === 'clockwise') {
                targetIndex = (lifePalaceIndexInValid + i) % 12;
            } else {
                targetIndex = (lifePalaceIndexInValid - i + 12 * 12) % 12;
            }
            arranged[targetIndex] = LIFE_PALACE_NAMES[i];
        }
        return arranged;
    }
    function calculateSdrPalaces(data, direction) {
        const yearBranch = data.yearPillar.charAt(1);
        const monthBranch = data.monthPillar.charAt(1);
        const dayBranch = data.dayPillar.charAt(1);
        const hourBranch = data.hourPillar.charAt(1);
        const shenPalace = findPalaceByCounting(yearBranch, monthBranch, dayBranch, direction);
        const riPalace = BRANCH_TO_PALACE_ID[dayBranch];
        const shiPalace = BRANCH_TO_PALACE_ID[hourBranch];
        const result = {};
        if (shenPalace) { if (!result[shenPalace]) result[shenPalace] = []; result[shenPalace].push('身'); }
        if (riPalace) { if (!result[riPalace]) result[riPalace] = []; result[riPalace].push('日'); }
        if (shiPalace) { if (!result[shiPalace]) result[shiPalace] = []; result[shiPalace].push('時'); }
        return result;
    }
    function arrangeAgeLimits(arrangedLifePalaces) {
        const newAgeLimits = new Array(12).fill("");
        arrangedLifePalaces.forEach((palaceName, index) => {
            const originalIndex = LIFE_PALACE_NAMES.indexOf(palaceName);
            if (originalIndex !== -1) {
                newAgeLimits[index] = AGE_LIMIT_DATA[originalIndex];
            }
        });
        return newAgeLimits;
    }
    function lookupBureauData(bureau) {
        return BUREAU_DATA.find(item => item.局 === bureau) || null;
    }
    function calculateDeities(bureau, hourBranch) {
        if (!bureau || !hourBranch) return {};
        const isYinBureau = bureau.startsWith('陰');
        const bureauType = isYinBureau ? '陰局' : '陽局';
        const rule = DEITY_RULES_DATA.find(r => r.陰陽局 === bureauType && r.時支 === hourBranch);

        if (rule) {
            return { '太歲': rule.太歲, '合神': rule.合神, '計神': rule.計神 };
        }
        return {};
    }
    function calculateSuanStars(lookupResult) {
    const result = { chartStars: {}, centerStars: [] };
    if (!lookupResult) { // 安全檢查：如果查表失敗，直接回傳空結果
        return result;
    }
    const suanMap = {
        '主': lookupResult.主算,
        '客': lookupResult.客算,
        '定': lookupResult.定算
    };

    for (const prefix in suanMap) {
        const suanValue = suanMap[prefix];
        const lastDigit = String(suanValue).slice(-1);
        const rule = SUAN_DIGIT_RULES[lastDigit];
        
        if (rule) {
            if (rule.Da === '中') {
                result.centerStars.push(`${prefix}大`);
            } else {
                result.chartStars[`${prefix}大`] = rule.Da;
            }
            if (rule.Can === '中') {
                result.centerStars.push(`${prefix}參`);
            } else {
                result.chartStars[`${prefix}參`] = rule.Can;
            }
        }
    }
    return result;
    }
    function calculateShiWuFu(hourJishu) {
    if (!hourJishu) {
        return null; // 如果沒有時積數，就直接返回
    }

    // 1. 將時積數除以 228，取餘數
    let remainder = Number(hourJishu) % 228;

    // 2. 處理餘數為 0 的特殊情況
    // 根據您的規則，餘數為 0 代表剛好走完一圈，應視為在最後一格 (228)
    if (remainder === 0) {
        remainder = 228;
    }

    // 3. 根據餘數，計算出宮位的索引 (0-11)
    // 使用 (餘數 - 1) 是為了讓 1-19 都對應到索引 0，20-38 對應到索引 1，以此類推
    const palaceIndex = Math.floor((remainder - 1) / 19);

    // 4. 從專屬的宮位順序中，找到對應的地支
    if (palaceIndex < SHI_WU_FU_ORDER.length) {
        return SHI_WU_FU_ORDER[palaceIndex];
    }

    return null; // 如果計算出錯，返回 null
    }
    function calculateXiaoYou(hourJishu) {
        if (!hourJishu) {
            return null;
        }

        // 1. 將時積數除以 24，取餘數
        let remainder = Number(hourJishu) % 24;

        // 2. 處理餘數為 0 的特殊情況 (代表走到最後一宮)
        if (remainder === 0) {
            remainder = 24;
        }

        // 3. 根據餘數，每 3 個單位換一個宮位，計算出宮位索引 (0-7)
        const palaceIndex = Math.floor((remainder - 1) / 3);

        // 4. 從專屬的宮位順序中，找到對應的地支
        if (palaceIndex < XIAO_YOU_ORDER.length) {
            return XIAO_YOU_ORDER[palaceIndex];
        }

        return null;
    }
    function calculateJunJi(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 360;
        if (remainder === 0) remainder = 360;
        const palaceIndex = Math.floor((remainder - 1) / 30);
        if (palaceIndex < JUN_CHEN_JI_ORDER.length) {
            return JUN_CHEN_JI_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateChenJi(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 36;
        if (remainder === 0) remainder = 36;
        const palaceIndex = Math.floor((remainder - 1) / 3);
        if (palaceIndex < JUN_CHEN_JI_ORDER.length) {
            return JUN_CHEN_JI_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateMinJi(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 12;
        if (remainder === 0) remainder = 12;
        const palaceIndex = Math.floor((remainder - 1) / 1);
        if (palaceIndex < MIN_JI_ORDER.length) {
            return MIN_JI_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateTianYi(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 36;
        if (remainder === 0) remainder = 36;
        const palaceIndex = Math.floor((remainder - 1) / 3);
        if (palaceIndex < TIAN_YI_ORDER.length) {
            return TIAN_YI_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateDiYi(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 36;
        if (remainder === 0) remainder = 36;
        const palaceIndex = Math.floor((remainder - 1) / 3);
        if (palaceIndex < DI_YI_ORDER.length) {
            return DI_YI_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateSiShen(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 36;
        if (remainder === 0) remainder = 36;
        const palaceIndex = Math.floor((remainder - 1) / 3);
        if (palaceIndex < SI_SHEN_ORDER.length) {
            return SI_SHEN_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateFeiFu(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 36;
        if (remainder === 0) remainder = 36;
        const palaceIndex = Math.floor((remainder - 1) / 3);
        if (palaceIndex < FEI_FU_ORDER.length) {
            return FEI_FU_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateDaYou(hourJishu) {
        if (!hourJishu) return null;
        let remainder = Number(hourJishu) % 288;
        if (remainder === 0) remainder = 288;
        const palaceIndex = Math.floor((remainder - 1) / 36);
        if (palaceIndex < DA_YOU_ORDER.length) {
            return DA_YOU_ORDER[palaceIndex];
        }
        return null;
    }
    function calculateYueJiang(solarDate, hourBranch) {

        // --- 步驟 1: 根據「節氣期間」找出正確的起始月將 ---
        let termIndex = -1;
        for (let i = 23; i >= 0; i--) {
            const termTime = solarLunar.getTerm(solarDate.year, i + 1);
            if (solarDate.date.getTime() >= termTime) {
                termIndex = i;
                break;
            }
        }
        if (termIndex === -1) {
             const prevYearTermTime = solarLunar.getTerm(solarDate.year - 1, 24);
             if (solarDate.date.getTime() >= prevYearTermTime) { termIndex = 23; } 
             else { return new Array(12).fill(""); }
        }
        let generalTermIndex = termIndex;
        if (generalTermIndex % 2 === 0) { generalTermIndex = generalTermIndex - 1; }
        if (generalTermIndex < 0) { generalTermIndex = 23; }
        const monthlyGeneralName = MONTHLY_GENERALS_MAPPING[generalTermIndex];
        
        if (!monthlyGeneralName) return new Array(12).fill("");

        // --- 步驟 2: 找出月將和時支的起始位置 ---
        const startGeneralIndex = FULL_GENERALS_ORDER.indexOf(monthlyGeneralName);
        const startPalaceIndex = solarLunar.zhi.indexOf(hourBranch);
        if (startGeneralIndex === -1 || startPalaceIndex === -1) { return new Array(12).fill(""); }

        // --- 步驟 3: 逆時鐘排列 (已修正排序邏輯) ---
        const palaceToGeneralMap = {};
        for (let i = 0; i < 12; i++) { // i 對應地支的索引 (0=子, 1=丑...)
            const currentPalaceZhi = solarLunar.zhi[i];
            // 計算當前宮位(i)與起始宮位的「逆時鐘」距離
            const counterClockwiseOffset = (startPalaceIndex - i + 12) % 12;
            // 將這個距離應用到神將的順序上
            const generalIndex = (startGeneralIndex - counterClockwiseOffset + 12) % 12;
            palaceToGeneralMap[currentPalaceZhi] = FULL_GENERALS_ORDER[generalIndex];
        }
        
        // --- 步驟 4: 按照繪圖順序輸出結果 (結構不變) ---
        const drawingPalaceOrder = RADIAL_LAYOUT.yueJiangRing.palaces.map(pId => PALACE_ID_TO_BRANCH[pId]);
        const result = drawingPalaceOrder.map(zhi => palaceToGeneralMap[zhi] || "");

        return result;
    }
    // ▼▼▼ 根據生日自動計算日積數、日柱、日局數的函式 (最終修正版v2) ▼▼▼
    function calculateDailyValues(birthDate) {
    const year = birthDate.getFullYear();
    const birthTime = birthDate.getTime();

    const yearData = SOLSTICE_DATA[year];
    const prevYearData = SOLSTICE_DATA[year - 1];
    if (!yearData) return null;

    let referencePoint;
    let isCrossYear = false;

    if (birthTime >= yearData.winter.date.getTime()) {
        referencePoint = yearData.winter;
    } else if (birthTime >= yearData.summer.date.getTime()) {
        referencePoint = yearData.summer;
    } else if (prevYearData) {
        referencePoint = prevYearData.winter;
        isCrossYear = true;
    } else {
        return null;
    }

    const birthDayOnly = new Date(birthDate);
    birthDayOnly.setHours(0, 0, 0, 0);
    const referenceDayOnly = new Date(referencePoint.date);
    referenceDayOnly.setHours(0, 0, 0, 0);
    
    const dayDifference = Math.round((birthDayOnly - referenceDayOnly) / (1000 * 60 * 60 * 24));

    // 1. 為了「日柱」，我們使用未經校正的、純粹的實際天數差
    const startPillarIndex = JIAZI_CYCLE_ORDER.indexOf(referencePoint.dayPillar);
    if (startPillarIndex === -1) return null;
    const newPillarIndex = (startPillarIndex + dayDifference) % 60;
    const dayPillar = JIAZI_CYCLE_ORDER[newPillarIndex];

    // 2. 為了「積數」和「局數」，我們計算需要經過立春校正的天數差
    let jishuDayDifference = dayDifference;
    const lichunTime = solarLunar.getTerm(year, 3);
    const lichunDate = new Date(lichunTime);

    // ▼▼▼ 唯一的修改點：更精準的判斷條件 ▼▼▼
    // 只有當生日的「年月日」和立春的「年月日」完全相同，
    // 且出生時間早於立春時間時，才進行校正。
    if (isCrossYear &&
        birthDate.getDate() === lichunDate.getUTCDate() &&
        birthDate.getMonth() === lichunDate.getUTCMonth() &&
        birthTime < lichunTime) {
        
        jishuDayDifference -= 1;
        console.log("偵錯：觸發「當日立春」校正，天數差減 1。");
    }

    const dayJishu = referencePoint.dayJishu + jishuDayDifference;
    const startBureau = referencePoint.dayBureau;
    const newBureauNum = ((startBureau - 1 + jishuDayDifference) % 72 + 72) % 72 + 1;
    const dayBureau = `陽${newBureauNum}局`;

    return {
        dayJishu: dayJishu,
        dayPillar: dayPillar,
        dayBureau: dayBureau
    };
    }
    // ▼▼▼ 根據生日自動計算積數與局數的整合型函式 (v2-精準版) ▼▼▼
    function calculateJishuAndBureau(birthDate) {
    // 步驟 1: 先取得日積數的基礎資料
    const dailyValues = calculateDailyValues(birthDate);
    if (!dailyValues) return null;

    const hour = birthDate.getHours();
    const { dayJishu, dayPillar } = dailyValues;

    // 步驟 2: 計算精準時積數
    // 處理夜子時(23點)的情況：Bazi日柱會換日，所以用於計算的日積數也要跟著+1
    let adjustedDayJishu = dayJishu;
    if (hour === 23) {
        adjustedDayJishu += 1;
    }

    // 根據您的規則，計算1-12的時辰數 (子時為1, 丑時為2...)
    const hourIndex0Based = (hour >= 1 && hour < 23) ? Math.floor((hour + 1) / 2) : 0;
    const hourIncrement1Based = hourIndex0Based + 1; // 將 0-11 轉為 1-12

    // 最終時積數 = (調整後的日積數 * 12) + 1至12的時辰數
    const hourJishu = (adjustedDayJishu * 12) + hourIncrement1Based;

    // 步驟 3: 根據時積數，反推時柱以供驗證
    // 六十甲子是1-60的循環，對應陣列索引0-59。公式為 (數字-1)%60
    const hourPillarIndex = (hourJishu - 1 + 60) % 60; 
    const validatedHourPillar = JIAZI_CYCLE_ORDER[hourPillarIndex];


    // 步驟 4: 根據時積數和冬至/夏至，決定陰陽局數
    const year = birthDate.getFullYear();
    const yearData = SOLSTICE_DATA[year];
    if (!yearData) return null;

    let bureauType = '陽'; // 預設為陽局 (冬至後 ~ 夏至前)
    // 如果生日在當年夏至和冬至之間，則為陰局
    if (birthDate.getTime() >= yearData.summer.date.getTime() && birthDate.getTime() < yearData.winter.date.getTime()) {
        bureauType = '陰';
    }
    const bureauRemainder = hourJishu % 72;
    const bureauNumber = (bureauRemainder === 0) ? 72 : bureauRemainder;
    const calculatedBureau = `${bureauType}${bureauNumber}局`;

    return {
        dayJishu: dayJishu,
        hourJishu: hourJishu,
        dayPillar: dayPillar,
        validatedHourPillar: validatedHourPillar,
        calculatedBureau: calculatedBureau
    };
    }
    // ▼▼▼ 計算「八門」位置的函式▼▼▼
    function calculateOuterRingData(bureauResult, hourJishu, lookupResult) {
    // 安全檢查：如果缺少必要的資料，則不顯示八門
    if (!bureauResult || !hourJishu || !lookupResult || !lookupResult.太乙) {
        return {};
    }

    // --- 第一步：找出「值使門」---
    const isYinBureau = bureauResult.startsWith('陰');
    let remainder = Number(hourJishu) % 120;
    if (remainder === 0) {
        remainder = 120;
    }
    const leadingGateIndex = Math.floor((remainder - 1) / 30);
    
    let leadingGate;
    if (isYinBureau) {
        leadingGate = YIN_START_GATES[leadingGateIndex];
    } else {
        leadingGate = YANG_START_GATES[leadingGateIndex];
    }

    // --- 第二步：找出起始宮位 (太乙所在宮位) ---
    const startPalaceBranch = lookupResult.太乙;
    const startPalaceId = BRANCH_TO_PALACE_ID[startPalaceBranch];
    const outerRingPalaces = RADIAL_LAYOUT.outerRing.palaces; // 取得外圈八宮的順序

    // --- 第三步：將八門依序排入八宮 ---
    const startGateOrderIndex = EIGHT_GATES_ORDER.indexOf(leadingGate);
    const startPalaceOrderIndex = outerRingPalaces.indexOf(startPalaceId);

    const finalGates = {};
    if (startGateOrderIndex === -1 || startPalaceOrderIndex === -1) {
        return {}; // 如果找不到起始門或起始宮，則返回空
    }

    for (let i = 0; i < 8; i++) {
        const currentPalaceIndex = (startPalaceOrderIndex + i) % 8;
        const currentGateIndex = (startGateOrderIndex + i) % 8;

        const palaceId = outerRingPalaces[currentPalaceIndex];
        const gateName = EIGHT_GATES_ORDER[currentGateIndex];
        
        finalGates[palaceId] = gateName;
    }

    return finalGates;
    }
    // ▼▼▼ 計算「貴人十二神」位置的函式▼▼▼
    function calculateGuiRen(dayGan, hourBranch, yueJiangData) {
        const result = new Array(12).fill("");
        if (!dayGan || !hourBranch || !yueJiangData || yueJiangData.length === 0) {
            return result;
        }

        // --- 1. 根據日干和時支，找出貴人所跟隨的「月將」是誰 ---
        let targetYueJiang;
        if (GUI_REN_DAY_BRANCHES.includes(hourBranch)) {
            targetYueJiang = GUI_REN_YUE_JIANG_MAP[dayGan].day;
        } else if (GUI_REN_NIGHT_BRANCHES.includes(hourBranch)) {
            targetYueJiang = GUI_REN_YUE_JIANG_MAP[dayGan].night;
        } else {
            return result;
        }

        // --- 2. 在月將十二神的盤中，找到這個目標月將的位置 ---
        const yueJiangPalaceIndex = yueJiangData.indexOf(targetYueJiang);
        if (yueJiangPalaceIndex === -1) {
            return result;
        }

        // --- 3. 根據月將的位置，找到「貴人」的起始宮位地支 ---
        const noblemanPalaceId = RADIAL_LAYOUT.yueJiangRing.palaces[yueJiangPalaceIndex];
        const noblemanPalaceBranch = PALACE_ID_TO_BRANCH[noblemanPalaceId];

        // 將起始宮位地支，換算成標準的十二地支索引 (0-11)
        const noblemanStandardIndex = solarLunar.zhi.indexOf(noblemanPalaceBranch);
        if (noblemanStandardIndex === -1) {
            return result;
        }
        
        // --- 4. 判斷貴人落宮，決定排列方向 ---
        const direction = CLOCKWISE_PALACES.includes(noblemanPalaceBranch) ? 'clockwise' : 'counter-clockwise';

        // --- 5. 根據起始宮位和方向，排列剩下的11位神 ---
        const finalResult = new Array(12);
        for (let i = 0; i < 12; i++) { // i 代表十二神的順序 (0=貴人, 1=騰蛇...)
            let palaceIndex;
            if (direction === 'clockwise') {
                palaceIndex = (noblemanStandardIndex + i) % 12; // 使用標準索引來計算
            } else {
                palaceIndex = (noblemanStandardIndex - i + 12) % 12;
            }
            finalResult[palaceIndex] = GUI_REN_ORDER[i];
        }

        // 6. 最後，按照繪圖所需的特殊順序，重新整理結果
        const drawingPalaceOrder = RADIAL_LAYOUT.guiRenRing.palaces.map(pId => PALACE_ID_TO_BRANCH[pId]);
        return drawingPalaceOrder.map(zhi => finalResult[solarLunar.zhi.indexOf(zhi)] || "");
    }
    // ▼▼▼ 新增：計算「皇恩星」位置的函式 ▼▼▼
    function calculateHuangEn(dayBranch) {
        if (!dayBranch) return null;
        return HUANG_EN_RULES[dayBranch] || null;
    } 
    // ▼▼▼ 計算行年歲數與干支的函式 ▼▼▼
    function calculateXingNian(gender, startAge, endAge) {
        const result = {};
        VALID_PALACES_CLOCKWISE.forEach(palaceId => {
            result[palaceId] = { ages: [], ganzhi: [] };
        });

        const startPalace = (gender === '男') ? '寅' : '申';
        const direction = (gender === '男') ? 1 : -1;
        const ganzhiSequence = (gender === '男') ? XINGNIAN_GANZHI_MALE : XINGNIAN_GANZHI_FEMALE;
        const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startPalace);

        // 確保我們只計算大於 0 歲的年齡
        const displayStartAge = Math.max(1, startAge);

        // 使用傳入的 startAge 和 endAge 來決定計算範圍
        for (let age = displayStartAge; age <= endAge; age++) {
            const offset = age - 1;
            const palaceIndex = (startPalaceIndex + offset * direction + 144) % 12;
            const palaceId = BRANCH_TO_PALACE_ID[EARTHLY_BRANCHES[palaceIndex]];
            
            if (result[palaceId]) {
                result[palaceId].ages.push(age);
                result[palaceId].ganzhi.push(ganzhiSequence[offset % 60]);
            }
        }
        return result;
    }
    // ▼▼▼ 計算所有年日化曜結果的函式 ▼▼▼
    function calculateAllHuaYao(yearStem, dayStem, dayBranch) {
        const results = {};

        // 1. 年干化曜
        const nianGanRule = NIAN_GAN_HUA_YAO[yearStem];
        if (nianGanRule) {
            results.nianGan = {
                tianYuan: nianGanRule.tianYuan.join(' '),
                ganYuan: nianGanRule.ganYuan.join(' '),
                fuMu: nianGanRule.fuMu.join(' ')
            };
        }

        // 2. 日干化曜
        const riGanRule = RI_GAN_HUA_YAO[dayStem];
        if (riGanRule) {
            results.riGan = {
                luZhu: riGanRule.luZhu.join(' ') || '無',
                pianLu: riGanRule.pianLu.join(' ') || '無',
                guanXing: riGanRule.guanXing.join(' ') || '無',
                qiCai: riGanRule.qiCai.join(' ') || '無',
                jiXing: riGanRule.jiXing.join(' ') || '無',
                guiXing: riGanRule.guiXing.join(' ') || '無'
            };
        }

        // 3. 日支化曜
        const riZhiRule = RI_ZHI_HUA_YAO[dayBranch];
        if (riZhiRule) {
            results.riZhi = {
                fuXing: riZhiRule.fuXing.join(' ')
            };
        }

        return results;
    }
    // ▼▼▼ 查找「當前」陽九限 (專供圓盤顯示) ▼▼▼
    function findCurrentYangJiuForDisplay(fullLimitArray, currentUserAge) {
    if (!fullLimitArray || !Array.isArray(fullLimitArray)) return null;
    const currentLimit = fullLimitArray.find(limit => {
        if (!limit.ageRange) return false;
        const [start, end] = limit.ageRange.split('-').map(Number);
        return currentUserAge >= start && currentUserAge <= end;
    });
    // 回傳繪圖函式看得懂的物件格式
    if (currentLimit) {
        return { palaceId: currentLimit.palaceId, text: `陽九${currentLimit.ageRange}` };
    }
    return null;
    }
    // ▼▼▼ 查找「當前」百六大限 (專供圓盤顯示) ▼▼▼
    function findCurrentBaiLiuForDisplay(fullLimitArray, currentUserAge) {
    if (!fullLimitArray || !Array.isArray(fullLimitArray)) return null;
    const currentLimit = fullLimitArray.find(limit => {
        if (!limit.ageRange) return false;
        const [start, end] = limit.ageRange.split('-').map(Number);
        return currentUserAge >= start && currentUserAge <= end;
    });
    // 回傳繪圖函式看得懂的物件格式
    if (currentLimit) {
        return { palaceId: currentLimit.palaceId, text: `百六${currentLimit.ageRange}` };
    }
    return null;
    }
    // ▼▼▼ 查找「當前及未來兩個」大遊真限 (專供圓盤顯示) ▼▼▼
    function findCurrentAndNextDaYouForDisplay(fullLimitArray, currentUserAge) {
    if (!fullLimitArray || !Array.isArray(fullLimitArray)) return [];
    const currentLimitIndex = fullLimitArray.findIndex(limit => {
        if (!limit.ageRange) return false;
        const [start, end] = limit.ageRange.split('-').map(Number);
        return currentUserAge >= start && currentUserAge <= end;
    });

    if (currentLimitIndex === -1) return [];

    const results = [];
    for (let i = 0; i < 3; i++) {
        const limitToShow = fullLimitArray[(currentLimitIndex + i) % fullLimitArray.length];
        if (limitToShow) {
            results.push({
                palaceId: limitToShow.palaceId,
                text: `大遊${limitToShow.ageRange}` // 組合好要顯示的文字
            });
        }
    }
    return results;
    }
    // ▼▼▼ 計算「陽九大限」(完整序列)的函式 ▼▼▼
    function calculateYangJiu(monthStem, gender) {
    const rule = YANG_JIU_RULES[monthStem];
    if (!rule) return [];
    const { startBranch, firstAge } = rule;
    const direction = (gender === '男') ? 1 : -1;
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);
    const limits = [];
    for (let i = 0; i < 12; i++) {
        const palaceIndex = (startPalaceIndex + i * direction + 144) % 12;
        const palaceId = VALID_PALACES_CLOCKWISE[palaceIndex];
        const ageStart = (i === 0) ? 1 : firstAge + ((i - 1) * 10) + 1;
        const ageEnd = (i === 0) ? firstAge : ageStart + 9;
        limits.push({ palaceId, ageRange: `${ageStart}-${ageEnd}` });
    }
    return limits;
    }
    // ▼▼▼ 計算「百六大限」(完整序列)的函式 ▼▼▼
    function calculateBaiLiuLimit(shouQiGong, gender) {
    if (!shouQiGong || !shouQiGong.palace) return [];
    const shouQiStem = shouQiGong.palace.charAt(0);
    const rule = YANG_JIU_RULES[shouQiStem];
    if (!rule) return [];
    const { startBranch, firstAge } = rule;
    const direction = (gender === '男') ? 1 : -1;
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);
    const limits = [];
    for (let i = 0; i < 12; i++) {
        const palaceIndex = (startPalaceIndex + i * direction + 144) % 12;
        const palaceId = VALID_PALACES_CLOCKWISE[palaceIndex];
        const ageStart = (i === 0) ? 1 : firstAge + ((i - 1) * 10) + 1;
        const ageEnd = (i === 0) ? firstAge : ageStart + 9;
        limits.push({ palaceId, ageRange: `${ageStart}-${ageEnd}` });
    }
    return limits;
    }
    // ▼▼▼ 計算「百六小限」(24年範圍)的函式 ▼▼▼
    function calculateBaiLiuXiaoXian(shouQiGong, gender, currentUserAge) {
    if (!shouQiGong || !shouQiGong.palace || currentUserAge === undefined) {
        return {};
    }

    const shouQiStem = shouQiGong.palace.charAt(0);
    const rule = BAI_LIU_XIAO_XIAN_RULES[shouQiStem];
    if (!rule) return {};

    const { startBranch, startAge } = rule;
    // 注意：這裡的方向和陽九/百六「大限」相反
    const direction = (gender === '男') ? -1 : 1; // 男逆女順
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);

    const results = {}; // 最終結果，例如：{ pMao: [50, 62], pChen: [51, 63], ... }

    // 根據您的要求，計算從過去5年到未來18年，共24年的資料
    for (let age = currentUserAge - 5; age <= currentUserAge + 18; age++) {
        if (age < 1) continue; // 我們只計算1歲以後的資料

        const ageOffset = age - startAge; // 計算與起始歲數的差距
        // 根據差距和方向，計算出該歲數落在哪個宮位
        const palaceIndex = (startPalaceIndex + ageOffset * direction + 144) % 12;
        const palaceId = VALID_PALACES_CLOCKWISE[palaceIndex];

        // 將歲數加入到對應宮位的列表中
        if (!results[palaceId]) {
            results[palaceId] = [];
        }
        results[palaceId].push(age);
    }
    return results;
    }
    // ▼▼▼ 計算「大遊真限」(完整序列)的函式 ▼▼▼
    function calculateDaYouZhenXian(hourBranch) {
    if (!hourBranch) return [];
    const startBranch = ZHI_SIX_HARMONIES[hourBranch];
    if (!startBranch) return [];
    const startSequenceIndex = DA_YOU_SEQUENCE.indexOf(startBranch);
    if (startSequenceIndex === -1) return [];
    
    const limits = [];
    let ageTracker = 1;
    for (let i = 0; i < DA_YOU_SEQUENCE.length; i++) {
        const sequenceIndex = (startSequenceIndex + i) % 12;
        const currentBranch = DA_YOU_SEQUENCE[sequenceIndex];
        const duration = DA_YOU_DURATIONS[currentBranch];
        const ageStart = ageTracker;
        const ageEnd = ageTracker + duration - 1;
        limits.push({ palaceId: BRANCH_TO_PALACE_ID[currentBranch], ageRange: `${ageStart}-${ageEnd}` });
        ageTracker = ageEnd + 1;
    }
    return limits;
    }
    // ▼▼▼ 計算「飛祿大限」(當前及未來兩個)的函式 ▼▼▼
    function calculateFeiLuDaXian(yearStem, currentUserAge) {
    if (!yearStem || currentUserAge === undefined) return [];

    const rule = FEI_LU_LIMIT_RULES[yearStem];
    if (!rule) return [];

    const { startBranch, firstAge } = rule;
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);
    if (startPalaceIndex === -1) return [];

    const results = [];
    let currentPalaceIndex = startPalaceIndex;
    let currentAgeStart = 1;
    let currentAgeEnd = firstAge;

    // 1. 先快速定位到包含當前歲數的大限
    if (currentUserAge > firstAge) {
        const ageAfterFirst = currentUserAge - firstAge;
        const steps = Math.floor((ageAfterFirst - 1) / 10);
        
        currentPalaceIndex = (startPalaceIndex + steps + 1) % 12;
        currentAgeStart = firstAge + (steps * 10) + 1;
        currentAgeEnd = currentAgeStart + 9;
    }

    // 2. 從當前大限開始，連續產生 3 組資料
    for (let i = 0; i < 3; i++) {
        const palaceIndex = (currentPalaceIndex + i) % 12;
        const palaceId = VALID_PALACES_CLOCKWISE[palaceIndex];
        
        results.push({
            palaceId: palaceId,
            text: `飛祿${currentAgeStart}-${currentAgeEnd}`
        });

        // 為下一個大限準備年齡
        currentAgeStart = currentAgeEnd + 1;
        currentAgeEnd = currentAgeStart + 9;
    }

    return results;
    }
    // ▼▼▼ 計算「飛馬大限」(當前及未來兩個)的函式 ▼▼▼
    function calculateFeiMaDaXian(yearStem, currentUserAge) {
    if (!yearStem || currentUserAge === undefined) return [];

    const rule = FEI_LU_LIMIT_RULES[yearStem]; // 共用「飛祿」的規則表
    if (!rule) return [];

    const { startBranch, firstAge } = rule;
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);
    if (startPalaceIndex === -1) return [];

    const direction = -1; // 唯一的不同：方向永遠是逆時鐘 (-1)
    const results = [];
    let currentPalaceIndex = startPalaceIndex;
    let currentAgeStart = 1;
    let currentAgeEnd = firstAge;

    // 1. 先快速定位到包含當前歲數的大限
    if (currentUserAge > firstAge) {
        const ageAfterFirst = currentUserAge - firstAge;
        const steps = Math.floor((ageAfterFirst - 1) / 10);
        
        currentPalaceIndex = (startPalaceIndex + (steps + 1) * direction + 144) % 12;
        currentAgeStart = firstAge + (steps * 10) + 1;
        currentAgeEnd = currentAgeStart + 9;
    }

    // 2. 從當前大限開始，連續產生 3 組資料
    for (let i = 0; i < 3; i++) {
        const palaceIndex = (currentPalaceIndex + i * direction + 144) % 12;
        const palaceId = VALID_PALACES_CLOCKWISE[palaceIndex];
        
        results.push({
            palaceId: palaceId,
            text: `飛馬${currentAgeStart}-${currentAgeEnd}` // 前綴文字改為「飛馬」
        });

        // 為下一個大限準備年齡
        currentAgeStart = currentAgeEnd + 1;
        currentAgeEnd = currentAgeStart + 9;
    }

    return results;
    }
    // ▼▼▼ 計算「飛祿流年」(包含官祿宮停留3年邏輯)的函式 ▼▼▼
    function calculateFeiLuLiuNian(yearStem, dayStem, gender, currentUserAge, arrangedLifePalaces) {
    if (!yearStem || !dayStem || currentUserAge === undefined || !arrangedLifePalaces) return [];

    // 1. 根據「日柱天干」和性別，判斷順逆方向
    const yangStems = ['甲', '丙', '戊', '庚', '壬'];
    const isDayStemYang = yangStems.includes(dayStem);
    const direction = ((isDayStemYang && gender === '男') || (!isDayStemYang && gender === '女')) ? 1 : -1;

    // 2. 根據「年柱天干」查找起點
    const rule = FEI_LU_ANNUAL_RULES[yearStem];
    if (!rule) return [];
    const { startBranch, startAge } = rule;
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);

    // 3. 找到官祿宮在十二宮順序中的索引
    const guanLuPalaceIndex = arrangedLifePalaces.indexOf('官');
    
    // 4. 建立從1歲到未來的「歲數 -> 宮位ID」的完整對應地圖
    const ageToPalaceMap = {};
    let currentAge = startAge;
    let currentPalaceIndex = startPalaceIndex;
    
    // 迴圈推算約150年，確保涵蓋所有年齡
    for (let i = 0; i < 150; i++) {
        const palaceId = VALID_PALACES_CLOCKWISE[currentPalaceIndex];
        ageToPalaceMap[currentAge] = palaceId;
        
        // 檢查當前宮位是否為官祿宮
        if (currentPalaceIndex === guanLuPalaceIndex) {
            // 如果是，則接下來的兩年都停留在同一個宮位
            ageToPalaceMap[currentAge + 1] = palaceId;
            ageToPalaceMap[currentAge + 2] = palaceId;
            currentAge += 3; // 歲數直接跳3年
        } else {
            currentAge += 1; // 正常情況，歲數+1
        }
        // 根據方向，換到下一個宮位
        currentPalaceIndex = (currentPalaceIndex + direction + 12) % 12;
    }

    // 5. 根據建好的地圖，找出當前和未來6年的資訊
    const results = [];
    let processedAges = {}; // 用來處理官祿宮的重複情況

    for (let i = 0; i < ANNUAL_LIMIT_DISPLAY_YEARS; i++) {
        const age = currentUserAge + i;
        if (processedAges[age]) continue; // 如果這個歲數已經處理過，就跳過

        const palaceId = ageToPalaceMap[age];
        if (!palaceId) continue;

        // 檢查這個宮位是否是官祿宮，以決定顯示格式
        if (VALID_PALACES_CLOCKWISE.indexOf(palaceId) === guanLuPalaceIndex) {
            // 如果是官祿宮，找到這個3年區間的起始和結束歲數
            let rangeStart = age;
            while(ageToPalaceMap[rangeStart - 1] === palaceId) {
                rangeStart--;
            }
            const rangeEnd = rangeStart + 2;
            results.push({ palaceId, text: `祿${rangeStart}-${rangeEnd}` });
            
            // 標記這三年都已經處理完畢
            processedAges[rangeStart] = true;
            processedAges[rangeStart + 1] = true;
            processedAges[rangeStart + 2] = true;

        } else {
            results.push({ palaceId, text: `祿${age}` });
            processedAges[age] = true;
        }
    }
    
    return results;
    }
    // ▼▼▼ 計算「飛馬流年」(包含疾厄宮停留3年邏輯)的函式 ▼▼▼
    function calculateFeiMaLiuNian(hourStem, dayStem, gender, currentUserAge, arrangedLifePalaces) {
    // 檢查傳入的參數是否完整，若不完整則返回空陣列
    if (!hourStem || !dayStem || currentUserAge === undefined || !arrangedLifePalaces || arrangedLifePalaces.length === 0) {
        return [];
    }

    // 1. 根據「日柱天干」和性別，判斷順逆方向 (與飛祿流年規則相反)
    const yangStems = ['甲', '丙', '戊', '庚', '壬'];
    const isDayStemYang = yangStems.includes(dayStem);
    const direction = ((isDayStemYang && gender === '男') || (!isDayStemYang && gender === '女')) ? -1 : 1;

    // 2. 根據「時柱天干」查找起點
    const rule = FEI_LU_ANNUAL_RULES[hourStem];
    if (!rule) {
        return []; // 如果找不到規則，返回空陣列
    }
    const { startBranch, startAge } = rule;
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);

    // 3. 找到「疾厄宮」的位置
    const jiEPalaceIndex = arrangedLifePalaces.indexOf('疾');
    if (jiEPalaceIndex === -1) {
        return []; // 如果找不到疾厄宮，返回空陣列
    }
    
    // 4. 建立從1歲到未來的「歲數 -> 宮位ID」的完整對應地圖
    const ageToPalaceMap = {};
    let currentAge = startAge;
    let currentPalaceIndex = startPalaceIndex;
    
    for (let i = 0; i < 150; i++) {
        const palaceId = VALID_PALACES_CLOCKWISE[currentPalaceIndex];
        ageToPalaceMap[currentAge] = palaceId;
        
        // 檢查當前宮位是否為疾厄宮
        if (currentPalaceIndex === jiEPalaceIndex) {
            ageToPalaceMap[currentAge + 1] = palaceId;
            ageToPalaceMap[currentAge + 2] = palaceId;
            currentAge += 3;
        } else {
            currentAge += 1;
        }
        currentPalaceIndex = (currentPalaceIndex + direction + 12) % 12;
    }

    // 5. 根據地圖，找出當前和未來6年的資訊
    const results = [];
    let processedAges = {};

    for (let i = 0; i < ANNUAL_LIMIT_DISPLAY_YEARS; i++) {
        const age = currentUserAge + i;
        if (processedAges[age]) continue;

        const palaceId = ageToPalaceMap[age];
        if (!palaceId) continue;

        if (VALID_PALACES_CLOCKWISE.indexOf(palaceId) === jiEPalaceIndex) {
            let rangeStart = age;
            while(ageToPalaceMap[rangeStart - 1] === palaceId) {
                rangeStart--;
            }
            const rangeEnd = rangeStart + 2;
            results.push({ palaceId, text: `馬${rangeStart}-${rangeEnd}` });
            processedAges[rangeStart] = true;
            processedAges[rangeStart + 1] = true;
            processedAges[rangeStart + 2] = true;
        } else {
            results.push({ palaceId, text: `馬${age}` });
            processedAges[age] = true;
        }
    }
    
    return results;
    }
    // ▼▼▼ 計算「黑符」流年的函式 ▼▼▼
    function calculateHeiFu(hourStem, currentUserAge) {
    if (!hourStem || currentUserAge === undefined) return {};

    // 1. 根據「時柱天干」查找起始宮位地支
    const startBranch = HEI_FU_RULES[hourStem];
    if (!startBranch) return {};

    const startAge = 1; // 起始歲數固定為1歲
    const direction = 1; // 方向固定為順時鐘
    const startPalaceIndex = EARTHLY_BRANCHES.indexOf(startBranch);

    const results = {}; // 最終結果，例如：{ pChen: [50], pSi: [51], ... }

    // 2. 根據 ANNUAL_LIMIT_DISPLAY_YEARS 的設定，計算對應年份的資料
    for (let i = 0; i < ANNUAL_LIMIT_DISPLAY_YEARS; i++) {
        const age = currentUserAge + i;
        if (age < 1) continue;

        const ageOffset = age - startAge; // 計算與起始歲數的差距
        // 根據差距和方向，計算出該歲數落在哪個宮位
        const palaceIndex = (startPalaceIndex + ageOffset * direction + 12) % 12;
        const palaceId = VALID_PALACES_CLOCKWISE[palaceIndex];

        // 將歲數加入到對應宮位的列表中
        if (!results[palaceId]) {
            results[palaceId] = [];
        }
        results[palaceId].push(age);
    }
    return results;
    }
    // ▼▼▼ 計算「受氣之數」與「受氣之宮」的函式 ▼▼▼
    function calculateShouQi(dayPillar, hourPillar) {
    // 1. 從資料庫查找日柱和時柱的天地生成數
    const dayNum = GANZI_GENERATION_NUMBERS[dayPillar];
    const hourNum = GANZI_GENERATION_NUMBERS[hourPillar];

    // 如果找不到資料，則返回錯誤訊息
    if (dayNum === undefined || hourNum === undefined) {
        return { palace: '查無資料', number: '' };
    }

    // 2. 根據公式計算「受氣之數」
    const shouQiNumberRaw = (dayNum + hourNum + 55) % 60;
    // 處理餘數為 0 的情況，根據規則應視為 60
    const shouQiNumber = (shouQiNumberRaw === 0) ? 60 : shouQiNumberRaw;
    
    // 3. 查找日柱在六十甲子順序中的位置
    const startIndex = JIAZI_CYCLE_ORDER.indexOf(dayPillar);
    if (startIndex === -1) {
        return { palace: '順序錯誤', number: shouQiNumber };
    }
    
    // 4. 從起始位置開始「逆數」，找到「受氣之宮」
    // 逆數 N 位，且起始位算1，相當於索引值減去 (N-1)
    const palaceIndex = (startIndex - (shouQiNumber - 1) + 60) % 60;
    const shouQiPalace = JIAZI_CYCLE_ORDER[palaceIndex];

    return { palace: shouQiPalace, number: shouQiNumber };
    }
    // ▼▼▼ 計算「出生卦」的函式 ▼▼▼
    function calculateBirthHexagram(yearPillar, monthPillar, dayPillar, hourPillar) {
    // 1. 從資料庫查找四柱的天地生成數
    const yearNum = GANZI_GENERATION_NUMBERS[yearPillar];
    const monthNum = GANZI_GENERATION_NUMBERS[monthPillar];
    const dayNum = GANZI_GENERATION_NUMBERS[dayPillar];
    const hourNum = GANZI_GENERATION_NUMBERS[hourPillar];

    // 安全檢查，如果任一柱的資料找不到，則返回錯誤
    if ([yearNum, monthNum, dayNum, hourNum].includes(undefined)) {
        return { name: '資料錯誤', symbol: '' };
    }

    // 2. 根據公式計算總和，再除以64取餘數
    const remainder = (yearNum + monthNum + dayNum + hourNum + 55) % 64;
    
    // 3. 處理餘數為 0 的情況，根據易經順序，餘 0 應為第 64 卦
    const hexagramNumber = (remainder === 0) ? 64 : remainder;

    // 4. 從 I_CHING_HEXAGRAMS 陣列中找出對應的卦
    // (陣列索引是從 0 開始，所以要用卦的編號減 1)
    const hexagram = I_CHING_HEXAGRAMS[hexagramNumber - 1];

    return hexagram || { name: '計算錯誤', symbol: '' };
    }
    // ▼▼▼ 計算「立業卦」的函式 ▼▼▼
    function calculateLiYeHexagram(shouQiGong, birthHexagram) {
    if (!shouQiGong || !birthHexagram || !birthHexagram.symbol) {
        return null;
    }

    const shouQiStem = shouQiGong.charAt(0);
    const shouQiBranch = shouQiGong.charAt(1);
    const yangStems = ['甲', '丙', '戊', '庚', '壬'];
    const isYang = yangStems.includes(shouQiStem);

    // 1. 取得出生卦的數位化爻象 (例如 "110011")
    const originalYaoStr = HEXAGRAM_DATA[birthHexagram.symbol];
    if (!originalYaoStr) return { name: '卦象資料錯誤', symbol: '' };

    // 2. 根據陰陽干，找出目標爻(陽爻或陰爻)的位置
    const targetYaoType = isYang ? '1' : '0';
    let targetYaoIndices = [];
    for (let i = 0; i < originalYaoStr.length; i++) {
        if (originalYaoStr[i] === targetYaoType) {
            targetYaoIndices.push(i); // 儲存爻的索引 (0到5)
        }
    }
    
    // 如果是陰干，爻的順序要由上往下
    if (!isYang) {
        targetYaoIndices.reverse();
    }

    // 如果找不到任何可以變的爻，直接返回
    if (targetYaoIndices.length === 0) {
        return { name: '無爻可變', symbol: '' };
    }

    // 3. 計算從子到受氣地支的步數
    const startIndex = EARTHLY_BRANCHES.indexOf('子');
    const endIndex = EARTHLY_BRANCHES.indexOf(shouQiBranch);
    const steps = (endIndex - startIndex + 12) % 12 + 1; // 加1是因為"子"算第一步

    // 4. 循環計數，找到要變的那個爻
    const stopIndex = (steps - 1) % targetYaoIndices.length;
    const yaoToChangeIndex = targetYaoIndices[stopIndex];

    // 5. 執行爻變 (陽變陰，陰變陽)
    let yaoArray = originalYaoStr.split('');
    yaoArray[yaoToChangeIndex] = (yaoArray[yaoToChangeIndex] === '1') ? '0' : '1';
    const newYaoStr = yaoArray.join('');

    // 6. 根據新的爻象字串，反向查找對應的卦
    const newSymbol = Object.keys(HEXAGRAM_DATA).find(key => HEXAGRAM_DATA[key] === newYaoStr);
    const liYeHexagram = I_CHING_HEXAGRAMS.find(h => h.symbol === newSymbol);

    return liYeHexagram || { name: '查無此卦', symbol: '' };
    }
    // ▼▼▼ 計算「流年卦」的函式 ▼▼▼
    function calculateAnnualHexagram(birthHexagram, currentUserAge) {
    if (!birthHexagram || !birthHexagram.number || currentUserAge === undefined) {
        return null;
    }

    // 1. 將出生卦編號與當前歲數相加
    const sum = birthHexagram.number + currentUserAge;

    // 2. 如果總和超過 64，則除以 64 取餘數
    let annualHexagramNumber;
    if (sum > 64) {
        const remainder = sum % 64;
        annualHexagramNumber = (remainder === 0) ? 64 : remainder; // 餘數為 0 代表第 64 卦
    } else {
        annualHexagramNumber = sum;
    }

    // 3. 從64卦資料庫中找到對應的卦 (陣列索引需減 1)
    const annualHexagram = I_CHING_HEXAGRAMS[annualHexagramNumber - 1];

    return annualHexagram || { name: '計算錯誤', symbol: '' };
    }
    // ▼▼▼ 計算「立業之期」歲數的函式 ▼▼▼
    function calculateLiYeStartAge(birthHexagram) {
    // 安全檢查，如果沒有傳入出生卦資料，則返回 null
    if (!birthHexagram || !birthHexagram.symbol) {
        return null;
    }
    
    // 1. 從數位化資料庫中，找到出生卦的爻象字串 (例如 "100010")
    const yaoString = HEXAGRAM_DATA[birthHexagram.symbol];
    if (!yaoString || yaoString.length !== 6) {
        return null; // 如果資料錯誤或不完整，也返回 null
    }

    // 2. 遍歷爻象字串，計算總年數 (陽爻為9年，陰爻為6年)
    let totalYears = 0;
    for (const yao of yaoString) {
        if (yao === '1') { // '1' 代表陽爻
            totalYears += 9;
        } else { // '0' 代表陰爻
            totalYears += 6;
        }
    }

    // 3. 根據規則，最終年紀是總年數 + 1
    return totalYears + 1;
    }
    // ▼▼▼ 計算「流年變卦」的函式 (已修正) ▼▼▼
    function calculateAnnualChangingHexagram(annualHexagram, baiLiuLimitResult, currentUserAge) {
    if (!annualHexagram || !Array.isArray(baiLiuLimitResult) || !currentUserAge) return null;

    // ▼▼▼ 核心修正點：從傳入的「陣列」中，找出當前歲數所在的大限 ▼▼▼
    const currentLimit = baiLiuLimitResult.find(limit => {
        if (!limit.ageRange) return false;
        const [start, end] = limit.ageRange.split('-').map(Number);
        return currentUserAge >= start && currentUserAge <= end;
    });
    
    // 如果找不到對應的大限 (例如歲數超出範圍)，則中止
    if (!currentLimit || !currentLimit.palaceId) return null;

    const currentPalaceId = currentLimit.palaceId;
    const currentBranch = PALACE_ID_TO_BRANCH[currentPalaceId];
    
    // 2. 判斷宮位地支的陰陽
    const isYangBranch = YANG_BRANCHES.includes(currentBranch);
    
    // 3. 獲取流年卦的爻象 ("110011")
    const originalYaoStr = HEXAGRAM_DATA[annualHexagram.symbol];
    if (!originalYaoStr) return { name: '卦象資料錯誤', symbol: '' };

    // 4. 根據陰陽，找出所有可變的爻
    const targetYaoType = isYangBranch ? '1' : '0';
    let targetYaoIndices = [];
    for (let i = 0; i < originalYaoStr.length; i++) {
        if (originalYaoStr[i] === targetYaoType) {
            targetYaoIndices.push(i);
        }
    }

    // 如果沒有可變的爻，則流年變卦與流年卦相同
    if (targetYaoIndices.length === 0) {
        return annualHexagram;
    }

    // 如果是陰支，數爻的順序要「由上往下」
    if (!isYangBranch) {
        targetYaoIndices.reverse();
    }

    // 5. 計算從「子」到目標地支的步數
    const steps = (EARTHLY_BRANCHES.indexOf(currentBranch) - EARTHLY_BRANCHES.indexOf('子') + 12) % 12 + 1;

    // 6. 循環計數，找到要變的那個爻的索引
    const stopIndexInTargets = (steps - 1) % targetYaoIndices.length;
    const yaoToChangeIndex = targetYaoIndices[stopIndexInTargets];

    // 7. 執行爻變
    let yaoArray = originalYaoStr.split('');
    yaoArray[yaoToChangeIndex] = (yaoArray[yaoToChangeIndex] === '1') ? '0' : '1';
    const newYaoStr = yaoArray.join('');

    // 8. 根據新的爻象，反向查找對應的卦
    const newSymbol = Object.keys(HEXAGRAM_DATA).find(key => HEXAGRAM_DATA[key] === newYaoStr);
    const changingHexagram = I_CHING_HEXAGRAMS.find(h => h.symbol === newSymbol);

    return changingHexagram || { name: '查無此卦', symbol: '' };
    }
    // ▼▼▼ 計算「流年十二月卦」的函式 ▼▼▼
    function calculateMonthlyHexagrams(annualHexagramNumber) {
    if (!annualHexagramNumber) return [];
    
    const monthlyHexagrams = [];
    const baseNumber = annualHexagramNumber + 2;

    for (let i = 1; i <= 12; i++) {
        const rawNumber = baseNumber + i;
        let finalNumber = rawNumber;
        if (rawNumber > 64) {
            const remainder = rawNumber % 64;
            finalNumber = (remainder === 0) ? 64 : remainder;
        }
        
        // 從 I_CHING_HEXAGRAMS 陣列中找出對應的卦
        const hexagram = I_CHING_HEXAGRAMS[finalNumber - 1];
        if (hexagram) {
            monthlyHexagrams.push({
                monthName: MONTH_NAMES_CHINESE[i-1],
                hexagram: hexagram
            });
        }
    }
    return monthlyHexagrams;
    }
    // ▼▼▼ 格式化「流年十二月卦」顯示文字的函式 (已修正排版) ▼▼▼ 
    function formatMonthlyHexagrams(monthlyHexagramsResult) {
    if (!monthlyHexagramsResult || monthlyHexagramsResult.length === 0) return '';

    const currentYear = new Date().getFullYear();
    let text = '\n\n'; // 在前面加上兩個換行符，與上方內容隔開

    monthlyHexagramsResult.forEach(item => {
        // 用 \n 換行符和空格縮排，來確保格式與流年卦一致
        text += `  <strong>${currentYear}年${item.monthName}卦:</strong> `;
        text += `${item.hexagram.number} ${item.hexagram.name} ${item.hexagram.symbol}\n`;
        text += `  <span class="hexagram-description-style">↳ ${item.hexagram.description}</span>\n\n`;
    });
    return text;
    }
    // ▼▼▼ 建立圖表模型函式 (已整合「中宮寄宮」邏輯) ▼▼▼
    function buildChartModel(data) {
    let model = {};
    // 1. 初始化模型，包含所有16個宮位 + 中宮
    Object.values(BRANCH_TO_PALACE_ID).forEach(pId => {
        model[pId] = { stars: {}, patterns: [] };
    });
    model['pCenter'] = { stars: {}, patterns: [] };

    // 2. 收集所有在16宮的星曜
    const allStars = {
        '太乙': data.lookupResult?.太乙, '文昌': data.lookupResult?.文昌, '始擊': data.lookupResult?.始擊, '定目': data.lookupResult?.定目,
        '小遊': data.xiaoYouResult, '大遊': data.daYouResult, '時五福': data.shiWuFuResult, '計神': data.deitiesResult?.計神,
        '主大': data.suanStarsResult?.chartStars['主大'], '主參': data.suanStarsResult?.chartStars['主參'],
        '客大': data.suanStarsResult?.chartStars['客大'], '客參': data.suanStarsResult?.chartStars['客參'],
        '定大': data.suanStarsResult?.chartStars['定大'], '定參': data.suanStarsResult?.chartStars['定參'],
        '天乙': data.tianYiResult, '地乙': data.diYiResult, '四神': data.siShenResult, '飛符': data.feiFuResult,
        '皇恩星': data.huangEnResult, '君基': data.junJiResult, '臣基': data.chenJiResult, '民基': data.minJiResult
    };
    for (const starName in allStars) {
        if (EXCLUDED_STARS_FROM_ANALYSIS.includes(starName)) continue;
        const branch = allStars[starName];
        if (branch) {
            const palaceId = BRANCH_TO_PALACE_ID[branch];
            if (palaceId && model[palaceId]) {
                if (!model[palaceId].stars[starName]) {
                    model[palaceId].stars[starName] = { name: starName, strength: '', huaYao: [] };
                }
            }
        }
    }
    
    // ▼▼▼ 唯一的修改點：處理中宮星曜時，加入「寄宮」判斷 ▼▼▼
    if (data.suanStarsResult?.centerStars) {
        const zhuSuan = data.lookupResult?.主算;
        const keSuan = data.lookupResult?.客算;

        data.suanStarsResult.centerStars.forEach(starName => {
            let hostBranch = null; // 預設沒有寄宮

            if (['主大', '主參'].includes(starName) && zhuSuan && CENTER_PALACE_JI_GONG_RULES['主算'][zhuSuan]) {
                hostBranch = CENTER_PALACE_JI_GONG_RULES['主算'][zhuSuan][starName];
            } else if (['客大', '客參'].includes(starName) && keSuan && CENTER_PALACE_JI_GONG_RULES['客算'][keSuan]) {
                hostBranch = CENTER_PALACE_JI_GONG_RULES['客算'][keSuan][starName];
            }
            
            if (hostBranch) { // 如果找到了寄宮的位置
                const hostPalaceId = BRANCH_TO_PALACE_ID[hostBranch];
                if (hostPalaceId && model[hostPalaceId]) {
                    if (!model[hostPalaceId].stars[starName]) {
                        model[hostPalaceId].stars[starName] = { name: starName, strength: '', huaYao: [] };
                    }
                }
            } else { // 如果沒有寄宮規則，則仍然放入中宮
                if (!model['pCenter'].stars[starName]) {
                    model['pCenter'].stars[starName] = { name: starName, strength: '', huaYao: [] };
                }
            }
        });
    }
    const huaYaoResults = calculateAllHuaYao(data.yearPillar.charAt(0), data.dayPillar.charAt(0), data.dayPillar.charAt(1));
    const starToHuaYaoMap = {};
    if (huaYaoResults) {
        Object.keys(huaYaoResults).forEach(sourceType => {
            const roles = huaYaoResults[sourceType];
            Object.keys(roles).forEach(roleName => {
                const starNames = roles[roleName].split(' ').filter(Boolean);
                starNames.forEach(starName => {
                    if (!starToHuaYaoMap[starName]) starToHuaYaoMap[starName] = [];
                    const chineseRoleName = HUA_YAO_ROLE_MAP[roleName];
                    if (chineseRoleName && !starToHuaYaoMap[starName].includes(chineseRoleName)) {
                        starToHuaYaoMap[starName].push(chineseRoleName);
                    }
                });
            });
        });
    }
    Object.keys(model).forEach(palaceId => {
        const branch = PALACE_ID_TO_BRANCH[palaceId];
        Object.keys(model[palaceId].stars).forEach(starName => {
            if (STAR_STRENGTH_DATA[starName] && STAR_STRENGTH_DATA[starName][branch]) {
                model[palaceId].stars[starName].strength = STAR_STRENGTH_DATA[starName][branch];
            }
            if (starToHuaYaoMap[starName]) {
                model[palaceId].stars[starName].huaYao = starToHuaYaoMap[starName];
            }
        });
    });
    const xiaoYouPalaceId = BRANCH_TO_PALACE_ID[allStars['小遊']];
    if (xiaoYouPalaceId && model[xiaoYouPalaceId]) {
        const xiaoYouIndex = EARTHLY_BRANCHES.indexOf(allStars['小遊']);
        const wenChangIndex = EARTHLY_BRANCHES.indexOf(allStars['文昌']);
        const shiJiIndex = EARTHLY_BRANCHES.indexOf(allStars['始擊']);
        if (model[xiaoYouPalaceId].stars['始擊']) model[xiaoYouPalaceId].patterns.push({ type: '掩', primary: '小遊', secondary: '始擊' });
        const qiuStars = ['文昌', '主大', '主參', '客大', '客參'];
        const qiuTrigger = qiuStars.find(s => model[xiaoYouPalaceId].stars[s]);
        if (qiuTrigger) model[xiaoYouPalaceId].patterns.push({ type: '囚', primary: '小遊', secondary: qiuTrigger });
        if (wenChangIndex !== -1) {
            if (wenChangIndex === (xiaoYouIndex + 1) % 12 || wenChangIndex === (xiaoYouIndex - 1 + 12) % 12) model[xiaoYouPalaceId].patterns.push({ type: '迫', primary: '小遊', secondary: '文昌' });
            if (wenChangIndex === (xiaoYouIndex + 6) % 12) model[xiaoYouPalaceId].patterns.push({ type: '對', primary: '小遊', secondary: '文昌' });
        }
        if (shiJiIndex !== -1) {
            if (shiJiIndex === (xiaoYouIndex + 1) % 12 || shiJiIndex === (xiaoYouIndex - 1 + 12) % 12) model[xiaoYouPalaceId].patterns.push({ type: '擊', primary: '小遊', secondary: '始擊' });
            if (shiJiIndex === (xiaoYouIndex + 6) % 12) model[xiaoYouPalaceId].patterns.push({ type: '格', primary: '小遊', secondary: '始擊' });
        }
    }
    Object.keys(model).forEach(palaceId => {
        const starsInPalace = Object.keys(model[palaceId].stars);
        const suanStarsInPalace = starsInPalace.filter(s => ['主大', '主參', '客大', '客參'].includes(s));
        if (starsInPalace.includes('文昌') && (starsInPalace.includes('客大') || starsInPalace.includes('客參'))) {
            model[palaceId].patterns.push({ type: '關', primary: '文昌', secondary: starsInPalace.find(s => s === '客大' || s === '客參') });
        }
        if (starsInPalace.includes('始擊') && (starsInPalace.includes('主大') || starsInPalace.includes('主參'))) {
            model[palaceId].patterns.push({ type: '關', primary: '始擊', secondary: starsInPalace.find(s => s === '主大' || s === '主參') });
        }
        if (suanStarsInPalace.length >= 2) {
            model[palaceId].patterns.push({ type: '關', primary: suanStarsInPalace[0], secondary: suanStarsInPalace[1] });
        }
    });

    return model;
    }
    // ▼▼▼ 格式化「格局」資訊的專屬函式 (用於左側摘要區) ▼▼▼
    function formatPatternInfo(palaceModel, arrangedLifePalaces) {
    let outputLines = [];
    const palaceFullNameMap = { '命':'命宮', '兄':'兄弟宮', '妻':'夫妻宮', '孫':'子孫宮', '財':'財帛宮', '田':'田宅宮', '官':'官祿宮', '奴':'奴僕宮', '疾':'疾厄宮', '福':'福德宮', '貌':'相貌宮', '父':'父母宮' };

    Object.keys(palaceModel).forEach(palaceId => {
        const palaceData = palaceModel[palaceId];
        if (palaceData.patterns.length > 0) {
            const palaceIndex = VALID_PALACES_CLOCKWISE.indexOf(palaceId);
            if (palaceIndex === -1) return;
            
            const palaceShortName = arrangedLifePalaces[palaceIndex];
            const palaceFullName = palaceFullNameMap[palaceShortName] || palaceShortName;

            palaceData.patterns.forEach(p => {
                outputLines.push(`${palaceFullName}：${p.secondary} <span class="pattern-style">${p.type}</span> ${p.primary}`);
            });
        }
    });

    if (outputLines.length > 0) {
        return `\n  格局 : ${outputLines.join('、 ')}`;
    }
    return `\n  格局 : 無掩迫關囚擊格對`;
    }
    // ▼▼▼ 格式化下方資訊區 (全新排序與合併邏輯版) ▼▼▼
    function formatBottomInfoBox(chartModel, arrangedLifePalaces, sdrData) {
    let htmlParts = [];
    const palaceFullNameMap = { '命':'命宮', '兄':'兄弟宮', '妻':'夫妻宮', '孫':'子孫宮', '財':'財帛宮', '田':'田宅宮', '官':'官祿宮', '奴':'奴僕宮', '疾':'疾厄宮', '福':'福德宮', '貌':'相貌宮', '父':'父母宮' };

    // 1. 按照十二宮職的標準順序進行遍歷
    LIFE_PALACE_NAMES.forEach(shortName => {
        const palaceFullName = palaceFullNameMap[shortName] || shortName;
        const palaceIndex = arrangedLifePalaces.indexOf(shortName);
        if (palaceIndex === -1) return;

        const palaceId = VALID_PALACES_CLOCKWISE[palaceIndex];
        let palaceData = chartModel[palaceId];
        
        // 2. 收集本宮及寄宮的所有星曜
        let allStarsInPalace = [...Object.values(palaceData.stars)];
        const guestPalaceId = Object.keys(JI_GONG_MAP).find(key => JI_GONG_MAP[key] === palaceId);
        if (guestPalaceId && chartModel[guestPalaceId]) {
            allStarsInPalace.push(...Object.values(chartModel[guestPalaceId].stars));
        }

        // 3. 過濾掉被排除的星曜
        let coreStars = allStarsInPalace.filter(star => !EXCLUDED_STARS_FROM_ANALYSIS.includes(star.name));


        // 4. 如果宮位為空，則去對宮借星
        if (coreStars.length === 0) {
            const oppositePalaceId = OPPOSITE_PALACE_MAP[palaceId];
            if (oppositePalaceId && chartModel[oppositePalaceId]) {
                const oppositePalaceData = chartModel[oppositePalaceId];
                let borrowedStars = [...Object.values(oppositePalaceData.stars)];
                const oppositeGuestPalaceId = Object.keys(JI_GONG_MAP).find(key => JI_GONG_MAP[key] === oppositePalaceId);
                if (oppositeGuestPalaceId && chartModel[oppositeGuestPalaceId]) {
                    borrowedStars.push(...Object.values(chartModel[oppositeGuestPalaceId].stars));
                }
                // 借來的星也要過濾
                coreStars = borrowedStars.filter(star => !EXCLUDED_STARS_FROM_ANALYSIS.includes(star.name));
            }
        }

    if (coreStars.length > 0) {
            // 2. 組合宮位標題 (合併身、日、時宮)
            let titleParts = [palaceFullName];
            if (sdrData[palaceId]?.includes('身')) titleParts.push('<span class="sdr-palace-highlight">身宮</span>');
            if (sdrData[palaceId]?.includes('日')) titleParts.push('<span class="sdr-palace-highlight">日宮</span>');
            if (sdrData[palaceId]?.includes('時')) titleParts.push('<span class="sdr-palace-highlight">時宮</span>');
            const title = `<strong>${titleParts.join('/')}:</strong>`;

            // 3. 為每一顆星建立獨立的條目
            let starEntriesHtml = '';
            coreStars.forEach(star => {
                let details = [];
                if (star.strength) details.push(star.strength);
                if (star.huaYao.length > 0) details.push(star.huaYao.join(', '));
                
                let starNameAndDetails = star.name;
                if (details.length > 0) {
                    starNameAndDetails += `(<span class="star-details">${details.join(' / ')}</span>)`;
                }
                
                let starLine = `<div class="star-entry">${starNameAndDetails}`;
                
                const description = STAR_PALACE_DESCRIPTIONS[star.name]?.[palaceFullName];
                if (description && description !== '待完成') {
                    starLine += `：<span class="star-palace-description">${description}</span>`;
                }
                starLine += `</div>`;
                starEntriesHtml += starLine;
            });
            
            htmlParts.push(`<div class="palace-info-block">${title}${starEntriesHtml}</div>`);
        }
    });
    
    // 7. 處理中宮的資訊
    const centerPalaceData = chartModel['pCenter'];
    if (centerPalaceData && Object.keys(centerPalaceData.stars).length > 0) {
        let centerStarStrings = [];
        const centerStars = Object.values(centerPalaceData.stars).filter(star => !EXCLUDED_STARS_FROM_ANALYSIS.includes(star.name));
        
        centerStars.forEach(star => {
            let details = [];
            if (star.strength) details.push(star.strength);
            if (star.huaYao.length > 0) details.push(star.huaYao.join(', '));
            if (details.length > 0) {
                centerStarStrings.push(`${star.name}(<span class="star-details">${details.join(' / ')}</span>)`);
            } else {
                centerStarStrings.push(star.name);
            }
        });
        
        if (centerStarStrings.length > 0) {
            // 我們在十二宮資訊之後，用換行符 <br> 來分隔，並加上中宮的標題
            htmlParts.push(`<strong>中宮:</strong> ${centerStarStrings.join('、')}`);
        }
    }
    // 將每一宮的資訊用換行符 <br> 連接起來
    return htmlParts.join('<br>') || '此盤無核心星曜論斷資訊。';
    } 
    // ▼▼▼ 計算運勢分數的最終中央引擎 v2 ▼▼▼
    function calculateFortuneScores(chartModel, arrangedLifePalaces, ageLimitData, hourPillar, lookupResult) {
    const scores = [];
    const luckScores = { '吉星': 20, '凶星': -10 };
    const strengthBonus = 50;
    const huaYaoScore = 30;
    const specialHuaYaoMultiplier = 1.5;
    const huangEnMultiplier = 1.5;
    const patternMultiplier = 0.8;

    // --- 內部輔助函式：專門用來計算任何一個宮位的「基礎分數」---
    const getBaseScoreForPalace = (palaceId) => {
        const palaceData = chartModel[palaceId];
        if (!palaceData) return 0;
        let score = 0;
        let allStarsInPalace = [...Object.values(palaceData.stars)];
        const guestPalaceId = Object.keys(JI_GONG_MAP).find(key => JI_GONG_MAP[key] === palaceId);
        if (guestPalaceId && chartModel[guestPalaceId]) {
            allStarsInPalace.push(...Object.values(chartModel[guestPalaceId].stars));
        }
        if (lookupResult && chartModel['pCenter']?.stars) {
            const zhuSuan = lookupResult.主算;
            const keSuan = lookupResult.客算;
            const centerStars = Object.values(chartModel['pCenter'].stars);
            centerStars.forEach(star => {
                let hostBranch = null;
                if (['主大', '主參'].includes(star.name) && zhuSuan && CENTER_PALACE_JI_GONG_RULES['主算'][zhuSuan]) {
                    hostBranch = CENTER_PALACE_JI_GONG_RULES['主算'][zhuSuan][star.name];
                } else if (['客大', '客參'].includes(star.name) && keSuan && CENTER_PALACE_JI_GONG_RULES['客算'][keSuan]) {
                    hostBranch = CENTER_PALACE_JI_GONG_RULES['客算'][keSuan][star.name];
                }
                if (hostBranch && BRANCH_TO_PALACE_ID[hostBranch] === palaceId) {
                    allStarsInPalace.push(star);
                }
            });
        }
        const hasCoreStars = allStarsInPalace.some(star => STAR_PROPERTIES[star.name]);
        if (!hasCoreStars) {
            const oppositePalaceId = OPPOSITE_PALACE_MAP[palaceId];
            if (oppositePalaceId && chartModel[oppositePalaceId]) {
                allStarsInPalace = [...Object.values(chartModel[oppositePalaceId].stars)];
                const oppositeGuestPalaceId = Object.keys(JI_GONG_MAP).find(key => JI_GONG_MAP[key] === oppositePalaceId);
                if (oppositeGuestPalaceId && chartModel[oppositeGuestPalaceId]) {
                    allStarsInPalace.push(...Object.values(chartModel[oppositeGuestPalaceId].stars));
                }
            }
        }
        allStarsInPalace.forEach(star => {
            let starBaseScore = 0;
            const starName = star.name;
            const starBranchForRating = PALACE_ID_TO_BRANCH[guestPalaceId] || PALACE_ID_TO_BRANCH[palaceId];
            if (STAR_PROPERTIES[starName]) { starBaseScore += (luckScores[STAR_PROPERTIES[starName].luck] || 0); }
            if (STAR_RATING_DATA[starName] && STAR_RATING_DATA[starName][starBranchForRating]) { starBaseScore += (RATING_SCORES[STAR_RATING_DATA[starName][starBranchForRating]] || 0); }
            if (star.strength) { starBaseScore += strengthBonus; }
            if (star.huaYao && star.huaYao.some(role => ['天元祿主', '天元官星', '地元福星'].includes(role))) {
                starBaseScore *= specialHuaYaoMultiplier;
            }
            score += starBaseScore;
            if (star.huaYao && star.huaYao.length > 0) {
                star.huaYao.forEach(yaoName => {
                    if (yaoName === '忌星' || yaoName === '鬼星') {
                        score -= 30;
                    } else if (!['天元祿主', '天元官星', '地元福星'].includes(yaoName)) {
                        score += 30;
                    }
                });
            }
        });
        if (allStarsInPalace.some(star => star.name === '皇恩星')) { score *= huangEnMultiplier; }
        if (palaceData.patterns.length > 0) { score *= patternMultiplier; }
        return score;
    };

    const hourBranch = hourPillar.charAt(1);
    const timePalaceId = BRANCH_TO_PALACE_ID[hourBranch];
    const timePalaceScore = timePalaceId ? getBaseScoreForPalace(timePalaceId) : 0;

    for (let i = 0; i < arrangedLifePalaces.length; i++) {
        const palaceId = VALID_PALACES_CLOCKWISE[i];
        let finalPalaceScore = getBaseScoreForPalace(palaceId);

        const ageRange = ageLimitData[i];
        if (ageRange) {
            const startAge = parseFloat(ageRange.split('-')[0]);
            if (startAge >= 61) {
                finalPalaceScore += timePalaceScore;
            }
        }
        scores.push(finalPalaceScore);
    }
    return scores;
    }

    // ▼▼▼ 分析「強旺建議」的函式 (已整合遞補邏輯) ▼▼▼
    function analyzeStrengthSuggestions(chartModel) {
    const suggestions = [];
    const targetStars = Object.keys(STAR_PROPERTIES);
    
    let tier1_suggestions = []; // 存放滿足「三個條件」的完美結果
    let tier2_suggestions = []; // 存放滿足「兩個條件」的優秀結果

    Object.keys(chartModel).forEach(palaceId => {
        const palaceData = chartModel[palaceId];
        const branch = PALACE_ID_TO_BRANCH[palaceId];
        if (!branch) return;

        Object.values(palaceData.stars).forEach(star => {
            const starName = star.name;
            if (!targetStars.includes(starName)) return;

            // 檢查三個條件是否滿足
            const isTopRating = STAR_RATING_DATA[starName] && STAR_RATING_DATA[starName][branch] === '上';
            const hasStrength = !!star.strength;
            const hasHuaYao = star.huaYao.length > 0;

            const conditionsMet = [isTopRating, hasStrength, hasHuaYao].filter(Boolean).length;
            
            let suggestionData = null;

            if (conditionsMet === 3) {
                // 如果滿足全部三個條件，放入第一級別的建議
                suggestionData = { palaceId, starName, goodStems: [] };
                tier1_suggestions.push(suggestionData);
            } else if (conditionsMet === 2) {
                // 如果只滿足兩個條件，放入第二級別的建議
                suggestionData = { palaceId, starName, goodStems: [] };
                tier2_suggestions.push(suggestionData);
            }
            
            // 如果這顆星是候選者 (無論是第一級還是第二級)，都為它查找吉化天干
            if (suggestionData) {
                Object.keys(RI_GAN_HUA_YAO).forEach(gan => {
                    const rule = RI_GAN_HUA_YAO[gan];
                    Object.keys(rule).forEach(role => {
                        if (rule[role].includes(starName) && role !== 'jiXing' && role !== 'guiXing') {
                            suggestionData.goodStems.push(`${gan}/${HUA_YAO_ROLE_MAP[role]}`);
                        }
                    });
                });
            }
        });
    });
    
    // 最終決定：如果第一級有結果，就用第一級的；否則，才用第二級的
    if (tier1_suggestions.length > 0) {
        return tier1_suggestions;
    } else {
        return tier2_suggestions;
    }
    }
    // ▼▼▼ 搜尋「單一強旺建議」的未來30天吉日 ▼▼▼
    function findAuspiciousDaysForStrength(suggestion) {
    const results = [];
    if (!suggestion || suggestion.goodStems.length === 0) return results;
    
    const today = new Date();
    const goodStemMap = {};
    suggestion.goodStems.forEach(item => {
        const [gan, role] = item.split('/');
        goodStemMap[gan] = role;
    });

    for (let i = 0; i < 30; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);
        const year = futureDate.getFullYear();
        const month = futureDate.getMonth() + 1;
        const day = futureDate.getDate();
        const lunarDate = solarLunar.solar2lunar(year, month, day);
        const dayPillar = lunarDate.getDayInGanZhi();
        const dayStem = dayPillar.charAt(0);

        if (goodStemMap[dayStem]) {
            results.push(`${month}/${day} ${dayPillar}日(${goodStemMap[dayStem]})`);
        }
    }
    return results;
    }
    // ▼▼▼ 格式化「強旺建議」顯示文字的函式 ▼▼▼
    function formatStrengthInfo(suggestions, arrangedLifePalaces, sdrData) {
    if (!suggestions || suggestions.length === 0) return '';

    let html = `<strong>未來30天 - 運勢強旺參考日：</strong><br>`;
    const palaceFullNameMap = { '命':'命宮', '兄':'兄弟宮', '妻':'夫妻宮', '孫':'子孫宮', '財':'財帛宮', '田':'田宅宮', '官':'官祿宮', '奴':'奴僕宮', '疾':'疾厄宮', '福':'福德宮', '貌':'相貌宮', '父':'父母宮' };

    suggestions.forEach(sugg => {
        const palaceIndex = VALID_PALACES_CLOCKWISE.indexOf(sugg.palaceId);
        const palaceShortName = arrangedLifePalaces[palaceIndex];
        const palaceFullName = palaceFullNameMap[palaceShortName] || palaceShortName;
        let titleParts = [palaceFullName];
        if (sdrData[sugg.palaceId]?.includes('身')) titleParts.push('身宮');
        if (sdrData[sugg.palaceId]?.includes('日')) titleParts.push('日宮');
        if (sdrData[sugg.palaceId]?.includes('時')) titleParts.push('時宮');
        
        const auspiciousDays = findAuspiciousDaysForStrength(sugg);
        if (auspiciousDays.length > 0) {
            html += `<div class="strength-item">${titleParts.join('/')}: ${sugg.starName}`;
            html += `<br><span class="strength-good">吉日：</span>${auspiciousDays.join('、 ')}`;
            html += `</div>`;
        }
    });
    
    return html;
    }

    // ▼▼▼ 分析「解厄建議」的函式 (已整合新規則) ▼▼▼
    function analyzeRemedySuggestions(chartModel, arrangedLifePalaces) {
    const suggestions = [];
    const targetStars = ['始擊', '天乙', '地乙', '四神', '飛符'];
    
    // 遍歷所有宮位
    Object.keys(chartModel).forEach(palaceId => {
        const palaceData = chartModel[palaceId];
        const branch = PALACE_ID_TO_BRANCH[palaceId];
        if (!branch) return;

        Object.values(palaceData.stars).forEach(star => {
            const starName = star.name;
            
            // 如果不是我們要找的五顆凶星，就直接跳過
            if (!targetStars.includes(starName)) {
                return;
            }

            // --- ▼▼▼ 核心修改點：更新判斷條件 ▼▼▼ ---

            // 條件 A: 星曜落陷且無吉化
            const isLowRating = STAR_RATING_DATA[starName] && STAR_RATING_DATA[starName][branch] === '下';
            const noPositiveInfluence = !star.strength && star.huaYao.length === 0;
            const conditionA = isLowRating && noPositiveInfluence;

            // 條件 B: 星曜被凶化 (化為忌星或鬼星)
            const hasBadHuaYao = star.huaYao.includes('忌星') || star.huaYao.includes('鬼星');
            const conditionB = hasBadHuaYao;

            // --- 只要滿足條件A或條件B，就產生建議 ---
            if (conditionA || conditionB) {
                let suggestion = {
                    palaceId: palaceId,
                    starName: starName,
                    goodStems: [],
                    badStems: [],
                    goodBranches: []
                };

                // 反向查找日干和日支的解厄方式 (這部分邏輯不變)
                Object.keys(RI_GAN_HUA_YAO).forEach(gan => {
                    const rule = RI_GAN_HUA_YAO[gan];
                    Object.keys(rule).forEach(role => {
                        if (rule[role].includes(starName)) {
                            if (role === 'jiXing' || role === 'guiXing') {
                                suggestion.badStems.push(`${gan}/${HUA_YAO_ROLE_MAP[role]}`);
                            } else {
                                suggestion.goodStems.push(`${gan}/${HUA_YAO_ROLE_MAP[role]}`);
                            }
                        }
                    });
                });
                
                Object.keys(RI_ZHI_HUA_YAO).forEach(zhi => {
                     if (RI_ZHI_HUA_YAO[zhi].fuXing.includes(starName)) {
                         suggestion.goodBranches.push(zhi);
                     }
                });
                
                suggestions.push(suggestion);
            }
        });
    });
    
    return suggestions;
    }
    // ▼▼▼ 搜尋「單一建議」的未來30天吉凶日 ▼▼▼
    function findDaysForSuggestion(suggestion) {
    const results = { goodDays: [], badDays: [] };
    if (!suggestion) return results;

    const today = new Date();
    
    // 只針對傳入的「單一」建議，建立吉凶天干的查找表
    const goodStemMap = {};
    suggestion.goodStems.forEach(item => {
        const [gan, role] = item.split('/');
        goodStemMap[gan] = role;
    });

    const badStemMap = {};
    suggestion.badStems.forEach(item => {
        const [gan, role] = item.split('/');
        badStemMap[gan] = role;
    });

    // 遍歷未來30天
    for (let i = 0; i < 30; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);
        const year = futureDate.getFullYear();
        const month = futureDate.getMonth() + 1;
        const day = futureDate.getDate();

        const lunarDate = solarLunar.solar2lunar(year, month, day);
        const dayPillar = lunarDate.getDayInGanZhi();
        const dayStem = dayPillar.charAt(0);

        // 檢查是否為此建議的吉日天干
        if (goodStemMap[dayStem]) {
            results.goodDays.push(`${month}/${day} ${dayPillar}日(${goodStemMap[dayStem]})`);
        }
        // 檢查是否為此建議的凶日天干
        if (badStemMap[dayStem]) {
            results.badDays.push(`${month}/${day} ${dayPillar}日(${badStemMap[dayStem]})`);
        }
    }
    return results;
    }
    // ▼▼▼ 格式化「解厄建議」顯示文字的函式 (已修正重複問題) ▼▼▼
    function formatRemedyInfo(suggestions, arrangedLifePalaces, sdrData) {
    if (!suggestions || suggestions.length === 0) return '';

    let html = `<strong>未來30天 - 解厄吉凶參考日：</strong><br>`;
    const palaceFullNameMap = { '命':'命宮', '兄':'兄弟宮', '妻':'夫妻宮', '孫':'子孫宮', '財':'財帛宮', '田':'田宅宮', '官':'官祿宮', '奴':'奴僕宮', '疾':'疾厄宮', '福':'福德宮', '貌':'相貌宮', '父':'父母宮' };

    // 遍歷每一個需要建議的凶星
    suggestions.forEach(sugg => {
        const palaceIndex = VALID_PALACES_CLOCKWISE.indexOf(sugg.palaceId);
        if (palaceIndex === -1) return;
        const palaceShortName = arrangedLifePalaces[palaceIndex];
        const palaceFullName = palaceFullNameMap[palaceShortName] || palaceShortName;

        let titleParts = [palaceFullName];
        if (sdrData[sugg.palaceId]?.includes('身')) titleParts.push('身宮');
        if (sdrData[sugg.palaceId]?.includes('日')) titleParts.push('日宮');
        if (sdrData[sugg.palaceId]?.includes('時')) titleParts.push('時宮');
        
        html += `<div class="remedy-item">${titleParts.join('/')}: ${sugg.starName}`;
        
        // ▼▼▼ 核心修改點：為「每一個」建議，都獨立呼叫一次日期搜尋 ▼▼▼
        const auspiciousDays = findDaysForSuggestion(sugg);
        
        if (auspiciousDays.goodDays.length > 0) {
            html += `<br><span class="remedy-good">吉日：</span>${auspiciousDays.goodDays.join('、 ')}`;
        }
        if (auspiciousDays.badDays.length > 0) {
            html += `<br><span class="remedy-bad">凶日：</span>${auspiciousDays.badDays.join('、 ')}`;
        }
        if (sugg.goodBranches.length > 0) {
             html += `<br><span class="remedy-good">吉日地支：</span>${sugg.goodBranches.join('、')}`;
        }
        html += `</div>`;
    });
    
    return html;
    }
    
    // ▼▼▼ 每次增加星都要更新的函式 ▼▼▼
    function generateMainChartData(lookupResult, deitiesResult, suanStarsResult, shiWuFuResult, xiaoYouResult, junJiResult, chenJiResult, minJiResult, tianYiResult, diYiResult, siShenResult, feiFuResult, daYouResult, yueJiangData, guiRenData, xingNianData, huangEnResult) {
    const chartData = {};
    const allPalaceKeys = Object.keys(RADIAL_LAYOUT.angles);
    allPalaceKeys.forEach(key => {
        chartData[key] = {
            lineLeft: { fieldA: "", fieldB: "", fieldG: "" },
            lineCenter: { fieldC: "", fieldD: "", fieldC2: "", fieldD2: "" },
            lineRight:  { fieldE: "", fieldF: "", fieldE2: "", fieldF2: "" }
        };
    });

    // 處理 太乙、文昌、始擊 (您的同宮判斷邏輯)
    if (lookupResult) {
        const starsInPalaces = {};
        const starOrder = ['太乙', '文昌', '始擊'];
        const starLocations = { '太乙': lookupResult.太乙, '文昌': lookupResult.文昌, '始擊': lookupResult.始擊 };
        for (const starName of starOrder) {
            const palaceName = starLocations[starName];
            const palaceId = BRANCH_TO_PALACE_ID[palaceName];
            if (palaceId) {
                if (!starsInPalaces[palaceId]) starsInPalaces[palaceId] = [];
                starsInPalaces[palaceId].push(starName);
            }
        }
        for (const palaceId in starsInPalaces) {
            const stars = starsInPalaces[palaceId];
            if (chartData[palaceId]) {
                if (stars.length === 1) {
                    chartData[palaceId].lineLeft.fieldA = stars[0];
                } else if (stars.length >= 2) {
                    if (stars.includes('太乙')) {
                        chartData[palaceId].lineLeft.fieldA = '太乙';
                        const otherStar = stars.find(s => s !== '太乙');
                        chartData[palaceId].lineLeft.fieldB = otherStar;
                    } else {
                        chartData[palaceId].lineLeft.fieldA = stars[0];
                        chartData[palaceId].lineLeft.fieldB = stars[1];
                    }
                }
            }
        }
    }

    // ▼▼▼ 新增：處理「定目」 ▼▼▼
    if (lookupResult && lookupResult.定目) {
        const palaceName = lookupResult.定目;
        const palaceId = BRANCH_TO_PALACE_ID[palaceName];
        
        if (palaceId && chartData[palaceId]) {
            const lineLeft = chartData[palaceId].lineLeft;
            // 依序尋找 lineLeft 中第一個空的欄位來放入
            if (!lineLeft.fieldA) {
                lineLeft.fieldA = '定目';
            } else if (!lineLeft.fieldB) {
                lineLeft.fieldB = '定目';
            } else if (!lineLeft.fieldG) {
                lineLeft.fieldG = '定目';
            }
        }
    }
    
    // 處理 太歲、合神、計神
    if (deitiesResult) {
        const deitiesInPalaces = {};
        const deityOrder = ['太歲', '合神', '計神'];
        const deityLocations = { '太歲': deitiesResult['太歲'], '合神': deitiesResult['合神'], '計神': deitiesResult['計神'] };
        for (const deityName of deityOrder) {
            const palaceName = deityLocations[deityName];
            const palaceId = BRANCH_TO_PALACE_ID[palaceName];
            if (palaceId) {
                if (!deitiesInPalaces[palaceId]) deitiesInPalaces[palaceId] = [];
                deitiesInPalaces[palaceId].push(deityName);
            }
        }
        for (const palaceId in deitiesInPalaces) {
            const deities = deitiesInPalaces[palaceId];
            if (chartData[palaceId]) {
                if (deities.length > 0) chartData[palaceId].lineRight.fieldE = deities[0];
                if (deities.length > 1) chartData[palaceId].lineRight.fieldF = deities[1];
                if (deities.length > 2) chartData[palaceId].lineRight.fieldE2 = deities[2];
                if (deities.length > 3) chartData[palaceId].lineRight.fieldF2 = deities[3];
            }
        }
    }

    // 處理主參客參定參
    if (suanStarsResult && suanStarsResult.chartStars) {
        const starsInPalaces = {};
        for (const starName in suanStarsResult.chartStars) {
            const palaceName = suanStarsResult.chartStars[starName];
            const palaceId = BRANCH_TO_PALACE_ID[palaceName];
            if (palaceId) {
                if (!starsInPalaces[palaceId]) starsInPalaces[palaceId] = [];
                starsInPalaces[palaceId].push(starName);
            }
        }
        for (const palaceId in starsInPalaces) {
            const stars = starsInPalaces[palaceId];
            if (chartData[palaceId]) {
                const fields = ['fieldC', 'fieldD', 'fieldC2', 'fieldD2'];
                stars.forEach((star, index) => {
                    if (index < fields.length) {
                        if (!chartData[palaceId].lineCenter[fields[index]]) {
                            chartData[palaceId].lineCenter[fields[index]] = star;
                        }
                    }
                });
            }
        }
    }

    // 處理「時五福」
    if (shiWuFuResult) {
            const palaceId = BRANCH_TO_PALACE_ID[shiWuFuResult];
            if (palaceId && chartData[palaceId]) {
                // 尋找 lineLeft 中第一個空的欄位來放入
                if (!chartData[palaceId].lineLeft.fieldA) {
                    chartData[palaceId].lineLeft.fieldA = '時五福';
                } else if (!chartData[palaceId].lineLeft.fieldB) {
                    chartData[palaceId].lineLeft.fieldB = '時五福';
                } else if (!chartData[palaceId].lineLeft.fieldG) {
                    chartData[palaceId].lineLeft.fieldG = '時五福';
                }
            }
    }

    // 處理「小遊」
    if (xiaoYouResult) {
    const palaceId = BRANCH_TO_PALACE_ID[xiaoYouResult];
    if (palaceId && chartData[palaceId]) {
        const lineRight = chartData[palaceId].lineRight;
        if (!lineRight.fieldE) { lineRight.fieldE = '小遊'; }
        else if (!lineRight.fieldF) { lineRight.fieldF = '小遊'; }
        else if (!lineRight.fieldE2) { lineRight.fieldE2 = '小遊'; }
        else if (!lineRight.fieldF2) { lineRight.fieldF2 = '小遊'; }
    }
    }

    // 處理「君基、臣基、民基」
    const jiStars = {
            '君基': junJiResult,
            '臣基': chenJiResult,
            '民基': minJiResult
    };
    const jiStarsByPalace = {};
    for (const starName in jiStars) {
            const palaceBranch = jiStars[starName];
            if (palaceBranch) {
                const palaceId = BRANCH_TO_PALACE_ID[palaceBranch];
                if (palaceId) {
                    if (!jiStarsByPalace[palaceId]) {
                        jiStarsByPalace[palaceId] = [];
                    }
                    jiStarsByPalace[palaceId].push(starName);
                }
            }
    }
    const centerFields = ['fieldC', 'fieldD', 'fieldC2', 'fieldD2'];
    for (const palaceId in jiStarsByPalace) {
            if (chartData[palaceId]) {
                jiStarsByPalace[palaceId].forEach(starName => {
                    // 尋找 lineCenter 中第一個空的欄位來放入
                    for (const field of centerFields) {
                        if (!chartData[palaceId].lineCenter[field]) {
                            chartData[palaceId].lineCenter[field] = starName;
                            break; // 找到位置後就跳出內層迴圈
                        }
                    }
                });
            }
    }
    // 處理「天乙、地乙、四神、飛符」
    const messengerStars = {
            '天乙': tianYiResult,
            '地乙': diYiResult,
            '四神': siShenResult,
            '飛符': feiFuResult
    };
    const messengerStarsByPalace = {};
    for (const starName in messengerStars) {
            const palaceBranch = messengerStars[starName];
            if (palaceBranch) {
                const palaceId = BRANCH_TO_PALACE_ID[palaceBranch];
                if (palaceId) {
                    if (!messengerStarsByPalace[palaceId]) {
                        messengerStarsByPalace[palaceId] = [];
                    }
                    messengerStarsByPalace[palaceId].push(starName);
                }
            }
    }
    const rightFields = ['fieldE', 'fieldF', 'fieldE2', 'fieldF2'];
    for (const palaceId in messengerStarsByPalace) {
            if (chartData[palaceId]) {
                messengerStarsByPalace[palaceId].forEach(starName => {
                    // 尋找 lineRight 中第一個空的欄位來放入
                    for (const field of rightFields) {
                        if (!chartData[palaceId].lineRight[field]) {
                            chartData[palaceId].lineRight[field] = starName;
                            break; 
                        }
                    }
                });
            }
    }

    // ▼▼▼ 處理「皇恩星」 ▼▼▼
    if (huangEnResult) {
        const palaceId = BRANCH_TO_PALACE_ID[huangEnResult];
        if (palaceId && chartData[palaceId]) { // <-- 修正點：移除多餘的 .palaces
            const fields = ['fieldE', 'fieldF', 'fieldE2', 'fieldF2'];
            for (const field of fields) {
                if (!chartData[palaceId].lineRight[field]) { // <-- 修正點：移除多餘的 .palaces
                    chartData[palaceId].lineRight[field] = '皇恩星'; // <-- 修正點：移除多餘的 .palaces
                    break;
                }
            }
        }
    }
        
    // 處理「大遊」
    if (daYouResult) {
    const palaceId = BRANCH_TO_PALACE_ID[daYouResult];
    if (palaceId && chartData[palaceId]) {
        const lineRight = chartData[palaceId].lineRight;
        if (!lineRight.fieldE) { lineRight.fieldE = '大遊'; }
        else if (!lineRight.fieldF) { lineRight.fieldF = '大遊'; }
        else if (!lineRight.fieldE2) { lineRight.fieldE2 = '大遊'; }
        else if (!lineRight.fieldF2) { lineRight.fieldF2 = '大遊'; }
    }
    }

    // 將月將資料附加到 chartData 物件上 ▼▼▼
    chartData.yueJiangData = yueJiangData;

    // 將貴人資料附加到 chartData 物件上 ▼▼▼
    chartData.guiRenData = guiRenData;

        
    return chartData;
    }
    

    // =================================================================
    //  SECTION 4: UI 互動與主流程 (最終整理版)
    // =================================================================
    function populateDateSelectors() {
        const yearSelect = document.getElementById('birth-year');
        const monthSelect = document.getElementById('birth-month');
        const daySelect = document.getElementById('birth-day');
        const hourSelect = document.getElementById('birth-hour');
        for (let i = 2050; i >= 1930; i--) { const option = document.createElement('option'); option.value = i; option.textContent = i; yearSelect.appendChild(option); }
        for (let i = 1; i <= 12; i++) { const option = document.createElement('option'); option.value = i; option.textContent = i; monthSelect.appendChild(option); }
        for (let i = 1; i <= 31; i++) { const option = document.createElement('option'); option.value = i; option.textContent = i; daySelect.appendChild(option); }
        for (let i = 0; i <= 23; i++) { const option = document.createElement('option'); option.value = i; option.textContent = i; hourSelect.appendChild(option); }
    }

    const dayJishuDisplay = document.getElementById('day-jishu-display');
    const hourJishuDisplay = document.getElementById('hour-jishu-display');
    const calculateBtn = document.getElementById('calculate-btn');
    const savePdfBtn = document.getElementById('save-pdf-btn'); 

    function prefillTestData() {
        document.getElementById('birth-year').value = '1976';
        document.getElementById('birth-month').value = '10';
        document.getElementById('birth-day').value = '14';
        document.getElementById('birth-hour').value = '22';
        document.getElementById('gender-female').checked = true;
    }

    function runCalculation(dataForCalculation, hour, xingNianData) { 
        const bureauResult = dataForCalculation.bureauResult;
        const lookupResult = lookupBureauData(bureauResult);
        const yearStem = dataForCalculation.yearPillar.charAt(0);
        const direction = determineDirection(yearStem, dataForCalculation.gender);
        const lifePalaceId = findPalaceByCounting(dataForCalculation.yearPillar.charAt(1), dataForCalculation.monthPillar.charAt(1), dataForCalculation.hourPillar.charAt(1), direction);
        const newLifePalacesData = lifePalaceId ? arrangeLifePalaces(lifePalaceId, direction) : [];
        const newSdrData = calculateSdrPalaces(dataForCalculation, direction);
        const newAgeLimitData = arrangeAgeLimits(newLifePalacesData);
        const lunarDateForYueJiang = solarLunar.solar2lunar(
        parseInt(dataForCalculation.birthDate.split('/')[0], 10),
        parseInt(dataForCalculation.birthDate.split('/')[1], 10),
        parseInt(dataForCalculation.birthDate.split('/')[2], 10),hour);
        const yueJiangData = calculateYueJiang(lunarDateForYueJiang, dataForCalculation.hourPillar.charAt(1));
        const outerRingData = calculateOuterRingData(bureauResult, dataForCalculation.hourJishu, lookupResult);
        const guiRenData = calculateGuiRen(dataForCalculation.dayPillar.charAt(0), dataForCalculation.hourPillar.charAt(1), yueJiangData);
        huangEnResult = calculateHuangEn(dataForCalculation.dayPillar.charAt(1));

         // ▼▼▼ 核心修改點：呼叫新的專用函式，為圓盤準備正確格式的資料 ▼▼▼
        const yangJiuForDisplay = findCurrentYangJiuForDisplay(dataForCalculation.yangJiuResult, dataForCalculation.currentUserAge);
        const baiLiuForDisplay = findCurrentBaiLiuForDisplay(dataForCalculation.baiLiuResult, dataForCalculation.currentUserAge);
        const daYouForDisplay = findCurrentAndNextDaYouForDisplay(dataForCalculation.daYouZhenXianResult, dataForCalculation.currentUserAge);


        // ▼▼▼ 這邊有新增新星都要增加，注意要寫成dataForCalculation，這個函式是「建築師」 ▼▼▼
        const newMainChartData = generateMainChartData(
            lookupResult,
            dataForCalculation.deitiesResult, dataForCalculation.suanStarsResult,
            dataForCalculation.shiWuFuResult, dataForCalculation.xiaoYouResult,
            dataForCalculation.junJiResult, dataForCalculation.chenJiResult, dataForCalculation.minJiResult,
            dataForCalculation.tianYiResult, dataForCalculation.diYiResult, dataForCalculation.siShenResult, dataForCalculation.feiFuResult,
            dataForCalculation.daYouResult, yueJiangData, guiRenData, xingNianData, dataForCalculation.huangEnResult);

        const centerData = {
             field1: dataForCalculation.suanStarsResult.centerStars[0] || '',
             field2: dataForCalculation.suanStarsResult.centerStars[1] || '',
             field3: dataForCalculation.suanStarsResult.centerStars[2] || '',
             field4: dataForCalculation.suanStarsResult.centerStars[3] || ''
        };

        renderChart(newMainChartData, newLifePalacesData, newAgeLimitData, newSdrData, centerData, outerRingData, xingNianData, yangJiuForDisplay, baiLiuForDisplay, dataForCalculation.baiLiuXiaoXianResult, daYouForDisplay, dataForCalculation.feiLuDaXianResult, dataForCalculation.feiMaDaXianResult, dataForCalculation.feiMaLiuNianResult, dataForCalculation.feiLuLiuNianResult, dataForCalculation.heiFuResult); 

        

        const shenPalaceId = Object.keys(newSdrData).find(k => newSdrData[k].includes('身'));
        const shenPalaceBranch = shenPalaceId ? PALACE_ID_TO_BRANCH[shenPalaceId] : '計算失敗';
        const huaYaoResults = calculateAllHuaYao(dataForCalculation.yearPillar.charAt(0), dataForCalculation.dayPillar.charAt(0), dataForCalculation.dayPillar.charAt(1));
        const shouQiResult = dataForCalculation.shouQiResult;
        const birthHexagramResult = dataForCalculation.birthHexagramResult;
        const liYeHexagramResult = dataForCalculation.liYeHexagramResult;
        const annualHexagramResult = dataForCalculation.annualHexagramResult;    
    
        
        // 2. 按照您想要的順序，重新組合 outputText 字串
        let outputText = ''; // 先建立一個空字串
        outputText += `  局數 : ${bureauResult}\n  命宮 : ${lifePalaceId ? PALACE_ID_TO_BRANCH[lifePalaceId] + '宮' : '計算失敗'}\n  身宮 : ${shenPalaceBranch}宮`;
        

        if (lookupResult) {
            // 從資料庫中查找每個算數對應的屬性文字
            const zhuSuanAttr = SUAN_ATTRIBUTE_DATA[lookupResult.主算] || '';
            const keSuanAttr = SUAN_ATTRIBUTE_DATA[lookupResult.客算] || '';
            const dingSuanAttr = SUAN_ATTRIBUTE_DATA[lookupResult.定算] || '';

            // 在數字後面，加上帶有新 class 的 <span> 標籤來顯示屬性
            outputText += `\n  主算 : ${lookupResult.主算} <span class="suan-attribute-style">(${zhuSuanAttr})</span>`;
            outputText += `\n  客算 : ${lookupResult.客算} <span class="suan-attribute-style">(${keSuanAttr})</span>`;
            outputText += `\n  定算 : ${lookupResult.定算} <span class="suan-attribute-style">(${dingSuanAttr})</span>`;
        }

        // 2. 呼叫新的函式，產生格局資訊，並加到上方
        outputText += formatPatternInfo(dataForCalculation.chartModel, newLifePalacesData);


        // 第一行：受氣之宮 (視覺上會在四柱下方)
        if (shouQiResult) {
        outputText += `\n\n  受氣之宮 : ${shouQiResult.palace}${shouQiResult.number}`;
        }
        if (birthHexagramResult) {
        outputText += `\n  出生卦 : ${birthHexagramResult.number} ${birthHexagramResult.name} ${birthHexagramResult.symbol}`;
        }
        if (liYeHexagramResult) {
        const liYeStartAge = dataForCalculation.liYeStartAge;
        // 如果有計算出歲數，就組合進字串裡，否則留空
        const ageText = liYeStartAge ? ` (${liYeStartAge}歲開始)` : '';
        outputText += `\n  立業卦 : ${liYeHexagramResult.number} ${liYeHexagramResult.name} ${liYeHexagramResult.symbol}${ageText}`;
        }
        if (annualHexagramResult) {
        const currentYear = new Date().getFullYear();
        outputText += `\n  流年卦 : ${annualHexagramResult.number} ${annualHexagramResult.name} ${annualHexagramResult.symbol} (${currentYear}年${dataForCalculation.currentUserAge}歲)`;
        outputText += `\n  <span class="hexagram-description-style">↳ ${annualHexagramResult.description}</span>`;
        } 
        const annualChangingHexagramResult = calculateAnnualChangingHexagram(dataForCalculation.annualHexagramResult, dataForCalculation.baiLiuResult, dataForCalculation.currentUserAge);
        if (annualChangingHexagramResult) {
        outputText += `\n  流年變卦: ${annualChangingHexagramResult.number} ${annualChangingHexagramResult.name} ${annualChangingHexagramResult.symbol}`;
        outputText += `\n  <span class="hexagram-description-style">↳ ${annualChangingHexagramResult.description}</span>`;
        }

        // ▼▼▼ 月卦資訊 ▼▼▼
        const monthlyHexagramsText = formatMonthlyHexagrams(dataForCalculation.monthlyHexagramsResult);
        if (monthlyHexagramsText) {
        outputText += monthlyHexagramsText;
        }
        
        const summaryP = document.getElementById('calculation-summary');
        summaryP.innerHTML = outputText;
        
        // --- 更新下方資訊區，現在只顯示星曜強旺和化曜 ---
        const starStrengthInfoDiv = document.getElementById('star-strength-info');
        if (starStrengthInfoDiv) {
        starStrengthInfoDiv.innerHTML = formatBottomInfoBox(dataForCalculation.chartModel, newLifePalacesData, newSdrData);
        }
        const patternInfoDiv = document.getElementById('pattern-info');
        if (patternInfoDiv) {
        patternInfoDiv.innerHTML = formatPatternInfo(dataForCalculation.chartModel, newLifePalacesData);
        }
        
        // ▼▼▼ 更新：現在這裡只負責觸發預設的圖表更新 ▼▼▼
        document.querySelector('input[name="chart-mode"][value="mingGong"]').checked = true; // 預設選中命宮
        updateChart(); 
        
        // 解厄建議區塊 ▼▼▼
        const remedyInfoDiv = document.getElementById('remedy-info');
        if (remedyInfoDiv) {
        remedyInfoDiv.innerHTML = formatRemedyInfo(dataForCalculation.remedySuggestions, newLifePalacesData, newSdrData);
        }
        // 強旺建議區塊 ▼▼▼
        const strengthInfoDiv = document.getElementById('strength-info');
        if (strengthInfoDiv) {
        strengthInfoDiv.innerHTML = formatStrengthInfo(dataForCalculation.strengthSuggestions, newLifePalacesData, newSdrData);
        }


    }
    
    // ▼▼▼ 更新趨勢圖的專屬updateChart 函式 (已修正計分邏輯) ▼▼▼
    let currentChartData = {}; 
    function updateChart() {
    const selectedMode = document.querySelector('input[name="chart-mode"]:checked').value;
    
    let limitData = [];
    let scores = [];
    let labels = [];

    // 1. 根據選擇的模式，準備對應的大限列表
    switch(selectedMode) {
        case 'daYou':
            limitData = currentChartData.daYouZhenXianResult;
            break;
        case 'baiLiu':
            limitData = currentChartData.baiLiuResult;
            break;
        case 'yangJiu':
            limitData = currentChartData.yangJiuResult;
            break;
        default: // 'mingGong' (限例太乙)
            const ageLimits = arrangeAgeLimits(currentChartData.arrangedLifePalaces);
            limitData = ageLimits.map((ageRange, index) => ({
                palaceId: VALID_PALACES_CLOCKWISE[index],
                ageRange: ageRange
            })).filter(item => item.ageRange);
            break;
    }
    
    // 2. 根據不同的大限列表，重新計算對應宮位的分數
    // 我們需要一個簡化版的計分函式，它只計算基礎分數，不包含時宮加權
    const getSimpleScore = (palaceId) => {
        const tempScores = calculateFortuneScores(currentChartData.chartModel, currentChartData.arrangedLifePalaces, [], currentChartData.hourPillar, currentChartData.lookupResult);
        const palaceIndex = VALID_PALACES_CLOCKWISE.indexOf(palaceId);
        return palaceIndex !== -1 ? tempScores[palaceIndex] : 0;
    };

    if (selectedMode === 'mingGong') {
        labels = limitData.map(item => item.ageRange);
        scores = calculateFortuneScores(currentChartData.chartModel, currentChartData.arrangedLifePalaces, labels, currentChartData.hourPillar, currentChartData.lookupResult);
    } else {
        labels = limitData.map(item => item.ageRange);
        scores = limitData.map(item => getSimpleScore(item.palaceId));
    }
    
    // 3. 重新排序並繪製圖表
    let chartDataToSort = labels.map((label, index) => ({ ageRange: label, score: scores[index] })).filter(item => item.ageRange);
    chartDataToSort.sort((a, b) => parseFloat(a.ageRange.split('-')[0]) - parseFloat(b.ageRange.split('-')[0]));
    
    renderFortuneChart(
        chartDataToSort.map(item => item.ageRange),
        chartDataToSort.map(item => item.score)
    );
    }
    


    // (這個calculateBtn.addEventListener 函式就是工廠老闆, runCalculation是老師傅)
    calculateBtn.addEventListener('click', () => {
    const year = parseInt(document.getElementById('birth-year').value, 10);
    const month = parseInt(document.getElementById('birth-month').value, 10);
    const day = parseInt(document.getElementById('birth-day').value, 10);
    const hour = parseInt(document.getElementById('birth-hour').value, 10);
    const birthDateObject = new Date(year, month - 1, day, hour);

    // ▼▼▼ 主要修改與新增的區塊 ▼▼▼
    // 步驟 2A: 呼叫新的整合型函式，一次性取得所有精準數值
    const precisionResult = calculateJishuAndBureau(birthDateObject);

    // 步驟 2B: 自動「顯示」計算出的日積數與時積數
    if (precisionResult) {
        dayJishuDisplay.textContent = precisionResult.dayJishu;
        hourJishuDisplay.textContent = precisionResult.hourJishu;
    } else {
        dayJishuDisplay.textContent = '計算失敗';
        hourJishuDisplay.textContent = '計算失敗';
    }

    const lunarDate = solarLunar.solar2lunar(year, month, day, hour);
    // 步驟 3B: 執行「雙重」交叉驗證 (結果會顯示在主控台 F12)
    if (precisionResult) {
        console.log("--- 四柱交叉驗證 ---");
        const baziDayPillar = lunarDate.getDayInGanZhi();
        console.log("日柱 (solar-lunar.js):", baziDayPillar);
        console.log("日柱 (基準點推算):", precisionResult.dayPillar);
        if (baziDayPillar === precisionResult.dayPillar) {
            console.log("✅ 日柱驗證通過！");
        } else { console.error("❌ 日柱驗證失敗！"); }
        
        const baziHourPillar = lunarDate.getTimeInGanZhi();
        console.log("時柱 (solar-lunar.js):", baziHourPillar);
        console.log("時柱 (時積數反推):", precisionResult.validatedHourPillar);
        if (baziHourPillar === precisionResult.validatedHourPillar) {
            console.log("✅ 時柱驗證通過！");
        } else { console.error("❌ 時柱驗證失敗！"); }
        console.log("--------------------");
    }

    const yearPillar = lunarDate.getYearInGanZhi();
    const monthPillar = lunarDate.getMonthInGanZhi();
    const dayPillar = lunarDate.getDayInGanZhi();
    const hourPillar = lunarDate.getTimeInGanZhi();
    
    document.getElementById('year-pillar-stem').textContent = yearPillar.charAt(0);
    document.getElementById('year-pillar-branch').textContent = yearPillar.charAt(1);
    document.getElementById('month-pillar-stem').textContent = monthPillar.charAt(0);
    document.getElementById('month-pillar-branch').textContent = monthPillar.charAt(1);
    document.getElementById('day-pillar-stem').textContent = dayPillar.charAt(0);
    document.getElementById('day-pillar-branch').textContent = dayPillar.charAt(1);
    document.getElementById('hour-pillar-stem').textContent = hourPillar.charAt(0);
    document.getElementById('hour-pillar-branch').textContent = hourPillar.charAt(1);
    
    const today = new Date();
    const currentUserAge = today.getFullYear() - year + 1;
    const startAge = currentUserAge - 20;
    const endAge = currentUserAge + 40;
    const yearStemForDirection = lunarDate.getYearInGanZhi().charAt(0);
    const genderForDirection = document.querySelector('input[name="gender"]:checked').value === 'male' ? '男' : '女';
    const direction = determineDirection(yearStemForDirection, genderForDirection);
    const lifePalaceId = findPalaceByCounting(lunarDate.getYearInGanZhi().charAt(1), lunarDate.getMonthInGanZhi().charAt(1), lunarDate.getTimeInGanZhi().charAt(1), direction);
    const arrangedLifePalaces = lifePalaceId ? arrangeLifePalaces(lifePalaceId, direction) : [];


    // (您把工具都放進了這個工具箱, 然後您把整個工具箱(dataForCalculation)交給了 runCalculation 工人)
    const dataForCalculation = {
        birthDate: `${year}/${month}/${day}`,
        gender: document.querySelector('input[name="gender"]:checked').value === 'male' ? '男' : '女',
        yearPillar: lunarDate.getYearInGanZhi(),
        monthPillar: lunarDate.getMonthInGanZhi(),
        dayPillar: lunarDate.getDayInGanZhi(),
        hourPillar: lunarDate.getTimeInGanZhi(),
        dayJishu: precisionResult ? precisionResult.dayJishu : 0,
        hourJishu: precisionResult ? precisionResult.hourJishu : 0,
        currentUserAge: currentUserAge,
        arrangedLifePalaces: arrangedLifePalaces
    };

    const bureauResult = precisionResult ? precisionResult.calculatedBureau : '計算失敗';
    const lookupResult = lookupBureauData(bureauResult);
    dataForCalculation.bureauResult = bureauResult;
    dataForCalculation.lookupResult = lookupResult;
    dataForCalculation.deitiesResult = calculateDeities(bureauResult, dataForCalculation.hourPillar.charAt(1));
    dataForCalculation.suanStarsResult = calculateSuanStars(lookupResult);
    dataForCalculation.shiWuFuResult = calculateShiWuFu(dataForCalculation.hourJishu);
    dataForCalculation.xiaoYouResult = calculateXiaoYou(dataForCalculation.hourJishu);
    dataForCalculation.junJiResult = calculateJunJi(dataForCalculation.hourJishu);
    dataForCalculation.chenJiResult = calculateChenJi(dataForCalculation.hourJishu);
    dataForCalculation.minJiResult = calculateMinJi(dataForCalculation.hourJishu);
    dataForCalculation.tianYiResult = calculateTianYi(dataForCalculation.hourJishu);
    dataForCalculation.diYiResult = calculateDiYi(dataForCalculation.hourJishu);
    dataForCalculation.siShenResult = calculateSiShen(dataForCalculation.hourJishu);
    dataForCalculation.feiFuResult = calculateFeiFu(dataForCalculation.hourJishu);
    dataForCalculation.daYouResult = calculateDaYou(dataForCalculation.hourJishu);
    const xingNianData = calculateXingNian(dataForCalculation.gender, startAge, endAge); 
    dataForCalculation.huangEnResult = calculateHuangEn(dataForCalculation.dayPillar.charAt(1));
    dataForCalculation.shouQiResult = calculateShouQi(dataForCalculation.dayPillar, dataForCalculation.hourPillar);
    dataForCalculation.birthHexagramResult = calculateBirthHexagram(dataForCalculation.yearPillar, dataForCalculation.monthPillar, dataForCalculation.dayPillar, dataForCalculation.hourPillar);
    dataForCalculation.liYeHexagramResult = calculateLiYeHexagram(dataForCalculation.shouQiResult.palace, dataForCalculation.birthHexagramResult);
    dataForCalculation.annualHexagramResult = calculateAnnualHexagram(dataForCalculation.birthHexagramResult, dataForCalculation.currentUserAge);    
    dataForCalculation.baiLiuXiaoXianResult = calculateBaiLiuXiaoXian(dataForCalculation.shouQiResult, dataForCalculation.gender, dataForCalculation.currentUserAge);
    dataForCalculation.feiLuDaXianResult = calculateFeiLuDaXian(dataForCalculation.yearPillar.charAt(0), dataForCalculation.currentUserAge);
    dataForCalculation.feiMaDaXianResult = calculateFeiMaDaXian(dataForCalculation.yearPillar.charAt(0), dataForCalculation.currentUserAge);
    dataForCalculation.feiLuLiuNianResult = calculateFeiLuLiuNian(dataForCalculation.yearPillar.charAt(0), dataForCalculation.dayPillar.charAt(0), dataForCalculation.gender, dataForCalculation.currentUserAge, arrangedLifePalaces);
    dataForCalculation.feiMaLiuNianResult = calculateFeiMaLiuNian(dataForCalculation.hourPillar.charAt(0), dataForCalculation.dayPillar.charAt(0), dataForCalculation.gender, dataForCalculation.currentUserAge, dataForCalculation.arrangedLifePalaces);
    dataForCalculation.heiFuResult = calculateHeiFu(dataForCalculation.hourPillar.charAt(0), dataForCalculation.currentUserAge);
    dataForCalculation.liYeStartAge = calculateLiYeStartAge(dataForCalculation.birthHexagramResult);
    dataForCalculation.annualChangingHexagramResult = calculateAnnualChangingHexagram(dataForCalculation.annualHexagramResult, dataForCalculation.baiLiuResult, dataForCalculation.currentUserAge);
    dataForCalculation.monthlyHexagramsResult = calculateMonthlyHexagrams(dataForCalculation.annualHexagramResult?.number);
    // ▼▼▼ 更新：一次性計算出所有大限的完整序列 ▼▼▼
    
    dataForCalculation.yangJiuResult = calculateYangJiu(dataForCalculation.monthPillar.charAt(0), dataForCalculation.gender);
    dataForCalculation.baiLiuResult = calculateBaiLiuLimit(dataForCalculation.shouQiResult, dataForCalculation.gender);
    dataForCalculation.daYouZhenXianResult = calculateDaYouZhenXian(dataForCalculation.hourPillar.charAt(1));
    dataForCalculation.chartModel = buildChartModel(dataForCalculation);
    dataForCalculation.remedySuggestions = analyzeRemedySuggestions(dataForCalculation.chartModel, dataForCalculation.arrangedLifePalaces);
    dataForCalculation.strengthSuggestions = analyzeStrengthSuggestions(dataForCalculation.chartModel);
    currentChartData = dataForCalculation; // 將所有計算結果存到全域變數

    runCalculation(dataForCalculation, hour, xingNianData); 
});

    // --- 頁面初始化 ---
populateDateSelectors();
prefillTestData();
setTimeout(() => {
    calculateBtn.click();
}, 10);
    
// ▼▼▼ 新增：為圖表切換按鈕綁定事件 ▼▼▼
document.querySelectorAll('input[name="chart-mode"]').forEach(radio => {
    radio.addEventListener('change', updateChart);
});

// ▼▼▼ 新增：PDF 儲存功能 (使用列印模式) ▼▼▼
savePdfBtn.addEventListener('click', () => {
    window.print();
});

});