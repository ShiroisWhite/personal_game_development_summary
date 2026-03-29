// Visa Officer - 申请人背景池
// 共 24 条申请人，覆盖 F1/B1-B2/H1B/J1 各类型
// 国籍分布：华人约50%，其他地区约50%

const APPLICANTS = [
  {
    id: "app_001",
    name: "Wei Zhang（张伟）",
    nationality: "China",
    age: 28,
    gender: "M",
    visaType: "F1",
    hidden: {
      truePurpose: "润",
      trueIdentity: "游戏公司TA，年薪80万，真实目的是借留学身份办移民",
      immigrationIntent: true,
      falsifiedDocs: ["工作证明"],
      hiddenRisks: [
        "真实目的是移民而非求学",
        "工作证明夸大了在职时长（实际只2年，说5年）"
      ],
      vulnerabilities: [
        "无法清晰解释计算机科学基础（真实背景是TA，不是科班）",
        "对自己所说的研究方向了解有限"
      ]
    },
    application: {
      statedPurpose: "赴美攻读计算机科学硕士",
      statedOccupation: "软件工程师",
      statedFunds: "自费约7万美元",
      travelHistory: ["日本", "泰国"],
      invitationOrg: "Stanford University",
      supportingDocs: ["I-20", "录取通知书", "资金证明", "工作证明"]
    },
    openingStatement: "Good morning, officer. I'm very honored to have received an offer from Stanford University's Computer Science master's program. This has been my dream for many years. I was particularly attracted by Professor Andrew Ng's work in machine learning and hope to join his research group after completing my coursework."
  },
  {
    id: "app_002",
    name: "Ting Li（李婷）",
    nationality: "China",
    age: 34,
    gender: "F",
    visaType: "F1",
    hidden: {
      truePurpose: "移民",
      trueIdentity: "单身女性，房产多套，真实目的是通过留学最终移民",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "大龄单身女性，移民倾向明显",
        "无强回国约束（父母已移民海外）"
      ],
      vulnerabilities: [
        "对所申请的专业了解极其表面",
        "无法解释为何不在国内读研（三十四岁）"
      ]
    },
    application: {
      statedPurpose: "赴美攻读传媒学硕士学位",
      statedOccupation: "自由职业者",
      statedFunds: "自费约11万美元",
      travelHistory: ["韩国", "新加坡"],
      invitationOrg: "Columbia University",
      supportingDocs: ["I-20", "录取通知书", "资金证明"]
    },
    openingStatement: "Hello, officer. I am applying for an F1 visa to pursue a Master's degree in Journalism at Columbia University. I have always admired American journalism education and hope to bring those skills back to China to develop investigative reporting."
  },
  {
    id: "app_003",
    name: "Jianguo Zhou（周建国）",
    nationality: "China",
    age: 60,
    gender: "M",
    visaType: "B1/B2",
    hidden: {
      truePurpose: "探亲并考虑长期居留",
      trueIdentity: "女儿已获绿卡，真实目的想借探亲名义过去帮忙看孩子并伺机留下",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "女儿在美有绿卡且有移民倾向",
        "申请人与女儿关系复杂"
      ],
      vulnerabilities: [
        "对女儿在美生活状况描述矛盾",
        "说辞与材料不一致"
      ]
    },
    application: {
      statedPurpose: "探亲（看望女儿和外孙）",
      statedOccupation: "退休教师",
      statedFunds: "约4万美元",
      travelHistory: [],
      invitationOrg: "女儿 Zhou Lily（美国永久居民）",
      supportingDocs: ["邀请函", "亲属关系证明", "女儿绿卡复印件"]
    },
    openingStatement: "Ni hao, officer. I am going to visit my daughter and her family in Los Angeles. My daughter has been living there for fifteen years and became a permanent resident eight years ago. I haven't met my grandson who was born in America. I miss my family very much."
  },
  {
    id: "app_004",
    name: "Xiang Li（李想）",
    nationality: "China",
    age: 29,
    gender: "F",
    visaType: "F1",
    hidden: {
      truePurpose: "移民",
      trueIdentity: "有亲戚在美，真实目的是通过MBA最终移民",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "有亲戚在美且已移民",
        "移民倾向明显"
      ],
      vulnerabilities: [
        "无法清晰解释读完MBA后的回国计划",
        "对所申请学校的课程了解有限"
      ]
    },
    application: {
      statedPurpose: "攻读MBA学位",
      statedOccupation: "市场专员",
      statedFunds: "自费约8万美元",
      travelHistory: ["日本", "韩国"],
      invitationOrg: "NYU Stern School of Business",
      supportingDocs: ["I-20", "GMAT成绩", "录取通知书", "ESSAY"]
    },
    openingStatement: "Hello, officer. I have been admitted to NYU Stern's Full-time MBA program. I currently work at a multinational consumer goods company where I led several successful marketing campaigns. After completing my MBA, I plan to leverage my international perspective to help Chinese companies expand globally."
  },
  {
    id: "app_005",
    name: "Xiaowen Chen（陈晓文）",
    nationality: "China",
    age: 32,
    gender: "F",
    visaType: "B1/B2",
    hidden: {
      truePurpose: "借商务考察名义旅游",
      trueIdentity: "公司普通文员，商务邀请函系伪造",
      immigrationIntent: true,  // 伪造文件意图欺骗，视为有移民倾向
      falsifiedDocs: ["邀请函", "在职证明"],
      hiddenRisks: [
        "邀请函伪造（称参加芝加哥工业展，实则旅游）",
        "在职证明夸大职位"
      ],
      vulnerabilities: [
        "对所谓要参加的展会一无所知",
        "无法描述自己公司的主营业务"
      ]
    },
    application: {
      statedPurpose: "商务考察（参加芝加哥工业展）",
      statedOccupation: "市场部经理",
      statedFunds: "约2万美元",
      travelHistory: ["泰国"],
      invitationOrg: "Expo Chicago组委会",
      supportingDocs: ["邀请函", "在职证明", "行程单", "公司营业执照"]
    },
    openingStatement: "Good morning, officer. I'm traveling to the United States to attend the Chicago Industry Expo as a professional buyer. Our company is interested in sourcing some American manufacturing equipment and this exhibition will be an excellent opportunity to meet suppliers."
  },
  {
    id: "app_006",
    name: "Wei Chen（陈伟）",
    nationality: "China",
    age: 38,
    gender: "M",
    visaType: "H1B",
    hidden: {
      truePurpose: "跳槽",
      trueIdentity: "深圳某科技公司技术总监，真实目的是入职美国竞争对手",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "真实雇主与申请雇主不符（原雇主非 sponsoring 公司）",
        "可能涉及竞业协议"
      ],
      vulnerabilities: [
        "对申请雇主的基本信息了解不深",
        "无法解释为何放弃国内高位"
      ]
    },
    application: {
      statedPurpose: "为当前雇主赴美技术支持",
      statedOccupation: "高级软件工程师",
      statedFunds: "N/A（雇主提供）",
      travelHistory: ["美国（之前持H1B工作过2年）", "日本"],
      invitationOrg: "Current Tech Inc.",
      supportingDocs: ["H1B Approval Notice", "Employment Verification", "Tax Documents"]
    },
    openingStatement: "Good afternoon. I am currently employed as a senior software engineer with Current Tech Inc. and I'm applying for H1B extension to continue my work on their cloud infrastructure project in San Francisco."
  },
  {
    id: "app_007",
    name: "Bo Liu（刘博）",
    nationality: "China",
    age: 40,
    gender: "M",
    visaType: "H1B",
    hidden: {
      truePurpose: "跳槽",
      trueIdentity: "芯片公司技术VP，真实目的是入职美国公司",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "真实雇主与申请雇主不符",
        "芯片方向敏感"
      ],
      vulnerabilities: [
        "对申请雇主的项目了解有限",
        "无法解释离职原因"
      ]
    },
    application: {
      statedPurpose: "软件工程师",
      statedOccupation: "Senior Software Engineer",
      statedFunds: "N/A",
      travelHistory: ["日本", "新加坡"],
      invitationOrg: "Nvidia Corporation",
      supportingDocs: ["H1B Approval", "Employment Letter"]
    },
    openingStatement: "Good afternoon, officer. I am applying for H1B to work at Nvidia's Santa Clara headquarters as a senior software engineer on their GPU computing team."
  },
  {
    id: "app_008",
    name: "Haoran Sun（孙浩然）",
    nationality: "China",
    age: 24,
    gender: "M",
    visaType: "F1",
    hidden: {
      truePurpose: "求学",
      trueIdentity: "中科大少年班毕业，真实目的就是读博做学术",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "攻读物理学博士",
      statedOccupation: "应届毕业生",
      statedFunds: "全奖（年薪4万美元）",
      travelHistory: ["新加坡", "日本"],
      invitationOrg: "MIT Physics Department",
      supportingDocs: ["I-20", "全奖offer", "录取通知书", "学历证明"]
    },
    openingStatement: "Good morning, officer. I am honored to have been admitted to MIT's PhD program in Physics with a full research assistantship. My undergraduate advisor at USTC, Professor Zhang Wei, recommended this program. I hope to study quantum computing under Professor John Preskill."
  },
  {
    id: "app_009",
    name: "Zhiyuan Lin（林志远）",
    nationality: "China",
    age: 29,
    gender: "M",
    visaType: "J1",
    hidden: {
      truePurpose: "润",
      trueIdentity: "国内博后，真实目的通过博后转绿卡",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "研究计划夸大",
        "有移民倾向"
      ],
      vulnerabilities: [
        "对所谓的研究计划了解有限",
        "博后方向与之前研究方向不符"
      ]
    },
    application: {
      statedPurpose: "生物医学工程博后",
      statedOccupation: "国内高校博后",
      statedFunds: "国内高校资助+美方实验室补贴",
      travelHistory: ["澳大利亚"],
      invitationOrg: "Harvard Medical School",
      supportingDocs: ["DS-2019", "邀请信", "简历", "论文发表记录"]
    },
    openingStatement: "Good morning. I have been invited by Professor David Liu at Harvard Medical School to conduct postdoctoral research in biomedical engineering. My background is in molecular biology and I hope to learn CRISPR gene editing techniques."
  },
  {
    id: "app_010",
    name: "Mei Lin（林美）",
    nationality: "China",
    age: 26,
    gender: "F",
    visaType: "F1",
    hidden: {
      truePurpose: "求学",
      trueIdentity: "985高校CS专业毕业，真实目的就是读研深造",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "攻读计算机科学硕士学位",
      statedOccupation: "待入学",
      statedFunds: "自费约5.5万美元+助教奖学金",
      travelHistory: ["韩国"],
      invitationOrg: "Carnegie Mellon University",
      supportingDocs: ["I-20", "录取通知书", "GRE/TOEFL成绩", "资金证明"]
    },
    openingStatement: "Good morning. I have been admitted to CMU's Master of Computational Data Science program. I completed my undergraduate degree in Computer Science at Peking University with a GPA of 3.8. I am particularly interested in CMU's database systems research."
  },
  {
    id: "app_011",
    name: "Min-jun Kim（金敏俊）",
    nationality: "South Korea",
    age: 26,
    gender: "M",
    visaType: "F1",
    hidden: {
      truePurpose: "求学",
      trueIdentity: "延世大学CS毕业，真实目的就是去美国读研读博",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "攻读计算机科学博士",
      statedOccupation: "应届毕业生（延世大学）",
      statedFunds: "全奖+助教",
      travelHistory: ["Japan"],
      invitationOrg: "Stanford University",
      supportingDocs: ["I-20", "录取通知书（全奖）", "TOEFL成绩", "Publication"]
    },
    openingStatement: "Hello. I graduated from Yonsei University in Korea with a Bachelor's in Computer Science and have been admitted to Stanford's PhD program in Computer Science with a full research fellowship. I hope to research artificial intelligence under Professor Fei-Fei Li."
  },
  {
    id: "app_012",
    name: "Priya Sharma（普里亚·夏尔马）",
    nationality: "India",
    age: 24,
    gender: "F",
    visaType: "H1B",
    hidden: {
      truePurpose: "工作",
      trueIdentity: "印度理工毕业，Amazon SDE，材料真实",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "软件工程师",
      statedOccupation: "Amazon SDE II",
      statedFunds: "N/A",
      travelHistory: ["UAE", "Singapore"],
      invitationOrg: "Amazon.com",
      supportingDocs: ["H1B Approval", "Pay Slips", "Employment Letter"]
    },
    openingStatement: "Good afternoon. I am a software development engineer at Amazon and I am applying for my initial H1B visa. I graduated from IIT Bombay and have been working at Amazon's Seattle headquarters for two years on the AWS Lambda team."
  },
  {
    id: "app_013",
    name: "Ahmed Hassan（艾哈迈德·哈桑）",
    nationality: "Egypt",
    age: 29,
    gender: "M",
    visaType: "F1",
    hidden: {
      truePurpose: "求学+可能移民",
      trueIdentity: "开罗大学工程专业，移民倾向中等",
      immigrationIntent: true,
      falsifiedDocs: [],
    hiddenRisks: [
      "有移民倾向",
      "回国约束较弱"
    ],
      vulnerabilities: [
        "回国约束较弱",
        "对研究计划描述一般"
      ]
    },
    application: {
      statedPurpose: "攻读机械工程硕士",
      statedOccupation: "工程公司助理",
      statedFunds: "奖学金+自费",
      travelHistory: ["UAE"],
      invitationOrg: "University of Michigan",
      supportingDocs: ["I-20", "奖学金信", "成绩单"]
    },
    openingStatement: "Hello, officer. I have been admitted to the University of Michigan's Master's program in Mechanical Engineering with a partial scholarship. After my studies, I plan to return to Egypt to work in the growing renewable energy sector."
  },
  {
    id: "app_014",
    name: "Yuki Tanaka（田中由纪）",
    nationality: "Japan",
    age: 31,
    gender: "F",
    visaType: "J1",
    hidden: {
      truePurpose: "学术交流",
      trueIdentity: "东京大学研究员，真实目的正常学术交流",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "访问学者（机器人方向）",
      statedOccupation: "东京大学研究员",
      statedFunds: "日本学术振兴会资助",
      travelHistory: ["Germany", "France"],
      invitationOrg: "CMU Robotics Institute",
      supportingDocs: ["DS-2019", "邀请信", "资助证明"]
    },
    openingStatement: "Hello. I am a researcher at the University of Tokyo's JSK Robotics Laboratory and I will be conducting collaborative research on humanoid robots at CMU's Robotics Institute for twelve months. I am excited to work with Professor Takeo Kanade."
  },
  {
    id: "app_015",
    name: "Ana Oliveira（安娜·奥利维拉）",
    nationality: "Brazil",
    age: 34,
    gender: "F",
    visaType: "B1/B2",
    hidden: {
      truePurpose: "医疗",
      trueIdentity: "真实目的去美国看病，有轻微移民倾向",
      immigrationIntent: true,
      falsifiedDocs: ["银行流水"],
      hiddenRisks: [
        "移民倾向",
        "材料可能有夸大"
      ],
      vulnerabilities: [
        "对医疗计划描述模糊",
        "资金证明有问题"
      ]
    },
    application: {
      statedPurpose: "旅游+看病",
      statedOccupation: "幼教老师",
      statedFunds: "约5.5万美元",
      travelHistory: ["Argentina"],
      invitationOrg: "Mayo Clinic（预约函）",
      supportingDocs: ["预约函", "银行流水", "行程单"]
    },
    openingStatement: "Good morning. I have a medical appointment at the Mayo Clinic in Minnesota for a second opinion on my treatment. I have documentation from my Brazilian doctor recommending this consultation. I also plan to do some sightseeing in New York afterward."
  },
  {
    id: "app_016",
    name: "Mohammed Ali（穆罕默德·阿里）",
    nationality: "Pakistan",
    age: 27,
    gender: "M",
    visaType: "F1",
    hidden: {
      truePurpose: "技术移民",
      trueIdentity: "真实目的是借留学身份办移民",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "移民倾向明显",
        "来自敏感地区"
      ],
      vulnerabilities: [
        "无法清晰解释回国计划",
        "对专业了解一般"
      ]
    },
    application: {
      statedPurpose: "攻读电子工程硕士",
      statedOccupation: "通信公司技术员",
      statedFunds: "全额奖学金",
      travelHistory: ["UAE"],
      invitationOrg: "Georgia Tech",
      supportingDocs: ["I-20", "奖学金信"]
    },
    openingStatement: "Hello, officer. I have been admitted to Georgia Tech's Master's program in Electrical Engineering with a full research assistantship. I hope to study signal processing and communications systems."
  },
  {
    id: "app_017",
    name: "Olga Petrov（奥尔加·彼得罗娃）",
    nationality: "Russia",
    age: 25,
    gender: "F",
    visaType: "F1",
    hidden: {
      truePurpose: "求学",
      trueIdentity: "莫斯科国立大学数学系毕业，真实目的就是读研",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "攻读数学博士",
      statedOccupation: "应届毕业生",
      statedFunds: "全奖",
      travelHistory: ["France", "Germany"],
      invitationOrg: "Princeton University",
      supportingDocs: ["I-20", "全奖offer"]
    },
    openingStatement: "Hello. I graduated from Moscow State University with honors in Mathematics and have been admitted to Princeton's PhD program in Pure Mathematics. I hope to study under Professor John Conway's legacy."
  },
  {
    id: "app_018",
    name: "Carlos Rodriguez（卡洛斯·罗德里格斯）",
    nationality: "Mexico",
    age: 35,
    gender: "M",
    visaType: "B1/B2",
    hidden: {
      truePurpose: "探亲",
      trueIdentity: "哥哥在美已入籍，真实目的是借机滞留",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "移民倾向",
        "有亲戚在美"
      ],
      vulnerabilities: [
        "行程计划模糊",
        "对在美亲戚情况描述矛盾"
      ]
    },
    application: {
      statedPurpose: "旅游",
      statedOccupation: "厨师",
      statedFunds: "15万比索",
      travelHistory: [],
      invitationOrg: "哥哥（美国公民）",
      supportingDocs: ["邀请函", "银行流水"]
    },
    openingStatement: "Hello, officer. I am planning a two-week trip to Los Angeles to visit my older brother who became a US citizen five years ago. This is my first time traveling abroad."
  },
  {
    id: "app_019",
    name: "Fatima Hassan（法蒂玛·哈桑）",
    nationality: "Nigeria",
    age: 30,
    gender: "F",
    visaType: "J1",
    hidden: {
      truePurpose: "学术交流",
      trueIdentity: "拉各斯大学讲师，真实目的正常学术交流",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "访问学者（公共卫生方向）",
      statedOccupation: "讲师",
      statedFunds: "尼日利亚政府资助",
      travelHistory: ["UK", "Ghana"],
      invitationOrg: "Johns Hopkins Bloomberg School",
      supportingDocs: ["DS-2019", "邀请信"]
    },
    openingStatement: "Good afternoon. I am a lecturer at the University of Lagos in Public Health and I have been invited by Johns Hopkins to conduct six months of collaborative research on infectious disease surveillance."
  },
  {
    id: "app_020",
    name: "Kenji Watanabe（渡边健二）",
    nationality: "Japan",
    age: 40,
    gender: "M",
    visaType: "H1B",
    hidden: {
      truePurpose: "工作",
      trueIdentity: "索尼工程师，真实目的正常工作",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "软件工程师",
      statedOccupation: "Sony Senior Engineer",
      statedFunds: "N/A",
      travelHistory: ["USA", "Taiwan"],
      invitationOrg: "Sony Interactive Entertainment",
      supportingDocs: ["H1B Approval", "Employment Letter"]
    },
    openingStatement: "Good afternoon. I am a senior software engineer at Sony and I am applying for H1B to transfer to Sony's San Mateo studio to work on PlayStation game development."
  },
  {
    id: "app_021",
    name: "Sven Lindberg（斯文·林德伯格）",
    nationality: "Sweden",
    age: 29,
    gender: "M",
    visaType: "F1",
    hidden: {
      truePurpose: "创业移民",
      trueIdentity: "真实目的是通过创业最终移民",
      immigrationIntent: true,
      falsifiedDocs: ["商业计划书"],
      hiddenRisks: [
        "移民倾向",
        "商业计划夸大"
      ],
      vulnerabilities: [
        "对商业计划的细节了解有限",
        "资金来源模糊"
      ]
    },
    application: {
      statedPurpose: "攻读MBA",
      statedOccupation: "咨询公司分析师",
      statedFunds: "自费+奖学金",
      travelHistory: ["Germany", "UK"],
      invitationOrg: "Harvard Business School",
      supportingDocs: ["I-20", "GMAT", "商业计划书"]
    },
    openingStatement: "Hello, officer. I have been admitted to Harvard Business School and I plan to launch a sustainable technology startup after graduation. I currently work at McKinsey in Stockholm."
  },
  {
    id: "app_022",
    name: "Amara Okafor（阿马拉·奥卡福）",
    nationality: "Nigeria",
    age: 26,
    gender: "F",
    visaType: "F1",
    hidden: {
      truePurpose: "求学",
      trueIdentity: "拉各斯大学CS毕业，真实目的就是读研",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "攻读计算机硕士",
      statedOccupation: "软件开发公司初级工程师",
      statedFunds: "奖学金+自费",
      travelHistory: ["UK"],
      invitationOrg: "UT Austin",
      supportingDocs: ["I-20", "GRE", "奖学金信"]
    },
    openingStatement: "Good morning. I graduated from University of Lagos with a First Class degree in Computer Science and have been admitted to UT Austin's Master's program in Computer Science with a partial scholarship. I hope to specialize in artificial intelligence."
  },
  {
    id: "app_023",
    name: "James Wright（詹姆斯·赖特）",
    nationality: "UK",
    age: 33,
    gender: "M",
    visaType: "H1B",
    hidden: {
      truePurpose: "工作",
      trueIdentity: "Lloyd's银行quant，真实目的正常工作",
      immigrationIntent: false,
      falsifiedDocs: [],
      hiddenRisks: [],
      vulnerabilities: []
    },
    application: {
      statedPurpose: "金融quant",
      statedOccupation: "Lloyd's of London Analyst",
      statedFunds: "N/A",
      travelHistory: ["USA", "Germany", "France"],
      invitationOrg: "Goldman Sachs",
      supportingDocs: ["H1B Approval", "Employment Letter"]
    },
    openingStatement: "Good afternoon. I am a quantitative analyst at Lloyd's of London and I have received an offer from Goldman Sachs in New York to lead their derivatives pricing team. I am applying for H1B to transfer."
  },
  {
    id: "app_024",
    name: "Dimitri Papadopoulos（迪米特里·帕帕佐普洛斯）",
    nationality: "Greece",
    age: 45,
    gender: "M",
    visaType: "B1/B2",
    hidden: {
      truePurpose: "房产考察",
      trueIdentity: "船运公司老板，真实目的考察投资美国房产",
      immigrationIntent: true,
      falsifiedDocs: [],
      hiddenRisks: [
        "高净值，有投资移民倾向"
      ],
      vulnerabilities: [
        "对行程描述模糊",
        "投资意向过于明显"
      ]
    },
    application: {
      statedPurpose: "商务考察（房地产）",
      statedOccupation: "船运公司老板",
      statedFunds: "无上限",
      travelHistory: ["USA", "UAE"],
      invitationOrg: "Coldwell Banker Miami",
      supportingDocs: ["邀请函", "公司资质", "银行资产证明"]
    },
    openingStatement: "Good afternoon. I am the owner of a shipping company in Athens and I am traveling to Miami to explore real estate investment opportunities. A friend who is a US citizen recommended this to me."
  }
];
