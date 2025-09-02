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

    // ▼▼▼ 盤面的位置設定 ▼▼▼ 
    const RADIAL_LAYOUT = {
        center: { x: 381, y: 403 },
        angles: { pYou:0, pXu:22.5, pQian:45, pHai:66.5, pZi:90, pChou:113.5, pGen:135, pYin:157.5, pMao:180, pChen:202.5, pXun:225, pSi:246.5, pWu:270, pWei:293.5, pKun:315, pShen:337.5 },
        angleOffset: 6,
        radii: {
            lineLeft:   { fieldA: 144, fieldB: 185, fieldG: 226 },
            lineCenter: { fieldC: 144, fieldD: 179, fieldC2: 214, fieldD2: 250 },
            lineRight:  { fieldE: 144, fieldF: 179, fieldE2: 214, fieldF2: 250 }
        },
        // ▼▼▼ 定義圓心 4 個欄位的座標 ▼▼▼
        centerFields: {
            field1: { x: 381, y: 392 }, field2: { x: 381, y: 423 },
            field3: { x: 368, y: 408 }, field4: { x: 398, y: 408 }
        },
        
        lifePalacesRing: { radius: 100, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'], color: '#792e13ff' },
        ageLimitRing: { radius: 125, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'], flipPalaces: ['pZi','pHai','pSi','pXu','pYou','pShen'], color: '#626363', className: 'age-limit-style' },
        sdrRing: { radius: 110, hOffset: 6.5, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'] },
        yueJiangRing: { radius: 293, rotationOffset: 5, palaces: ['pZi','pHai','pXu','pYou','pShen','pWei','pWu','pSi','pChen','pMao','pYin','pChou'], flipPalaces: ['pHai','pSi','pXu','pYou','pShen'], color: '#501dd3' },
        guiRenRing: { radius: 293, rotationOffset: -5, palaces: ['pZi','pChou','pYin','pMao','pChen','pSi','pWu','pWei','pShen','pYou','pXu','pHai'], flipPalaces: ['pZi','pHai','pSi','pXu','pYou','pWu','pShen'], color: '#ae00ff' },
        outerRing: { radius: 250, palaces: ['pZi', 'pGen', 'pMao', 'pXun', 'pWu', 'pKun', 'pYou', 'pQian']},
        xingNianRing: { radius: 270, flipPalaces: ['pZi', 'pHai', 'pXu', 'pYou', 'pShen', 'pSi']} 
    };

    // ▼▼▼ 144局的完整資料庫 ▼▼▼
    const BUREAU_DATA = [
    {
        "局":"陽1局",
        "太乙":"乾",
        "文昌":"申",
        "始擊":"坤",
        "主算":7,
        "客算":13,
        "定算":13
    },
    {
        "局":"陽2局",
        "太乙":"乾",
        "文昌":"酉",
        "始擊":"戌",
        "主算":6,
        "客算":1,
        "定算":1
    },
    {
        "局":"陽3局",
        "太乙":"乾",
        "文昌":"戌",
        "始擊":"亥",
        "主算":1,
        "客算":40,
        "定算":32
    },
    {
        "局":"陽4局",
        "太乙":"午",
        "文昌":"乾",
        "始擊":"丑",
        "主算":25,
        "客算":17,
        "定算":10
    },
    {
        "局":"陽5局",
        "太乙":"午",
        "文昌":"乾",
        "始擊":"寅",
        "主算":25,
        "客算":14,
        "定算":1
    },
    {
        "局":"陽6局",
        "太乙":"午",
        "文昌":"亥",
        "始擊":"辰",
        "主算":25,
        "客算":10,
        "定算":32
    },
    {
        "局":"陽7局",
        "太乙":"艮",
        "文昌":"子",
        "始擊":"巳",
        "主算":8,
        "客算":25,
        "定算":9
    },
    {
        "局":"陽8局",
        "太乙":"艮",
        "文昌":"丑",
        "始擊":"坤",
        "主算":1,
        "客算":22,
        "定算":3
    },
    {
        "局":"陽9局",
        "太乙":"艮",
        "文昌":"艮",
        "始擊":"酉",
        "主算":3,
        "客算":15,
        "定算":33
    },
    {
        "局":"陽10局",
        "太乙":"卯",
        "文昌":"寅",
        "始擊":"乾",
        "主算":1,
        "客算":12,
        "定算":25
    },
    {
        "局":"陽11局",
        "太乙":"卯",
        "文昌":"卯",
        "始擊":"丑",
        "主算":4,
        "客算":4,
        "定算":13
    },
    {
        "局":"陽12局",
        "太乙":"卯",
        "文昌":"辰",
        "始擊":"寅",
        "主算":37,
        "客算":1,
        "定算":4
    },
    {
        "局":"陽13局",
        "太乙":"酉",
        "文昌":"巽",
        "始擊":"辰",
        "主算":18,
        "客算":19,
        "定算":19
    },
    {
        "局":"陽14局",
        "太乙":"酉",
        "文昌":"巳",
        "始擊":"午",
        "主算":10,
        "客算":9,
        "定算":9
    },
    {
        "局":"陽15局",
        "太乙":"酉",
        "文昌":"午",
        "始擊":"坤",
        "主算":9,
        "客算":7,
        "定算":6
    },
    {
        "局":"陽16局",
        "太乙":"坤",
        "文昌":"未",
        "始擊":"酉",
        "主算":1,
        "客算":33,
        "定算":26
    },
    {
        "局":"陽17局",
        "太乙":"坤",
        "文昌":"坤",
        "始擊":"亥",
        "主算":7,
        "客算":27,
        "定算":16
    },
    {
        "局":"陽18局",
        "太乙":"坤",
        "文昌":"坤",
        "始擊":"子",
        "主算":7,
        "客算":26,
        "定算":11
    },
    {
        "局":"陽19局",
        "太乙":"子",
        "文昌":"申",
        "始擊":"艮",
        "主算":8,
        "客算":32,
        "定算":14
    },
    {
        "局":"陽20局",
        "太乙":"子",
        "文昌":"酉",
        "始擊":"辰",
        "主算":7,
        "客算":26,
        "定算":2
    },
    {
        "局":"陽21局",
        "太乙":"子",
        "文昌":"戌",
        "始擊":"巳",
        "主算":2,
        "客算":17,
        "定算":33
    },
    {
        "局":"陽22局",
        "太乙":"巽",
        "文昌":"乾",
        "始擊":"未",
        "主算":16,
        "客算":30,
        "定算":1
    },
    {
        "局":"陽23局",
        "太乙":"巽",
        "文昌":"乾",
        "始擊":"申",
        "主算":16,
        "客算":23,
        "定算":32
    },
    {
        "局":"陽24局",
        "太乙":"巽",
        "文昌":"亥",
        "始擊":"戌",
        "主算":16,
        "客算":17,
        "定算":23
    },
    {
        "局":"陽25局",
        "太乙":"乾",
        "文昌":"子",
        "始擊":"亥",
        "主算":39,
        "客算":40,
        "定算":40
    },
    {
        "局":"陽26局",
        "太乙":"乾",
        "文昌":"丑",
        "始擊":"艮",
        "主算":32,
        "客算":31,
        "定算":31
    },
    {
        "局":"陽27局",
        "太乙":"乾",
        "文昌":"艮",
        "始擊":"卯",
        "主算":31,
        "客算":28,
        "定算":24
    },
    {
        "局":"陽28局",
        "太乙":"午",
        "文昌":"寅",
        "始擊":"巽",
        "主算":14,
        "客算":9,
        "定算":38
    },
    {
        "局":"陽29局",
        "太乙":"午",
        "文昌":"卯",
        "始擊":"未",
        "主算":13,
        "客算":39,
        "定算":26
    },
    {
        "局":"陽30局",
        "太乙":"午",
        "文昌":"辰",
        "始擊":"申",
        "主算":10,
        "客算":32,
        "定算":17
    },
    {
        "局":"陽31局",
        "太乙":"艮",
        "文昌":"巽",
        "始擊":"戌",
        "主算":33,
        "客算":10,
        "定算":34
    },
    {
        "局":"陽32局",
        "太乙":"艮",
        "文昌":"巳",
        "始擊":"子",
        "主算":25,
        "客算":8,
        "定算":24
    },
    {
        "局":"陽33局",
        "太乙":"艮",
        "文昌":"午",
        "始擊":"艮",
        "主算":24,
        "客算":3,
        "定算":15
    },
    {
        "局":"陽34局",
        "太乙":"卯",
        "文昌":"未",
        "始擊":"卯",
        "主算":26,
        "客算":4,
        "定算":11
    },
    {
        "局":"陽35局",
        "太乙":"卯",
        "文昌":"坤",
        "始擊":"巳",
        "主算":25,
        "客算":28,
        "定算":1
    },
    {
        "局":"陽36局",
        "太乙":"卯",
        "文昌":"坤",
        "始擊":"午",
        "主算":25,
        "客算":27,
        "定算":36
    },
    {
        "局":"陽37局",
        "太乙":"酉",
        "文昌":"申",
        "始擊":"坤",
        "主算":1,
        "客算":7,
        "定算":7
    },
    {
        "局":"陽38局",
        "太乙":"酉",
        "文昌":"酉",
        "始擊":"戌",
        "主算":6,
        "客算":35,
        "定算":35
    },
    {
        "局":"陽39局",
        "太乙":"酉",
        "文昌":"戌",
        "始擊":"亥",
        "主算":35,
        "客算":34,
        "定算":26
    },
    {
        "局":"陽40局",
        "太乙":"坤",
        "文昌":"乾",
        "始擊":"丑",
        "主算":27,
        "客算":19,
        "定算":12
    },
    {
        "局":"陽41局",
        "太乙":"坤",
        "文昌":"乾",
        "始擊":"寅",
        "主算":27,
        "客算":16,
        "定算":3
    },
    {
        "局":"陽42局",
        "太乙":"坤",
        "文昌":"亥",
        "始擊":"辰",
        "主算":27,
        "客算":12,
        "定算":34
    },
    {
        "局":"陽43局",
        "太乙":"子",
        "文昌":"子",
        "始擊":"巳",
        "主算":8,
        "客算":17,
        "定算":1
    },
    {
        "局":"陽44局",
        "太乙":"子",
        "文昌":"丑",
        "始擊":"坤",
        "主算":33,
        "客算":14,
        "定算":32
    },
    {
        "局":"陽45局",
        "太乙":"子",
        "文昌":"艮",
        "始擊":"酉",
        "主算":32,
        "客算":7,
        "定算":25
    },
    {
        "局":"陽46局",
        "太乙":"巽",
        "文昌":"寅",
        "始擊":"乾",
        "主算":5,
        "客算":16,
        "定算":29
    },
    {
        "局":"陽47局",
        "太乙":"巽",
        "文昌":"卯",
        "始擊":"丑",
        "主算":4,
        "客算":8,
        "定算":17
    },
    {
        "局":"陽48局",
        "太乙":"巽",
        "文昌":"辰",
        "始擊":"寅",
        "主算":1,
        "客算":5,
        "定算":8
    },
    {
        "局":"陽49局",
        "太乙":"乾",
        "文昌":"巽",
        "始擊":"辰",
        "主算":24,
        "客算":25,
        "定算":25
    },
    {
        "局":"陽50局",
        "太乙":"乾",
        "文昌":"巳",
        "始擊":"午",
        "主算":16,
        "客算":15,
        "定算":15
    },
    {
        "局":"陽51局",
        "太乙":"乾",
        "文昌":"午",
        "始擊":"坤",
        "主算":15,
        "客算":13,
        "定算":6
    },
    {
        "局":"陽52局",
        "太乙":"午",
        "文昌":"未",
        "始擊":"酉",
        "主算":39,
        "客算":31,
        "定算":24
    },
    {
        "局":"陽53局",
        "太乙":"午",
        "文昌":"坤",
        "始擊":"亥",
        "主算":38,
        "客算":25,
        "定算":14
    },
    {
        "局":"陽54局",
        "太乙":"午",
        "文昌":"坤",
        "始擊":"子",
        "主算":38,
        "客算":24,
        "定算":9
    },
    {
        "局":"陽55局",
        "太乙":"艮",
        "文昌":"申",
        "始擊":"艮",
        "主算":16,
        "客算":3,
        "定算":22
    },
    {
        "局":"陽56局",
        "太乙":"艮",
        "文昌":"酉",
        "始擊":"辰",
        "主算":15,
        "客算":34,
        "定算":10
    },
    {
        "局":"陽57局",
        "太乙":"艮",
        "文昌":"戌",
        "始擊":"巳",
        "主算":10,
        "客算":25,
        "定算":1
    },
    {
        "局":"陽58局",
        "太乙":"卯",
        "文昌":"乾",
        "始擊":"未",
        "主算":12,
        "客算":26,
        "定算":37
    },
    {
        "局":"陽59局",
        "太乙":"卯",
        "文昌":"乾",
        "始擊":"申",
        "主算":12,
        "客算":19,
        "定算":28
    },
    {
        "局":"陽60局",
        "太乙":"卯",
        "文昌":"亥",
        "始擊":"戌",
        "主算":12,
        "客算":13,
        "定算":19
    },
    {
        "局":"陽61局",
        "太乙":"酉",
        "文昌":"子",
        "始擊":"亥",
        "主算":33,
        "客算":34,
        "定算":34
    },
    {
        "局":"陽62局",
        "太乙":"酉",
        "文昌":"丑",
        "始擊":"艮",
        "主算":26,
        "客算":25,
        "定算":25
    },
    {
        "局":"陽63局",
        "太乙":"酉",
        "文昌":"艮",
        "始擊":"卯",
        "主算":25,
        "客算":22,
        "定算":18
    },
    {
        "局":"陽64局",
        "太乙":"坤",
        "文昌":"寅",
        "始擊":"巽",
        "主算":16,
        "客算":11,
        "定算":7
    },
    {
        "局":"陽65局",
        "太乙":"坤",
        "文昌":"卯",
        "始擊":"未",
        "主算":15,
        "客算":1,
        "定算":28
    },
    {
        "局":"陽66局",
        "太乙":"坤",
        "文昌":"辰",
        "始擊":"申",
        "主算":12,
        "客算":34,
        "定算":19
    },
    {
        "局":"陽67局",
        "太乙":"子",
        "文昌":"巽",
        "始擊":"戌",
        "主算":25,
        "客算":2,
        "定算":26
    },
    {
        "局":"陽68局",
        "太乙":"子",
        "文昌":"巳",
        "始擊":"子",
        "主算":17,
        "客算":8,
        "定算":16
    },
    {
        "局":"陽69局",
        "太乙":"子",
        "文昌":"午",
        "始擊":"艮",
        "主算":16,
        "客算":32,
        "定算":7
    },
    {
        "局":"陽70局",
        "太乙":"巽",
        "文昌":"未",
        "始擊":"卯",
        "主算":30,
        "客算":4,
        "定算":15
    },
    {
        "局":"陽71局",
        "太乙":"巽",
        "文昌":"坤",
        "始擊":"巳",
        "主算":29,
        "客算":32,
        "定算":5
    },
    {
        "局":"陽72局",
        "太乙":"巽",
        "文昌":"坤",
        "始擊":"午",
        "主算":29,
        "客算":31,
        "定算":9
    },
    {
        "局":"陰1局",
        "太乙":"巽",
        "文昌":"寅",
        "始擊":"坤",
        "主算":5,
        "客算":29,
        "定算":7
    },
    {
        "局":"陰2局",
        "太乙":"巽",
        "文昌":"卯",
        "始擊":"戌",
        "主算":4,
        "客算":17,
        "定算":1
    },
    {
        "局":"陰3局",
        "太乙":"巽",
        "文昌":"辰",
        "始擊":"亥",
        "主算":1,
        "客算":16,
        "定算":30
    },
    {
        "局":"陰4局",
        "太乙":"子",
        "文昌":"巽",
        "始擊":"丑",
        "主算":25,
        "客算":33,
        "定算":2
    },
    {
        "局":"陰5局",
        "太乙":"子",
        "文昌":"巽",
        "始擊":"寅",
        "主算":25,
        "客算":30,
        "定算":1
    },
    {
        "局":"陰6局",
        "太乙":"子",
        "文昌":"巳",
        "始擊":"辰",
        "主算":17,
        "客算":26,
        "定算":30
    },
    {
        "局":"陰7局",
        "太乙":"坤",
        "文昌":"午",
        "始擊":"巳",
        "主算":2,
        "客算":3,
        "定算":3
    },
    {
        "局":"陰8局",
        "太乙":"坤",
        "文昌":"未",
        "始擊":"坤",
        "主算":1,
        "客算":7,
        "定算":7
    },
    {
        "局":"陰9局",
        "太乙":"坤",
        "文昌":"坤",
        "始擊":"酉",
        "主算":7,
        "客算":33,
        "定算":27
    },
    {
        "局":"陰10局",
        "太乙":"酉",
        "文昌":"申",
        "始擊":"乾",
        "主算":1,
        "客算":34,
        "定算":25
    },
    {
        "局":"陰11局",
        "太乙":"酉",
        "文昌":"酉",
        "始擊":"丑",
        "主算":6,
        "客算":26,
        "定算":19
    },
    {
        "局":"陰12局",
        "太乙":"酉",
        "文昌":"戌",
        "始擊":"寅",
        "主算":35,
        "客算":23,
        "定算":8
    },
    {
        "局":"陰13局",
        "太乙":"卯",
        "文昌":"乾",
        "始擊":"辰",
        "主算":12,
        "客算":37,
        "定算":13
    },
    {
        "局":"陰14局",
        "太乙":"卯",
        "文昌":"亥",
        "始擊":"午",
        "主算":12,
        "客算":27,
        "定算":11
    },
    {
        "局":"陰15局",
        "太乙":"卯",
        "文昌":"子",
        "始擊":"坤",
        "主算":11,
        "客算":25,
        "定算":4
    },
    {
        "局":"陰16局",
        "太乙":"艮",
        "文昌":"丑",
        "始擊":"酉",
        "主算":1,
        "客算":15,
        "定算":24
    },
    {
        "局":"陰17局",
        "太乙":"艮",
        "文昌":"艮",
        "始擊":"亥",
        "主算":3,
        "客算":9,
        "定算":16
    },
    {
        "局":"陰18局",
        "太乙":"艮",
        "文昌":"艮",
        "始擊":"子",
        "主算":3,
        "客算":8,
        "定算":9
    },
    {
        "局":"陰19局",
        "太乙":"午",
        "文昌":"寅",
        "始擊":"艮",
        "主算":14,
        "客算":16,
        "定算":16
    },
    {
        "局":"陰20局",
        "太乙":"午",
        "文昌":"卯",
        "始擊":"辰",
        "主算":13,
        "客算":10,
        "定算":10
    },
    {
        "局":"陰21局",
        "太乙":"午",
        "文昌":"辰",
        "始擊":"巳",
        "主算":10,
        "客算":1,
        "定算":39
    },
    {
        "局":"陰22局",
        "太乙":"乾",
        "文昌":"巽",
        "始擊":"未",
        "主算":24,
        "客算":14,
        "定算":1
    },
    {
        "局":"陰23局",
        "太乙":"乾",
        "文昌":"巽",
        "始擊":"申",
        "主算":24,
        "客算":7,
        "定算":40
    },
    {
        "局":"陰24局",
        "太乙":"乾",
        "文昌":"巳",
        "始擊":"戌",
        "主算":16,
        "客算":1,
        "定算":29
    },
    {
        "局":"陰25局",
        "太乙":"巽",
        "文昌":"午",
        "始擊":"亥",
        "主算":31,
        "客算":16,
        "定算":32
    },
    {
        "局":"陰26局",
        "太乙":"巽",
        "文昌":"未",
        "始擊":"艮",
        "主算":30,
        "客算":7,
        "定算":29
    },
    {
        "局":"陰27局",
        "太乙":"巽",
        "文昌":"坤",
        "始擊":"卯",
        "主算":29,
        "客算":4,
        "定算":16
    },
    {
        "局":"陰28局",
        "太乙":"子",
        "文昌":"申",
        "始擊":"巽",
        "主算":8,
        "客算":25,
        "定算":32
    },
    {
        "局":"陰29局",
        "太乙":"子",
        "文昌":"酉",
        "始擊":"未",
        "主算":7,
        "客算":15,
        "定算":26
    },
    {
        "局":"陰30局",
        "太乙":"子",
        "文昌":"戌",
        "始擊":"申",
        "主算":2,
        "客算":8,
        "定算":15
    },
    {
        "局":"陰31局",
        "太乙":"坤",
        "文昌":"乾",
        "始擊":"戌",
        "主算":27,
        "客算":28,
        "定算":28
    },
    {
        "局":"陰32局",
        "太乙":"坤",
        "文昌":"亥",
        "始擊":"子",
        "主算":27,
        "客算":26,
        "定算":26
    },
    {
        "局":"陰33局",
        "太乙":"坤",
        "文昌":"子",
        "始擊":"艮",
        "主算":26,
        "客算":18,
        "定算":15
    },
    {
        "局":"陰34局",
        "太乙":"酉",
        "文昌":"丑",
        "始擊":"卯",
        "主算":26,
        "客算":22,
        "定算":9
    },
    {
        "局":"陰35局",
        "太乙":"酉",
        "文昌":"艮",
        "始擊":"巳",
        "主算":25,
        "客算":10,
        "定算":1
    },
    {
        "局":"陰36局",
        "太乙":"酉",
        "文昌":"艮",
        "始擊":"午",
        "主算":25,
        "客算":9,
        "定算":34
    },
    {
        "局":"陰37局",
        "太乙":"卯",
        "文昌":"寅",
        "始擊":"坤",
        "主算":1,
        "客算":25,
        "定算":3
    },
    {
        "局":"陰38局",
        "太乙":"卯",
        "文昌":"卯",
        "始擊":"戌",
        "主算":4,
        "客算":13,
        "定算":37
    },
    {
        "局":"陰39局",
        "太乙":"卯",
        "文昌":"辰",
        "始擊":"亥",
        "主算":37,
        "客算":12,
        "定算":26
    },
    {
        "局":"陰40局",
        "太乙":"艮",
        "文昌":"巽",
        "始擊":"丑",
        "主算":33,
        "客算":1,
        "定算":10
    },
    {
        "局":"陰41局",
        "太乙":"艮",
        "文昌":"巽",
        "始擊":"寅",
        "主算":33,
        "客算":38,
        "定算":9
    },
    {
        "局":"陰42局",
        "太乙":"艮",
        "文昌":"巳",
        "始擊":"辰",
        "主算":25,
        "客算":34,
        "定算":38
    },
    {
        "局":"陰43局",
        "太乙":"午",
        "文昌":"午",
        "始擊":"巳",
        "主算":2,
        "客算":1,
        "定算":1
    },
    {
        "局":"陰44局",
        "太乙":"午",
        "文昌":"未",
        "始擊":"坤",
        "主算":39,
        "客算":38,
        "定算":38
    },
    {
        "局":"陰45局",
        "太乙":"午",
        "文昌":"坤",
        "始擊":"酉",
        "主算":38,
        "客算":31,
        "定算":25
    },
    {
        "局":"陰46局",
        "太乙":"乾",
        "文昌":"申",
        "始擊":"乾",
        "主算":7,
        "客算":1,
        "定算":31
    },
    {
        "局":"陰47局",
        "太乙":"乾",
        "文昌":"酉",
        "始擊":"丑",
        "主算":6,
        "客算":32,
        "定算":25
    },
    {
        "局":"陰48局",
        "太乙":"乾",
        "文昌":"戌",
        "始擊":"寅",
        "主算":1,
        "客算":29,
        "定算":14
    },
    {
        "局":"陰49局",
        "太乙":"巽",
        "文昌":"乾",
        "始擊":"辰",
        "主算":16,
        "客算":1,
        "定算":17
    },
    {
        "局":"陰50局",
        "太乙":"巽",
        "文昌":"亥",
        "始擊":"午",
        "主算":16,
        "客算":31,
        "定算":15
    },
    {
        "局":"陰51局",
        "太乙":"巽",
        "文昌":"子",
        "始擊":"坤",
        "主算":15,
        "客算":29,
        "定算":4
    },
    {
        "局":"陰52局",
        "太乙":"子",
        "文昌":"丑",
        "始擊":"酉",
        "主算":33,
        "客算":7,
        "定算":16
    },
    {
        "局":"陰53局",
        "太乙":"子",
        "文昌":"艮",
        "始擊":"亥",
        "主算":32,
        "客算":1,
        "定算":8
    },
    {
        "局":"陰54局",
        "太乙":"子",
        "文昌":"艮",
        "始擊":"子",
        "主算":32,
        "客算":8,
        "定算":1
    },
    {
        "局":"陰55局",
        "太乙":"坤",
        "文昌":"寅",
        "始擊":"艮",
        "主算":16,
        "客算":18,
        "定算":18
    },
    {
        "局":"陰56局",
        "太乙":"坤",
        "文昌":"卯",
        "始擊":"辰",
        "主算":15,
        "客算":12,
        "定算":12
    },
    {
        "局":"陰57局",
        "太乙":"坤",
        "文昌":"辰",
        "始擊":"巳",
        "主算":12,
        "客算":3,
        "定算":1
    },
    {
        "局":"陰58局",
        "太乙":"酉",
        "文昌":"巽",
        "始擊":"未",
        "主算":18,
        "客算":8,
        "定算":35
    },
    {
        "局":"陰59局",
        "太乙":"酉",
        "文昌":"巽",
        "始擊":"申",
        "主算":18,
        "客算":1,
        "定算":34
    },
    {
        "局":"陰60局",
        "太乙":"酉",
        "文昌":"巳",
        "始擊":"戌",
        "主算":10,
        "客算":35,
        "定算":23
    },
    {
        "局":"陰61局",
        "太乙":"卯",
        "文昌":"午",
        "始擊":"亥",
        "主算":27,
        "客算":12,
        "定算":28
    },
    {
        "局":"陰62局",
        "太乙":"卯",
        "文昌":"未",
        "始擊":"艮",
        "主算":26,
        "客算":3,
        "定算":25
    },
    {
        "局":"陰63局",
        "太乙":"卯",
        "文昌":"坤",
        "始擊":"卯",
        "主算":25,
        "客算":4,
        "定算":12
    },
    {
        "局":"陰64局",
        "太乙":"艮",
        "文昌":"申",
        "始擊":"巽",
        "主算":16,
        "客算":33,
        "定算":3
    },
    {
        "局":"陰65局",
        "太乙":"艮",
        "文昌":"酉",
        "始擊":"未",
        "主算":15,
        "客算":23,
        "定算":34
    },
    {
        "局":"陰66局",
        "太乙":"艮",
        "文昌":"戌",
        "始擊":"申",
        "主算":10,
        "客算":16,
        "定算":23
    },
    {
        "局":"陰67局",
        "太乙":"午",
        "文昌":"乾",
        "始擊":"戌",
        "主算":25,
        "客算":26,
        "定算":26
    },
    {
        "局":"陰68局",
        "太乙":"午",
        "文昌":"亥",
        "始擊":"子",
        "主算":25,
        "客算":24,
        "定算":24
    },
    {
        "局":"陰69局",
        "太乙":"午",
        "文昌":"子",
        "始擊":"艮",
        "主算":24,
        "客算":16,
        "定算":13
    },
    {
        "局":"陰70局",
        "太乙":"乾",
        "文昌":"丑",
        "始擊":"卯",
        "主算":32,
        "客算":28,
        "定算":15
    },
    {
        "局":"陰71局",
        "太乙":"乾",
        "文昌":"艮",
        "始擊":"巳",
        "主算":31,
        "客算":16,
        "定算":7
    },
    {
        "局":"陰72局",
        "太乙":"乾",
        "文昌":"艮",
        "始擊":"午",
        "主算":31,
        "客算":15,
        "定算":1
    }
    ];

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
function addRadialText(angle, startRadius, text, className) {
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
    textPath.setAttribute('startOffset', startRadius);
    textPath.textContent = text;
    textElement.appendChild(textPath);
    dynamicGroup.appendChild(textElement);
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
    circle.setAttribute('r', 12);
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
function renderChart(mainData, palacesData, agesData, sdrData, centerData, outerRingData, xingNianData) {
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
                    if (starName === '小遊') return 'xiaoyou-style';
                    if (starName === '大遊') return 'dayou-style';
                    return 'main-info-style';
                };
                if (pData.lineLeft.fieldA) addRadialText(angleLeft, RADIAL_LAYOUT.radii.lineLeft.fieldA, pData.lineLeft.fieldA, getLineLeftClass(pData.lineLeft.fieldA));
                if (pData.lineLeft.fieldB) addRadialText(angleLeft, RADIAL_LAYOUT.radii.lineLeft.fieldB, pData.lineLeft.fieldB, getLineLeftClass(pData.lineLeft.fieldB));
                if (pData.lineLeft.fieldG) addRadialText(angleLeft, RADIAL_LAYOUT.radii.lineLeft.fieldG, pData.lineLeft.fieldG, getLineLeftClass(pData.lineLeft.fieldG));
            }
            if (pData.lineCenter) {
                const getLineCenterClass = (starName) => {
                    if (['君基', '臣基', '民基'].includes(starName)) return 'ji-star-style';
                    return 'sub-info-style';
                };
                if (pData.lineCenter.fieldC) addRadialText(angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldC, pData.lineCenter.fieldC, getLineCenterClass(pData.lineCenter.fieldC));
                if (pData.lineCenter.fieldD) addRadialText(angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldD, pData.lineCenter.fieldD, getLineCenterClass(pData.lineCenter.fieldD));
                if (pData.lineCenter.fieldC2) addRadialText(angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldC2, pData.lineCenter.fieldC2, getLineCenterClass(pData.lineCenter.fieldC2));
                if (pData.lineCenter.fieldD2) addRadialText(angleCenter, RADIAL_LAYOUT.radii.lineCenter.fieldD2, pData.lineCenter.fieldD2, getLineCenterClass(pData.lineCenter.fieldD2));
            }
            if (pData.lineRight) {
                const getLineRightClass = (starName) => {
                    if (['天乙', '地乙', '四神', '飛符'].includes(starName)) return 'celestial-messenger-style';
                    if (starName === '皇恩星') return 'huang-en-style'; return 'deity-style';
                }; 
                if (pData.lineRight.fieldE) addRadialText(angleRight, RADIAL_LAYOUT.radii.lineRight.fieldE, pData.lineRight.fieldE, getLineRightClass(pData.lineRight.fieldE));
                if (pData.lineRight.fieldF) addRadialText(angleRight, RADIAL_LAYOUT.radii.lineRight.fieldF, pData.lineRight.fieldF, getLineRightClass(pData.lineRight.fieldF));
                if (pData.lineRight.fieldE2) addRadialText(angleRight, RADIAL_LAYOUT.radii.lineRight.fieldE2, pData.lineRight.fieldE2, getLineRightClass(pData.lineRight.fieldE2));
                if (pData.lineRight.fieldF2) addRadialText(angleRight, RADIAL_LAYOUT.radii.lineRight.fieldF2, pData.lineRight.fieldF2, getLineRightClass(pData.lineRight.fieldF2));
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
    function calculateBureau(birthDateString, hourJishu) {
        const parts = birthDateString.split('/');
        if (parts.length < 3) return "生日格式錯誤";
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        let bureauType = '陽';
        if ((month === 6 && day >= 21) || (month > 6 && month < 12) || (month === 12 && day < 21)) {
            bureauType = '陰';
        }
        const remainder = Number(hourJishu) % 72;
        const bureauNumber = (remainder === 0) ? 72 : remainder;
        return `${bureauType}${bureauNumber}局`;
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
                // 尋找 lineLeft 中第一個空的欄位來放入
                if (!chartData[palaceId].lineLeft.fieldA) {
                    chartData[palaceId].lineLeft.fieldA = '小遊';
                } else if (!chartData[palaceId].lineLeft.fieldB) {
                    chartData[palaceId].lineLeft.fieldB = '小遊';
                } else if (!chartData[palaceId].lineLeft.fieldG) {
                    chartData[palaceId].lineLeft.fieldG = '小遊';
                }
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

    // ▼▼▼ 新增：處理「皇恩星」 ▼▼▼
    if (huangEnResult) {
        const palaceId = BRANCH_TO_PALACE_ID[huangEnResult];
        if (palaceId && chartData.palaces[palaceId]) {
            // 尋找 lineRight 中第一個空的欄位來放入
            const fields = ['fieldE', 'fieldF', 'fieldE2', 'fieldF2'];
            for (const field of fields) {
                if (!chartData.palaces[palaceId].lineRight[field]) {
                    chartData.palaces[palaceId].lineRight[field] = '皇恩星';
                    break;
                }
            }
        }
    }
        
    // 處理「大遊」
    if (daYouResult) {
            const palaceId = BRANCH_TO_PALACE_ID[daYouResult];
            if (palaceId && chartData[palaceId]) {
                // 尋找 lineLeft 中第一個空的欄位來放入
                if (!chartData[palaceId].lineLeft.fieldA) {
                    chartData[palaceId].lineLeft.fieldA = '大遊';
                } else if (!chartData[palaceId].lineLeft.fieldB) {
                    chartData[palaceId].lineLeft.fieldB = '大遊';
                } else if (!chartData[palaceId].lineLeft.fieldG) {
                    chartData[palaceId].lineLeft.fieldG = '大遊';
                }
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

    const dayJishuInput = document.getElementById('day-jishu');
    const hourJishuInput = document.getElementById('hour-jishu');
    const calculateBtn = document.getElementById('calculate-btn');

    function prefillTestData() {
        document.getElementById('birth-year').value = '1976';
        document.getElementById('birth-month').value = '10';
        document.getElementById('birth-day').value = '14';
        document.getElementById('birth-hour').value = '22';
        document.getElementById('gender-female').checked = true;
        dayJishuInput.value = '11414856';
        hourJishuInput.value = '136978272';
    }

    function runCalculation(dataForCalculation, hour) {
        const bureauResult = calculateBureau(dataForCalculation.birthDate, dataForCalculation.hourJishu);
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

        // ▼▼▼ 這邊有新增新星都要增加，注意要寫成dataForCalculation ▼▼▼
        const newMainChartData = generateMainChartData(
            lookupResult,
            dataForCalculation.deitiesResult, dataForCalculation.suanStarsResult,
            dataForCalculation.shiWuFuResult, dataForCalculation.xiaoYouResult,
            dataForCalculation.junJiResult, dataForCalculation.chenJiResult, dataForCalculation.minJiResult,
            dataForCalculation.tianYiResult, dataForCalculation.diYiResult, dataForCalculation.siShenResult, dataForCalculation.feiFuResult,
            dataForCalculation.daYouResult, yueJiangData, guiRenData, dataForCalculation.huangEnResult);

        const centerData = {
             field1: dataForCalculation.suanStarsResult.centerStars[0] || '',
             field2: dataForCalculation.suanStarsResult.centerStars[1] || '',
             field3: dataForCalculation.suanStarsResult.centerStars[2] || '',
             field4: dataForCalculation.suanStarsResult.centerStars[3] || ''
        };

        renderChart(newMainChartData, newLifePalacesData, newAgeLimitData, newSdrData, centerData, outerRingData, xingNianData); 

        const shenPalaceId = Object.keys(newSdrData).find(k => newSdrData[k].includes('身'));
        const shenPalaceBranch = shenPalaceId ? PALACE_ID_TO_BRANCH[shenPalaceId] : '計算失敗';
        const huaYaoResults = calculateAllHuaYao(dataForCalculation.yearPillar.charAt(0), dataForCalculation.dayPillar.charAt(0), dataForCalculation.dayPillar.charAt(1))

        let outputText = `\n  局數 : ${bureauResult}\n  命宮 : ${lifePalaceId ? PALACE_ID_TO_BRANCH[lifePalaceId] + '宮' : '計算失敗'}\n  身宮 : ${shenPalaceBranch}宮`;
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
        if (huaYaoResults && huaYaoResults.nianGan) {
            outputText += `\n\n年干化曜：\n  天元官星: ${huaYaoResults.nianGan.tianYuan}\n  干元星: ${huaYaoResults.nianGan.ganYuan}\n  父母星: ${huaYaoResults.nianGan.fuMu}`;
        }
        if (huaYaoResults && huaYaoResults.riGan) {
            // 定義一個紅色星星的 HTML 圖片標籤
            const redStarImg = '<img src="img/star.svg" class="red-star-icon" alt="星">';
            outputText += `\n\n日干化曜：\n  天元祿主: ${huaYaoResults.riGan.luZhu}\n  偏祿: ${huaYaoResults.riGan.pianLu}\n  官星: ${huaYaoResults.riGan.guanXing}\n  妻財: ${huaYaoResults.riGan.qiCai}\n  ${redStarImg}忌星: ${huaYaoResults.riGan.jiXing}\n  ${redStarImg}鬼星: ${huaYaoResults.riGan.guiXing}`;
        }
        if (huaYaoResults && huaYaoResults.riZhi) {
            outputText += `\n\n日支化曜：\n  地元福星: ${huaYaoResults.riZhi.fuXing}`;
        }
        
        const summaryP = document.getElementById('calculation-summary');
        summaryP.innerHTML = outputText;
    }

    calculateBtn.addEventListener('click', () => {
        // 步驟 1: 從介面獲取最原始的輸入資料
        const year = parseInt(document.getElementById('birth-year').value, 10);
        const month = parseInt(document.getElementById('birth-month').value, 10);
        const day = parseInt(document.getElementById('birth-day').value, 10);
        const hour = parseInt(document.getElementById('birth-hour').value, 10);

        // 步驟 2: 呼叫萬年曆，建立日期物件並自動計算四柱
        const lunarDate = solarLunar.solar2lunar(year, month, day, hour);
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
        
        
        // 步驟 3: 準備一個物件，包含所有後續計算需要的資料
        const dataForCalculation = {
            birthDate: `${year}/${month}/${day}`,
            gender: document.querySelector('input[name="gender"]:checked').value === 'male' ? '男' : '女',
            yearPillar: lunarDate.getYearInGanZhi(),
            monthPillar: lunarDate.getMonthInGanZhi(),
            dayPillar: lunarDate.getDayInGanZhi(),
            hourPillar: lunarDate.getTimeInGanZhi(),
            dayJishu: dayJishuInput.value.trim(),
            hourJishu: hourJishuInput.value.trim()
        };

        // 2. 計算使用者的「當前實歲」
        const today = new Date();
        let currentUserAge = today.getFullYear() - year;
        if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
        currentUserAge--;
        }
        const startAge = currentUserAge - 20;
        const endAge = currentUserAge + 40;

        
        // 步驟 4: 執行所有安星計算，並將結果打包到一個物件中，這邊的函式要用等於
        const bureauResult = calculateBureau(dataForCalculation.birthDate, dataForCalculation.hourJishu);
        const lookupResult = lookupBureauData(bureauResult);
        
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
        xingNianData = calculateXingNian(dataForCalculation.gender, startAge, endAge);
        dataForCalculation.huangEnResult = calculateHuangEn(dataForCalculation.dayPillar.charAt(1))
      
        runCalculation(dataForCalculation, hour);
    });

    populateDateSelectors();
    prefillTestData();
    setTimeout(() => {
        calculateBtn.click();
    }, 10);
});