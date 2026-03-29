// Visa Officer - 政策事件库
// 共 15 条政策事件，覆盖国安/人道/效率多类型

const EVENTS = [
  {
    id: "EV01",
    title: "边境安全警报",
    trigger: {
      condition: "连续放过2个材料有疑虑的申请人",
      checkFn: `
        (() => {
          const recent = state.history.slice(-5);
          const falseNegatives = recent.filter(h =>
            !h.wasCorrect && h.decision === 'approved'
          );
          return falseNegatives.length >= 2;
        })()
      `
    },
    headline: "【安全通报】入境口岸查获多起签证欺诈",
    body: "国土安全部通报：近期多个入境口岸查获伪造签证文件案件。上级要求各领事馆加强签证材料审核，对可疑申请一律从严。",
    effect: {
      immigrationTone: -1,
      nationalSecurity: 10
    },
    narrative: "今天的晨会气氛凝重。一份来自国土安全部的通报被传阅——几个伪造签证文件的家伙在入境口岸被拦下了，而我们这里刚刚放过了几个材料看起来有点软头的申请人。主任的脸色不太好看。"
  },
  {
    id: "EV02",
    title: "STEM领域风险提示",
    trigger: {
      condition: "连续放过3个STEM方向F1申请人",
      checkFn: `
        (() => {
          const recent = state.history.slice(-5);
          const falseNegatives = recent.filter(h =>
            !h.wasCorrect && h.decision === 'approved' && h.visaType === 'F1'
          );
          return falseNegatives.length >= 3;
        })()
      `
    },
    headline: "【内部警示】STEM签证审核标准调整",
    body: "上级部门提醒：STEM领域的F1签证审核需要更加严格，特别是涉及实验室和研究项目的申请。请重点审查资金来源和研究计划的真实性。",
    effect: {
      studentTone: -1,
      nationalSecurity: 5
    },
    narrative: "今天的内部邮件让所有人都不太轻松。STEM领域的审核标准要提高了，特别是那些涉及前沿研究的申请。我想起前两天放过的几个学生，他们的材料确实有点经不起推敲……"
  },
  {
    id: "EV03",
    title: "积压投诉",
    trigger: {
      condition: "连续拒绝超过5位申请人",
      checkFn: `
        (() => {
          const recent = state.history.slice(-6);
          const rejected = recent.filter(h => h.decision === 'rejected');
          return rejected.length >= 5;
        })()
      `
    },
    headline: "【效率警告】签证申请积压严重",
    body: "由于近期拒绝率过高，导致大量申请积压。上级要求在确保质量的前提下适当提高效率，避免积压进一步恶化。",
    effect: {
      efficiency: -10,
      immigrationTone: 1
    },
    narrative: "主任在晨会上点名批评了我们的积压数字。'签证官要学会平衡'，他说，'不是每个申请人都值得花半小时审'。我低头看了看面前堆积的文件夹，陷入了沉思。"
  },
  {
    id: "EV04",
    title: "超时警告",
    trigger: {
      condition: "单个申请人审讯超过8次对话",
      checkFn: `
        (() => {
          return state.today.applicantAnswerCount > 8;
        })()
      `
    },
    headline: "【效率提醒】单个案例审讯超时",
    body: "你当前审讯时间过长，请注意效率。每个申请人的审讯时间有限，过度审讯会影响整体工作效率。",
    effect: {
      efficiency: -5
    },
    narrative: "系统弹出超时提醒。我看了看时间，不知不觉已经和这位申请人聊了很久。这样下去，今天的申请人都要积压到明天了。"
  },
  {
    id: "EV05",
    title: "假材料识别奖励",
    trigger: {
      condition: "一天内正确识别2个以上假材料",
      checkFn: `
        (() => {
          const today = state.history.filter(h => h.day === state.day);
          const correctWithFalsified = today.filter(h => {
            const app = APPLICANTS.find(a => a.id === h.applicantId);
            return h.wasCorrect && app && app.hidden.falsifiedDocs && app.hidden.falsifiedDocs.length > 0;
          });
          return correctWithFalsified.length >= 2;
        })()
      `
    },
    headline: "【表扬】材料真伪识别准确",
    body: "你今天对假材料的识别帮助避免了潜在的签证欺诈行为。特此表扬，请继续保持高标准。",
    effect: {
      nationalSecurity: 10,
      efficiency: 5
    },
    narrative: "今天的邮件里有一封表扬信，说我识别出了两份伪造的工作证明。主任路过时拍了拍我的肩膀，说我是'火眼金睛'。我笑了笑，泡了杯咖啡，继续处理下一个申请人。"
  },
  {
    id: "EV06",
    title: "人道主义案例",
    trigger: {
      condition: "申请人有弱势特征且材料真实",
      checkFn: `
        (() => {
          const app = APPLICANTS.find(a => a.id === state.today.currentApplicantId);
          if (!app) return false;
          return app.hidden.vulnerabilities && app.hidden.vulnerabilities.length > 0
            && !app.hidden.immigrationIntent
            && (!app.hidden.falsifiedDocs || app.hidden.falsifiedDocs.length === 0);
        })()
      `
    },
    headline: "【人道考量】需要关注特殊申请人",
    body: "该申请人存在一些弱势特征，请在审核时考虑人道主义因素。在确保国家安全的前提下，给予适当关怀。",
    effect: {
      humanitarian: 5
    },
    narrative: "今天遇到一位独自抚养孩子的单亲妈妈申请探亲签证。她的材料都很真实，但生活确实困难。我在心里叹了口气，在签证上写下了'批准'两个字。"
  },
  {
    id: "EV07",
    title: "系统维护",
    trigger: {
      condition: "随机触发",
      checkFn: `(() => { return Math.random() < 0.05; })()`
    },
    headline: "【系统通知】签证系统维护",
    body: "签证系统将于今晚进行例行维护，届时系统可能出现短暂不稳定。请各位签证官注意保存工作进度。",
    effect: {
      efficiency: -5
    },
    narrative: "邮件里说系统今晚要维护。这几天系统确实有点慢，希望维护完能快一点。"
  },
  {
    id: "EV08",
    title: "政策调整",
    trigger: {
      condition: "移民倾向指标过高或过低",
      checkFn: `
        (() => {
          return state.policy.immigrationTone >= 2 || state.policy.immigrationTone <= -2;
        })()
      `
    },
    headline: "【政策速递】签证审核标准调整",
    body: "根据当前签证形势，审核标准进行相应调整。请关注政策变化，及时调整审核策略。",
    effect: {
      immigrationTone: 0
    },
    narrative: "今天的晨会上，新政策被传达下来了。整体方向是宽严结合，具体怎么把握，还得看实际情况。"
  },
  {
    id: "EV09",
    title: "漏放高风险",
    trigger: {
      condition: "放行有移民倾向且材料有问题的申请人",
      checkFn: `
        (() => {
          const last = state.history[state.history.length - 1];
          if (!last || last.decision !== 'approved') return false;
          const app = APPLICANTS.find(a => a.id === last.applicantId);
          return app && app.hidden.immigrationIntent && app.hidden.falsifiedDocs && app.hidden.falsifiedDocs.length > 0;
        })()
      `
    },
    headline: "【安全追责】漏放高风险申请人",
    body: "经复查，你此前批准的一名申请人存在重大问题。该申请人入境后失联，疑似涉及非法活动。请提高警惕。",
    effect: {
      nationalSecurity: -15,
      immigrationTone: -1
    },
    narrative: "这天的邮件让我心惊肉跳。三个月前我批准的一个F1学生，入境后失联了，据说涉嫌非法工作。我开始反复回看那天的记录，但记忆已经模糊了……"
  },
  {
    id: "EV10",
    title: "冤枉好人",
    trigger: {
      condition: "拒绝材料真实且无移民倾向的申请人",
      checkFn: `
        (() => {
          const last = state.history[state.history.length - 1];
          if (!last || last.decision !== 'rejected') return false;
          const app = APPLICANTS.find(a => a.id === last.applicantId);
          return app && !app.hidden.immigrationIntent && (!app.hidden.falsifiedDocs || app.hidden.falsifiedDocs.length === 0);
        })()
      `
    },
    headline: "【人道反思】误拒真实申请人",
    body: "经复查，你此前拒绝的一名申请人材料真实、意图正当，此次拒签属于误判。请在今后的审核中更加审慎。",
    effect: {
      humanitarian: -10,
      efficiency: -3
    },
    narrative: "这个案子我记了很久。一个真心想来读书的女孩，被我用'移民倾向'为由拒绝了。后来才知道，她的全部家当都押在了这次留学上……"
  },
  {
    id: "EV11",
    title: "投资移民热",
    trigger: {
      condition: "连续批准3个B1/B2高资金申请人",
      checkFn: `
        (() => {
          const recent = state.history.slice(-4);
          const approved = recent.filter(h =>
            h.decision === 'approved' && h.visaType === 'B1/B2'
          );
          return approved.length >= 3;
        })()
      `
    },
    headline: "【趋势观察】投资类签证审核从严",
    body: "近期投资类签证申请激增，其中部分涉及资金来源不明。请对B1/B2高资金申请严格审查资金证明。",
    effect: {
      immigrationTone: -1,
      nationalSecurity: 5
    },
    narrative: "最近来的B类申请人一个比一个有钱，开口就是投资考察。但资金来源能不能经得起推敲，就不好说了。"
  },
  {
    id: "EV12",
    title: "表扬信",
    trigger: {
      condition: "当日准确率100%",
      checkFn: `
        (() => {
          const today = state.history.filter(h => h.day === state.day);
          if (today.length < 3) return false;
          return today.every(h => h.wasCorrect);
        })()
      `
    },
    headline: "【嘉奖】本日审核零失误",
    body: "恭喜你！本日所有签证判断均准确无误，表现优异。请继续保持，为国家安全和人道主义事业贡献力量。",
    effect: {
      nationalSecurity: 8,
      humanitarian: 8,
      efficiency: 8
    },
    narrative: "今天的成就感满满。每一个判断都被证明是正确的——该通过的顺利入境，该拒绝的确实有问题。晚上回家，我破例喝了杯酒庆祝。"
  },
  {
    id: "EV13",
    title: "周末加班",
    trigger: {
      condition: "效率指标连续3天下降",
      checkFn: `
        (() => {
          if (state.stats.efficiency < 40 && state.day > 3) {
            const prev = state.history.filter(h => h.day >= state.day - 3 && h.day < state.day);
            return prev.length > 0 && prev.every(h => !h.wasCorrect);
          }
          return false;
        })()
      `
    },
    headline: "【工作安排】周末需要加班处理积压",
    body: "由于近期工作积压严重，周末需要安排加班处理。请提前做好工作安排。",
    effect: {
      efficiency: -5,
      humanitarian: -3
    },
    narrative: "连续几天的失误导致积压越来越严重。主任说周末要来加班处理。我叹了口气，开始整理面前的文件夹。"
  },
  {
    id: "EV14",
    title: "中期评定",
    trigger: {
      condition: "第5天自动触发",
      checkFn: `(() => { return state.day === 5; })()`
    },
    headline: "【任期评定】第一周工作评估",
    body: "你已经完成了第一周的签证官工作。上级对你的表现进行了中期评估，各项指标详见档案。",
    effect: {
      nationalSecurity: 0,
      humanitarian: 0,
      efficiency: 0
    },
    narrative: "到周五了。五天的时间，我处理了不少案子，也犯过一些错误。主任找我谈了话，说整体还行，但还有进步空间。"
  },
  {
    id: "EV15",
    title: "任期结束",
    trigger: {
      condition: "第10天自动触发",
      checkFn: `(() => { return state.day === 10; })()`
    },
    headline: "【任期结束】综合评定报告",
    body: "恭喜你完成了为期10天的签证官任期。你的综合表现将决定是否继续留任。详细评定报告将在结局中展示。",
    effect: {
      nationalSecurity: 0,
      humanitarian: 0,
      efficiency: 0
    },
    narrative: "十天就这样过去了。最后一天结束时，我整理好桌面，把所有档案归档。接下来的评定，会决定我是否还能继续坐在这个位置上。"
  }
];
