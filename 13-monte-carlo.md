# 蒙特卡洛方法学习笔记

## 1. 基本概念与数学基础

### 1.1 什么是蒙特卡洛方法
蒙特卡洛方法（Monte Carlo Method）是一种通过大量随机采样来近似求解复杂数学问题的数值方法。用随机模拟代替精确计算，通过"做实验"来求解数学问题，特别适用于复杂的概率问题和多维积分计算。

### 1.2 数学基础

#### 1.2.1 大数定律（Law of Large Numbers）
设 $X_1, X_2, \ldots, X_n$ 是独立同分布的随机变量，期望值为 $\mu = E[X_i]$，则样本均值：

$$\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i$$

当 $n \to \infty$ 时，$\bar{X}_n$ 依概率收敛到 $\mu$：

$$\lim_{n \to \infty} P(|\bar{X}_n - \mu| > \epsilon) = 0, \quad \forall \epsilon > 0$$

这是蒙特卡洛方法收敛性的理论基础。

**游戏例子：验证5%的装备掉落概率**

假设你设计了一个怪物，理论上有5%的概率掉落稀有装备。为了验证这个设定是否正确，你让玩家测试员进行了大量的击杀试验。

- $X_i$：第i次击杀的结果（1表示掉落装备，0表示不掉落）
- $\mu = 0.05$：理论掉落概率（期望值）
- $n$：总击杀次数
- $\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i$：观测到的掉落率（样本均值）

**具体对应：**
- 第1次击杀：$X_1 = 0$（没掉落）
- 第2次击杀：$X_2 = 0$（没掉落）
- 第3次击杀：$X_3 = 1$（掉落了！）
- ...
- 第n次击杀：$X_n = 0$（没掉落）

大数定律告诉我们：**当击杀次数n越来越大时，观测掉落率$\bar{X}_n$会越来越接近理论值5%。**

比如：
- 击杀100次：观测掉落率可能是7%
- 击杀1000次：观测掉落率可能是4.8%
- 击杀10000次：观测掉落率可能是5.02%
- 击杀100000次：观测掉落率会非常接近5%

这就是为什么蒙特卡洛模拟需要大量样本的数学原理。

#### 1.2.2 中心极限定理（Central Limit Theorem）
在相同条件下，当样本量足够大时，样本均值的分布趋近于正态分布：

$$\sqrt{n}(\bar{X}_n - \mu) \xrightarrow{d} N(0, \sigma^2)$$

其中 $\sigma^2 = Var(X_i)$。这意味着：

$$\bar{X}_n \sim N\left(\mu, \frac{\sigma^2}{n}\right)$$

**公式推导过程：**

*第一步：样本均值的分布*
根据中心极限定理，当样本量n足够大时，样本均值$\bar{X}_n$服从正态分布：
$$\bar{X}_n \sim N\left(\mu, \frac{\sigma^2}{n}\right)$$

这意味着：
- 期望值：$E[\bar{X}_n] = \mu$
- 方差：$Var(\bar{X}_n) = \frac{\sigma^2}{n}$  
- 标准差：$SD(\bar{X}_n) = \frac{\sigma}{\sqrt{n}}$

*第二步：标准化过程*
为了得到标准正态分布，我们需要标准化：
$$Z = \frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \sim N(0, 1)$$

*第三步：重新整理公式*
将上面的公式重新整理：
$$Z = \frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} = \frac{(\bar{X}_n - \mu) \times \sqrt{n}}{\sigma} = \frac{\sqrt{n}(\bar{X}_n - \mu)}{\sigma}$$

*第四步：两边同时乘以σ*
$$\sigma Z = \sqrt{n}(\bar{X}_n - \mu)$$

由于$Z \sim N(0, 1)$，所以$\sigma Z \sim N(0, \sigma^2)$

*第五步：得到最终结果*
$$\sqrt{n}(\bar{X}_n - \mu) \sim N(0, \sigma^2)$$

**为什么要乘以$\sqrt{n}$？**

1. **原始差距太小**：$(\bar{X}_n - \mu)$ 的方差是 $\frac{\sigma^2}{n}$，随着n增大会趋于0
2. **放大到合适尺度**：乘以$\sqrt{n}$后，方差变成 $n \times \frac{\sigma^2}{n} = \sigma^2$，保持不变
3. **便于分析**：这样得到的分布不依赖于样本量n，具有稳定的统计性质

换句话说，$\sqrt{n}$是一个"放大器"，将越来越小的差距重新放大到一个固定的尺度上，使我们能够研究样本均值围绕真实均值的波动规律。

**游戏例子：玩家每日游戏时长分析**

假设你要分析玩家的每日游戏时长。每个玩家的游戏时长是不规律的（可能服从任何分布），但你想知道"平均游戏时长"的分布规律。

- $X_i$：第i个玩家的每日游戏时长（单位：小时）
- $\mu = 2.5$：所有玩家平均游戏时长的真实值（小时）
- $\sigma^2 = 4$：单个玩家游戏时长的方差（小时²）
- $n$：采样的玩家数量
- $\bar{X}_n$：n个玩家的平均游戏时长

**具体对应：**
- 玩家A：$X_1 = 1.2$小时（轻度玩家）
- 玩家B：$X_2 = 6.8$小时（重度玩家）
- 玩家C：$X_3 = 0.5$小时（偶尔玩玩）
- 玩家D：$X_4 = 4.1$小时（中度玩家）
- ...

**中心极限定理告诉我们：**

无论单个玩家的游戏时长分布是什么样子（可能很不规律），当我们统计足够多玩家时，**这些玩家的平均游戏时长$\bar{X}_n$会服从正态分布**：

$$\bar{X}_n \sim N\left(2.5, \frac{4}{n}\right)$$

这意味着：
- 如果调查100个玩家（n=100），平均时长的分布为：$N(2.5, 0.04)$，标准差=0.2小时
- 如果调查1000个玩家（n=1000），平均时长的分布为：$N(2.5, 0.004)$，标准差=0.063小时
- 如果调查10000个玩家（n=10000），平均时长的分布为：$N(2.5, 0.0004)$，标准差=0.02小时

**实际意义：**
样本量越大，平均值越稳定（方差$\frac{\sigma^2}{n}$越小），这让我们能够：
1. 计算置信区间：我们有95%的把握说真实平均时长在某个范围内
2. 进行假设检验：比较不同版本更新后玩家游戏时长是否有显著变化

#### 1.2.3 蒙特卡洛积分
考虑计算积分：
$$I = \int_a^b f(x) dx$$

通过变换可以写成：
$$I = (b-a) \int_0^1 f(a + (b-a)u) du = (b-a) E[f(a + (b-a)U)]$$

**数学推导过程：**

*第一步：变量替换*
设 $x = a + (b-a)u$，其中 $u \in [0,1]$

当 $u = 0$ 时：$x = a + (b-a) \times 0 = a$
当 $u = 1$ 时：$x = a + (b-a) \times 1 = b$

因此，当 $u$ 从 0 变化到 1 时，$x$ 从 $a$ 变化到 $b$

*第二步：计算微分*
$$\frac{dx}{du} = \frac{d}{du}[a + (b-a)u] = b-a$$

所以：$$dx = (b-a)du$$

*第三步：积分区间变换*
原积分的积分区间是 $[a, b]$，新积分的积分区间是 $[0, 1]$

*第四步：应用换元积分公式*
$$I = \int_a^b f(x) dx = \int_0^1 f(a + (b-a)u) \cdot (b-a) du$$

提取常数：
$$I = (b-a) \int_0^1 f(a + (b-a)u) du$$

*第五步：转换为期望值形式*

**符号约定说明：**
- 小写 $u$：表示积分变量，是一个虚拟变量，在积分过程中从0变化到1
- 大写 $U$：表示随机变量，服从$[0,1]$上的均匀分布

现在我们要将定积分形式转换为期望值形式。

如果 $U$ 是 $[0,1]$ 上的均匀分布随机变量，其概率密度函数为：
$$f_U(u) = \begin{cases} 
1 & \text{if } u \in [0,1] \\
0 & \text{otherwise}
\end{cases}$$

**连续随机变量期望值的定义解释：**

对于连续随机变量 $U$ 和任意函数 $g(U)$，期望值的定义为：
$$E[g(U)] = \int_{-\infty}^{\infty} g(u) \cdot f_U(u) du$$

**为什么是这样定义的？**

1. **离散情况的类比：**
   - 离散随机变量：$E[g(X)] = \sum_{i} g(x_i) \cdot P(X = x_i)$
   - 连续随机变量：$E[g(U)] = \int_{-\infty}^{\infty} g(u) \cdot f_U(u) du$

**为什么看起来不统一？深层原理解释：**

这个问题非常好！表面上看确实不统一，但实际上它们是完全统一的。关键在于理解：

**离散情况：**
- $P(X = x_i)$ 是点概率，表示随机变量恰好等于$x_i$的概率
- 这个概率值在[0,1]之间，所有概率之和为1

**连续情况：**
- $f_U(u)$ 是概率密度函数，**不是概率**！
- **$f_U(u) du$ 才是概率**，表示随机变量落在小区间$[u, u+du]$内的概率
- 概率密度可以大于1，但$\int_{-\infty}^{\infty} f_U(u) du = 1$

**统一性的证明：**

将连续分布近似为离散分布：
1. 将连续区间分割成很多小区间$[u_i, u_i + \Delta u]$
2. 每个小区间内的概率为：$P(u_i \leq U < u_i + \Delta u) \approx f_U(u_i) \Delta u$
3. 离散近似的期望值为：
   $$E[g(U)] \approx \sum_{i} g(u_i) \cdot f_U(u_i) \Delta u$$
4. 当$\Delta u \to 0$时，这个求和就变成了积分：
   $$E[g(U)] = \lim_{\Delta u \to 0} \sum_{i} g(u_i) \cdot f_U(u_i) \Delta u = \int_{-\infty}^{\infty} g(u) \cdot f_U(u) du$$

**本质统一：**
- 离散：$E[g(X)] = \sum_{i} g(x_i) \cdot P(X = x_i)$
- 连续：$E[g(U)] = \int_{-\infty}^{\infty} g(u) \cdot dP(u)$

其中$dP(u) = f_U(u) du$是概率的微分形式。

**总结：**
两者都是"函数值 × 对应的概率"的形式，只是：
- 离散用求和，连续用积分
- 离散用点概率，连续用概率微分$f_U(u)du$

2. **直观理解：**
   - $g(u)$：当随机变量取值为 $u$ 时，函数 $g$ 的值
   - $f_U(u)$：概率密度函数，表示随机变量在 $u$ 处的"概率密度"
   - $g(u) \cdot f_U(u) du$：在小区间 $[u, u+du]$ 内，$g$ 的值乘以对应的概率
   - 对整个定义域积分：将所有可能取值的加权平均

**为什么需要两个不同的函数g和f？**

这两个函数有完全不同的作用：

- **$g(u)$ - 变换函数**：
  - 这是我们想要求期望的函数
  - 它将随机变量的取值$u$转换为我们关心的量
  - 例如：$g(u) = u^2$（求平方的期望）、$g(u) = \sin(u)$（求正弦的期望）
  - 在我们的例子中：$g(u) = f(a + (b-a)u)$

- **$f_U(u)$ - 概率密度函数**：
  - 这是随机变量$U$的概率密度函数
  - 它告诉我们随机变量在各个取值处的概率密度
  - 它与我们要计算的函数$g$无关，只与随机变量$U$的分布有关
  - 在我们的例子中：$f_U(u) = 1$（因为$U$是$[0,1]$上的均匀分布）

**类比理解：**
想象你在计算班级学生身高的期望值：
- $g(u) = u$：学生的身高值（这是我们关心的量）
- $f_U(u)$：学生身高的概率密度（这告诉我们不同身高出现的概率）

这两个函数服务于不同的目的，所以必须用不同的字母来区分。

3. **数学含义：**
   期望值就是函数值的概率加权平均，权重是概率密度

**应用到我们的具体问题：**

由于 $U$ 是 $[0,1]$ 上的均匀分布，其概率密度函数为：
$$f_U(u) = \begin{cases} 
1 & \text{if } u \in [0,1] \\
0 & \text{otherwise}
\end{cases}$$

因此：
$$E[g(U)] = \int_{-\infty}^{\infty} g(u) \cdot f_U(u) du = \int_0^1 g(u) \cdot 1 du = \int_0^1 g(u) du$$

**具体应用到我们的问题：**

现在我们要处理的积分是：$\int_0^1 f(a + (b-a)u) du$

我们定义一个新的函数：
$$g(u) = f(a + (b-a)u)$$

这样，我们的积分就变成了：
$$\int_0^1 f(a + (b-a)u) du = \int_0^1 g(u) du$$

**关键转换：**
根据期望值的定义，我们有：
$$\int_0^1 g(u) du = E[g(U)]$$

将 $g(u) = f(a + (b-a)u)$ 代入，得到：
$$E[g(U)] = E[f(a + (b-a)U)]$$

**完整的等价关系：**
$$\int_0^1 f(a + (b-a)u) du = \int_0^1 g(u) du = E[g(U)] = E[f(a + (b-a)U)]$$

**为什么要这样做？**
- 定积分 $\int_0^1 f(a + (b-a)u) du$ 是确定性的计算
- 期望值 $E[f(a + (b-a)U)]$ 可以用随机采样来近似计算
- 这就是蒙特卡洛方法的核心思想：用随机采样来近似确定性计算

**概念转换的意义：**
- 左边：从解析的角度，计算函数在区间上的积分
- 右边：从概率的角度，计算函数关于均匀分布的期望值

这个转换是蒙特卡洛方法的核心思想：**将确定性的积分问题转换为概率期望问题**

*第六步：最终结果*
$$I = (b-a) E[f(a + (b-a)U)]$$

**物理意义：**
这个变换将原本在区间 $[a, b]$ 上的积分，转换为在标准区间 $[0, 1]$ 上对变换后函数的期望值计算，再乘以区间长度 $(b-a)$。这样做的好处是可以使用 $[0, 1]$ 上的均匀随机数进行采样。

其中 $U$ 是 $[0,1]$ 上的均匀分布。蒙特卡洛估计为：

$$\hat{I}_n = \frac{b-a}{n} \sum_{i=1}^{n} f(a + (b-a)U_i)$$

**游戏例子：计算技能伤害期望值**

假设你设计了一个法师技能，伤害随角色等级变化。技能伤害公式为 $f(x) = 100 + 50x + 0.5x^2$，其中x是角色等级。你想计算20-50级玩家的平均技能伤害。

数学上，这等价于计算积分：
$$I = \int_{20}^{50} f(x) dx = \int_{20}^{50} (100 + 50x + 0.5x^2) dx$$

**符号对应：**
- $a = 20$：最低等级
- $b = 50$：最高等级
- $f(x) = 100 + 50x + 0.5x^2$：技能伤害公式
- $I$：20-50级区间内技能伤害的总和
- $U_i$：第i次随机抽取的[0,1]均匀随机数
- $x_i = a + (b-a)U_i = 20 + 30U_i$：第i次抽取的等级
- $n$：模拟次数

**蒙特卡洛估计过程：**

1. **随机等级生成：**
   - 第1次：$U_1 = 0.23$，等级 $x_1 = 20 + 30 \times 0.23 = 26.9$
   - 第2次：$U_2 = 0.67$，等级 $x_2 = 20 + 30 \times 0.67 = 40.1$
   - 第3次：$U_3 = 0.15$，等级 $x_3 = 20 + 30 \times 0.15 = 24.5$
   - ...

2. **计算对应伤害：**
   - $f(26.9) = 100 + 50 \times 26.9 + 0.5 \times 26.9^2 = 1806.405$
   - $f(40.1) = 100 + 50 \times 40.1 + 0.5 \times 40.1^2 = 2859.005$
   - $f(24.5) = 100 + 50 \times 24.5 + 0.5 \times 24.5^2 = 1650.125$
   - ...

3. **蒙特卡洛估计：**
   $$\hat{I}_n = \frac{30}{n} \sum_{i=1}^{n} f(x_i) = \frac{30}{n} \sum_{i=1}^{n} f(20 + 30U_i)$$

**实际意义：**
- 如果模拟1000次：$\hat{I}_{1000}$ 就是技能伤害总和的估计值
- 平均伤害 = $\frac{\hat{I}_n}{30}$（总和除以等级区间长度）
- 这个方法特别适用于复杂的伤害公式，比如包含随机暴击、护甲减免等因素的情况

### 1.3 收敛性与误差分析

#### 1.3.1 均方误差
蒙特卡洛估计的均方误差为：
$$MSE(\hat{I}_n) = E[(\hat{I}_n - I)^2] = Var(\hat{I}_n) = \frac{\sigma^2}{n}$$

其中 $\sigma^2 = Var(f(X))$。

**游戏例子：抽卡系统SSR概率估计的误差**

假设你设计的抽卡系统SSR真实概率是1%，现在要通过模拟来估计这个概率，并分析估计的误差。

**符号对应：**
- $X_i$：第i次抽卡结果（1表示抽到SSR，0表示没抽到）
- $I = 0.01$：真实的SSR概率
- $\hat{I}_n = \frac{1}{n}\sum_{i=1}^{n} X_i$：通过n次抽卡估计的概率
- $\sigma^2 = Var(X_i) = p(1-p) = 0.01 \times 0.99 = 0.0099$：单次抽卡结果的方差
- $MSE(\hat{I}_n) = \frac{0.0099}{n}$：估计值的均方误差

**具体含义：**

均方误差告诉我们**估计值偏离真实值的平均程度**：

- 抽卡100次：$MSE = \frac{0.0099}{100} = 0.000099$，标准误差 = $\sqrt{0.000099} = 0.00995$
  - 这意味着估计概率可能在 $0.01 \pm 0.01$ 范围内波动
  
- 抽卡10000次：$MSE = \frac{0.0099}{10000} = 0.00000099$，标准误差 = $\sqrt{0.00000099} = 0.000995$
  - 这意味着估计概率可能在 $0.01 \pm 0.001$ 范围内波动

**实际应用：**
如果你的估计要求误差不超过0.1%（即±0.001），那么你需要的样本量为：
$$n \geq \frac{\sigma^2}{(0.001)^2} = \frac{0.0099}{0.000001} = 9900$$

也就是至少需要9900次抽卡测试。

#### 1.3.2 收敛速度
蒙特卡洛方法的收敛速度为 $O(n^{-1/2})$，与维度无关，这是其主要优势。

标准误差：
$$SE = \frac{\sigma}{\sqrt{n}}$$

要将误差减半，需要将样本量增加4倍。

**游戏例子：优化测试成本和精度**

你正在测试一个新英雄的胜率，需要决定进行多少场战斗测试来达到不同的精度要求。

**符号对应：**
- $n$：测试的战斗场次
- $\sigma$：单场战斗结果的标准差（对于胜率问题，$\sigma = \sqrt{p(1-p)}$）
- $SE = \frac{\sigma}{\sqrt{n}}$：胜率估计的标准误差
- $O(n^{-1/2})$：表示误差随样本量的下降速度

**具体场景：**
假设新英雄真实胜率是60%，那么 $\sigma = \sqrt{0.6 \times 0.4} = \sqrt{0.24} = 0.49$

**收敛速度分析：**

1. **初始测试：**100场战斗
   - 标准误差：$SE_{100} = \frac{0.49}{\sqrt{100}} = 0.049$ (4.9%)
   
2. **增加到400场：**（样本量增加4倍）
   - 标准误差：$SE_{400} = \frac{0.49}{\sqrt{400}} = 0.0245$ (2.45%)
   - 误差确实减半了！

3. **增加到1600场：**（再增加4倍）
   - 标准误差：$SE_{1600} = \frac{0.49}{\sqrt{1600}} = 0.01225$ (1.225%)
   - 误差又减半了！

**关键洞察：**

1. **$O(n^{-1/2})$ 的含义：**
   - 误差与$\sqrt{n}$成反比
   - 要让精度提高10倍，需要样本量增加100倍
   - 要让精度提高2倍，需要样本量增加4倍

2. **成本效益分析：**
   - 从100场→400场：测试成本增加4倍，精度提高2倍
   - 从400场→1600场：测试成本再增加4倍，精度再提高2倍
   - 边际收益递减，需要在成本和精度间找平衡

3. **维度无关的优势：**
   - 无论你同时测试1个英雄还是10个英雄的多项指标
   - 收敛速度都是$O(n^{-1/2})$
   - 这是蒙特卡洛相比其他数值方法的巨大优势

#### 1.3.3 收敛概念辨析

**依概率收敛 vs 依分布收敛：**

- **依概率收敛（大数定律）**：关注**随机变量的值**是否接近目标值
  - 样本均值$\bar{X}_n$的值趋向于真实期望值$\mu$
  - 游戏例子：随着测试次数增加，观测到的胜率数值越来越接近真实胜率

- **依分布收敛（中心极限定理）**：关注**随机变量的分布**是否接近目标分布
  - 样本均值$\bar{X}_n$的分布趋向于正态分布$N(\mu, \sigma^2/n)$
  - 游戏例子：多次重复"测试1000场战斗"的实验，每次得到的胜率估计值会服从正态分布

**在蒙特卡洛中的应用：**
- 依概率收敛保证我们的估计会越来越准确
- 依分布收敛让我们能计算置信区间和进行假设检验

### 1.4 核心思想
- **随机采样**：通过随机生成大量样本点
- **统计分析**：对样本结果进行统计分析
- **数值逼近**：用统计结果逼近真实答案
- **理论保证**：基于大数定律和中心极限定理的收敛性保证

## 2. 在游戏策划中的应用场景

### 2.1 概率系统设计
- **抽卡系统**：模拟玩家抽卡行为，验证保底机制
- **装备掉落**：分析掉落概率分布，确保掉落平衡
- **技能触发**：模拟技能触发概率，优化战斗体验

### 2.2 数值平衡测试
- **战斗模拟**：模拟大量战斗场景，测试角色平衡性
- **经济系统**：模拟玩家消费行为，预测经济流向
- **升级系统**：测试升级曲线的合理性

### 2.3 玩家行为预测
- **留存率预测**：基于历史数据预测玩家留存
- **付费预测**：模拟不同付费点的转化率
- **活跃度分析**：预测功能对玩家活跃度的影响

## 3. 基础实现

### 3.1 简单的概率模拟
```python
import random
import numpy as np
import matplotlib.pyplot as plt

def simple_probability_test(probability, trials=10000):
    """
    模拟简单概率事件
    probability: 目标概率
    trials: 模拟次数
    """
    success_count = 0
    
    for _ in range(trials):
        if random.random() < probability:
            success_count += 1
    
    observed_probability = success_count / trials
    print(f"理论概率: {probability:.4f}")
    print(f"观测概率: {observed_probability:.4f}")
    print(f"误差: {abs(probability - observed_probability):.4f}")
    
    return observed_probability

# 测试5%的掉落概率
simple_probability_test(0.05, 100000)
```

### 3.2 抽卡系统模拟
```python
class GachaSystem:
    def __init__(self, rates, items, pity_count=90):
        """
        抽卡系统
        rates: 各稀有度概率列表 [N, R, SR, SSR]
        items: 对应的物品名称
        pity_count: 保底次数
        """
        self.rates = rates
        self.items = items
        self.pity_count = pity_count
        self.current_pity = 0
        
    def single_draw(self):
        """单次抽卡"""
        self.current_pity += 1
        
        # 保底机制
        if self.current_pity >= self.pity_count:
            self.current_pity = 0
            return self.items[-1]  # 返回最高稀有度
        
        # 正常抽卡
        rand = random.random()
        cumulative = 0
        
        for i, rate in enumerate(self.rates):
            cumulative += rate
            if rand <= cumulative:
                if i == len(self.rates) - 1:  # 抽到最高稀有度
                    self.current_pity = 0
                return self.items[i]
        
        return self.items[0]  # 默认返回最低稀有度
    
    def simulate_draws(self, draw_count):
        """模拟多次抽卡"""
        results = {item: 0 for item in self.items}
        
        for _ in range(draw_count):
            result = self.single_draw()
            results[result] += 1
        
        return results

# 设置抽卡系统
rates = [0.765, 0.2, 0.03, 0.005]  # N, R, SR, SSR概率
items = ['N', 'R', 'SR', 'SSR']
gacha = GachaSystem(rates, items)

# 模拟10万次抽卡
results = gacha.simulate_draws(100000)
print("抽卡结果统计:")
for item, count in results.items():
    print(f"{item}: {count} ({count/100000:.3%})")
```

## 4. 高级应用案例

### 4.1 战斗系统平衡性测试
```python
class BattleSimulator:
    def __init__(self, hero1_stats, hero2_stats):
        """
        战斗模拟器
        stats格式: {'hp': 1000, 'attack': 200, 'defense': 50, 'crit_rate': 0.1, 'crit_damage': 1.5}
        """
        self.hero1 = hero1_stats.copy()
        self.hero2 = hero2_stats.copy()
    
    def calculate_damage(self, attacker, defender):
        """计算伤害"""
        base_damage = max(1, attacker['attack'] - defender['defense'])
        
        # 暴击判定
        if random.random() < attacker['crit_rate']:
            base_damage *= attacker['crit_damage']
        
        return base_damage
    
    def single_battle(self):
        """单次战斗模拟"""
        h1_hp = self.hero1['hp']
        h2_hp = self.hero2['hp']
        
        while h1_hp > 0 and h2_hp > 0:
            # 英雄1攻击英雄2
            damage = self.calculate_damage(self.hero1, self.hero2)
            h2_hp -= damage
            
            if h2_hp <= 0:
                return 1  # 英雄1获胜
            
            # 英雄2攻击英雄1
            damage = self.calculate_damage(self.hero2, self.hero1)
            h1_hp -= damage
            
            if h1_hp <= 0:
                return 2  # 英雄2获胜
        
        return 0  # 平局（理论上不会发生）
    
    def simulate_battles(self, battle_count=10000):
        """模拟大量战斗"""
        results = {1: 0, 2: 0, 0: 0}
        
        for _ in range(battle_count):
            winner = self.single_battle()
            results[winner] += 1
        
        win_rate_1 = results[1] / battle_count
        win_rate_2 = results[2] / battle_count
        
        print(f"英雄1胜率: {win_rate_1:.3%}")
        print(f"英雄2胜率: {win_rate_2:.3%}")
        
        return win_rate_1, win_rate_2

# 测试战斗平衡性
hero1 = {'hp': 1000, 'attack': 200, 'defense': 50, 'crit_rate': 0.1, 'crit_damage': 1.5}
hero2 = {'hp': 1200, 'attack': 180, 'defense': 60, 'crit_rate': 0.15, 'crit_damage': 1.4}

simulator = BattleSimulator(hero1, hero2)
simulator.simulate_battles(50000)
```

### 4.2 经济系统模拟
```python
class EconomySimulator:
    def __init__(self, initial_gold=1000, daily_income=100, shop_prices=None):
        """
        经济系统模拟器
        """
        self.initial_gold = initial_gold
        self.daily_income = daily_income
        self.shop_prices = shop_prices or [50, 100, 200, 500, 1000]
        
    def simulate_player_spending(self, days=30, spending_probability=0.3):
        """模拟玩家消费行为"""
        gold = self.initial_gold
        total_spent = 0
        purchase_history = []
        
        for day in range(days):
            # 每日收入
            gold += self.daily_income
            
            # 消费决策
            if random.random() < spending_probability and gold > min(self.shop_prices):
                # 选择购买物品
                affordable_items = [price for price in self.shop_prices if price <= gold]
                if affordable_items:
                    purchase_price = random.choice(affordable_items)
                    gold -= purchase_price
                    total_spent += purchase_price
                    purchase_history.append((day, purchase_price))
        
        return {
            'final_gold': gold,
            'total_spent': total_spent,
            'purchase_count': len(purchase_history),
            'purchase_history': purchase_history
        }
    
    def run_simulation(self, player_count=1000, days=30):
        """运行多玩家经济模拟"""
        results = []
        
        for _ in range(player_count):
            result = self.simulate_player_spending(days)
            results.append(result)
        
        # 统计分析
        avg_final_gold = np.mean([r['final_gold'] for r in results])
        avg_total_spent = np.mean([r['total_spent'] for r in results])
        avg_purchases = np.mean([r['purchase_count'] for r in results])
        
        print(f"平均剩余金币: {avg_final_gold:.2f}")
        print(f"平均总消费: {avg_total_spent:.2f}")
        print(f"平均购买次数: {avg_purchases:.2f}")
        
        return results

# 运行经济模拟
economy = EconomySimulator()
results = economy.run_simulation(5000, 30)
```

## 5. 高级蒙特卡洛技术

### 5.1 方差减少技术

#### 5.1.1 对偶变量法（Antithetic Variates）

**数学原理：**
设我们要估计 $\theta = E[f(X)]$，使用对偶变量 $X'$ 使得 $Cov(f(X), f(X')) < 0$。

对偶估计量：
$$\hat{\theta}_{AV} = \frac{1}{2n}\sum_{i=1}^{n}[f(X_i) + f(X_i')]$$

方差为：
$$Var(\hat{\theta}_{AV}) = \frac{1}{4n}[Var(f(X)) + Var(f(X')) + 2Cov(f(X), f(X'))]$$

当 $Cov(f(X), f(X')) < 0$ 时，方差减少。

```python
def antithetic_sampling(func, n_samples):
    """对偶变量采样"""
    results = []
    for _ in range(n_samples // 2):
        u = random.random()
        # 原始样本
        x1 = func(u)
        # 对偶样本
        x2 = func(1 - u)
        results.extend([x1, x2])
    
    return results
```

#### 5.1.2 重要性采样（Importance Sampling）

**数学原理：**
要计算 $I = E_f[h(X)] = \int h(x)f(x)dx$，选择重要性函数 $g(x)$：

$$I = \int h(x)f(x)dx = \int h(x)\frac{f(x)}{g(x)}g(x)dx = E_g\left[h(X)\frac{f(X)}{g(X)}\right]$$

蒙特卡洛估计：
$$\hat{I}_{IS} = \frac{1}{n}\sum_{i=1}^{n} h(X_i)\frac{f(X_i)}{g(X_i)}$$

其中 $X_i \sim g(x)$。

**最优重要性函数：**
理论上最优的重要性函数为：
$$g^*(x) = \frac{|h(x)|f(x)}{\int |h(y)|f(y)dy}$$

```python
def importance_sampling(target_func, importance_func, importance_pdf, target_pdf, n_samples):
    """重要性采样"""
    samples = [importance_func() for _ in range(n_samples)]
    weights = [target_pdf(x) / importance_pdf(x) for x in samples]
    values = [target_func(x) for x in samples]
    
    estimate = np.mean([v * w for v, w in zip(values, weights)])
    return estimate, samples, weights
```

#### 5.1.3 分层抽样（Stratified Sampling）

**数学原理：**
将积分区域分为 $k$ 个互不重叠的子区域 $D_1, D_2, \ldots, D_k$：

$$I = \sum_{j=1}^{k} p_j I_j$$

其中 $p_j = P(X \in D_j)$，$I_j = E[h(X)|X \in D_j]$。

分层估计量：
$$\hat{I}_{ST} = \sum_{j=1}^{k} p_j \hat{I}_j$$

其中 $\hat{I}_j = \frac{1}{n_j}\sum_{i=1}^{n_j} h(X_{ji})$。

**最优分配：**
当 $n_j \propto p_j\sigma_j$ 时，方差最小，其中 $\sigma_j^2 = Var(h(X)|X \in D_j)$。

```python
def stratified_sampling(func, strata_bounds, strata_probs, samples_per_stratum):
    """分层抽样"""
    results = []
    
    for i, (bounds, prob) in enumerate(zip(strata_bounds, strata_probs)):
        stratum_results = []
        for _ in range(samples_per_stratum[i]):
            # 在该层内均匀采样
            x = random.uniform(bounds[0], bounds[1])
            stratum_results.append(func(x))
        
        # 加权平均
        stratum_mean = np.mean(stratum_results)
        results.append(prob * stratum_mean)
    
    return sum(results)
```

### 5.2 概率分布与统计检验

#### 5.2.1 二项分布模拟与理论对比

**二项分布：** $X \sim B(n, p)$

概率质量函数：
$$P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$$

期望：$E[X] = np$

方差：$Var(X) = np(1-p)$

```python
import scipy.stats as stats

def binomial_analysis(n, p, trials=10000):
    """二项分布分析"""
    # 蒙特卡洛模拟
    results = []
    for _ in range(trials):
        successes = sum(1 for _ in range(n) if random.random() < p)
        results.append(successes)
    
    # 理论值
    theoretical_mean = n * p
    theoretical_var = n * p * (1 - p)
    
    # 观测值
    observed_mean = np.mean(results)
    observed_var = np.var(results)
    
    # 统计检验
    # Kolmogorov-Smirnov检验
    ks_stat, ks_pvalue = stats.kstest(results, 
                                     lambda x: stats.binom.cdf(x, n, p))
    
    return {
        'theoretical': {'mean': theoretical_mean, 'var': theoretical_var},
        'observed': {'mean': observed_mean, 'var': observed_var},
        'ks_test': {'statistic': ks_stat, 'p_value': ks_pvalue}
    }
```

#### 5.2.2 置信区间的数学推导

**基于中心极限定理的置信区间：**

对于大样本，样本均值 $\bar{X}$ 近似服从正态分布：
$$\bar{X} \sim N\left(\mu, \frac{\sigma^2}{n}\right)$$

标准化：
$$Z = \frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \sim N(0, 1)$$

$100(1-\alpha)\%$ 置信区间：
$$\bar{X} \pm z_{\alpha/2} \frac{\sigma}{\sqrt{n}}$$

**当 $\sigma$ 未知时（t分布）：**
$$T = \frac{\bar{X} - \mu}{S/\sqrt{n}} \sim t_{n-1}$$

置信区间：
$$\bar{X} \pm t_{\alpha/2, n-1} \frac{S}{\sqrt{n}}$$

```python
def detailed_confidence_interval(data, confidence=0.95):
    """详细的置信区间计算"""
    n = len(data)
    mean = np.mean(data)
    std = np.std(data, ddof=1)  # 样本标准差
    
    alpha = 1 - confidence
    
    # 大样本（n >= 30）使用正态分布
    if n >= 30:
        z_score = stats.norm.ppf(1 - alpha/2)
        margin_error = z_score * std / np.sqrt(n)
        distribution = "正态分布"
    else:
        # 小样本使用t分布
        t_score = stats.t.ppf(1 - alpha/2, df=n-1)
        margin_error = t_score * std / np.sqrt(n)
        distribution = f"t分布(df={n-1})"
    
    lower = mean - margin_error
    upper = mean + margin_error
    
    print(f"样本量: {n}")
    print(f"使用分布: {distribution}")
    print(f"样本均值: {mean:.4f}")
    print(f"样本标准差: {std:.4f}")
    print(f"标准误差: {std/np.sqrt(n):.4f}")
    print(f"{confidence*100}% 置信区间: [{lower:.4f}, {upper:.4f}]")
    print(f"边际误差: {margin_error:.4f}")
    
    return {
        'mean': mean,
        'std': std,
        'confidence_interval': (lower, upper),
        'margin_error': margin_error,
        'distribution': distribution
    }
```

### 5.3 假设检验与A/B测试

#### 5.3.1 单样本检验

**检验假设：**
- $H_0: \mu = \mu_0$
- $H_1: \mu \neq \mu_0$

**检验统计量：**
$$t = \frac{\bar{X} - \mu_0}{S/\sqrt{n}}$$

在 $H_0$ 为真时，$t \sim t_{n-1}$。

```python
def monte_carlo_t_test(mu0, sample_generator, n_samples, alpha=0.05):
    """蒙特卡洛t检验"""
    # 生成样本
    samples = [sample_generator() for _ in range(n_samples)]
    
    # 计算检验统计量
    sample_mean = np.mean(samples)
    sample_std = np.std(samples, ddof=1)
    
    t_stat = (sample_mean - mu0) / (sample_std / np.sqrt(n_samples))
    
    # 计算p值
    p_value = 2 * (1 - stats.t.cdf(abs(t_stat), df=n_samples-1))
    
    # 判断
    reject_h0 = p_value < alpha
    
    return {
        'sample_mean': sample_mean,
        'sample_std': sample_std,
        't_statistic': t_stat,
        'p_value': p_value,
        'reject_h0': reject_h0,
        'conclusion': '拒绝原假设' if reject_h0 else '不拒绝原假设'
    }
```

#### 5.3.2 A/B测试的数学模型

**两样本均值比较：**

设组A样本 $X_1, X_2, \ldots, X_{n_A} \sim N(\mu_A, \sigma_A^2)$

组B样本 $Y_1, Y_2, \ldots, Y_{n_B} \sim N(\mu_B, \sigma_B^2)$

**检验假设：**
- $H_0: \mu_A = \mu_B$
- $H_1: \mu_A \neq \mu_B$

**等方差情况下的检验统计量：**
$$t = \frac{\bar{X} - \bar{Y}}{S_p\sqrt{\frac{1}{n_A} + \frac{1}{n_B}}}$$

其中合并方差：
$$S_p^2 = \frac{(n_A-1)S_A^2 + (n_B-1)S_B^2}{n_A + n_B - 2}$$

```python
def ab_test_analysis(group_a_data, group_b_data, alpha=0.05):
    """A/B测试分析"""
    n_a = len(group_a_data)
    n_b = len(group_b_data)
    
    mean_a = np.mean(group_a_data)
    mean_b = np.mean(group_b_data)
    
    var_a = np.var(group_a_data, ddof=1)
    var_b = np.var(group_b_data, ddof=1)
    
    # 等方差检验
    f_stat = var_a / var_b if var_a > var_b else var_b / var_a
    f_pvalue = 2 * (1 - stats.f.cdf(f_stat, n_a-1, n_b-1))
    
    equal_var = f_pvalue > 0.05
    
    if equal_var:
        # 等方差t检验
        pooled_var = ((n_a-1)*var_a + (n_b-1)*var_b) / (n_a + n_b - 2)
        se = np.sqrt(pooled_var * (1/n_a + 1/n_b))
        df = n_a + n_b - 2
    else:
        # Welch t检验
        se = np.sqrt(var_a/n_a + var_b/n_b)
        df = (var_a/n_a + var_b/n_b)**2 / (var_a**2/(n_a**2*(n_a-1)) + var_b**2/(n_b**2*(n_b-1)))
    
    t_stat = (mean_a - mean_b) / se
    p_value = 2 * (1 - stats.t.cdf(abs(t_stat), df))
    
    # 效应大小（Cohen's d）
    if equal_var:
        cohen_d = (mean_a - mean_b) / np.sqrt(pooled_var)
    else:
        cohen_d = (mean_a - mean_b) / np.sqrt((var_a + var_b) / 2)
    
    return {
        'group_a': {'mean': mean_a, 'var': var_a, 'n': n_a},
        'group_b': {'mean': mean_b, 'var': var_b, 'n': n_b},
        'equal_variance': equal_var,
        't_statistic': t_stat,
        'p_value': p_value,
        'cohen_d': cohen_d,
        'significant': p_value < alpha,
        'conclusion': f"组A平均值 {'显著' if p_value < alpha else '不显著'} {'高于' if mean_a > mean_b else '低于'} 组B"
    }
```

## 6. 马尔科夫链蒙特卡洛（MCMC）

### 6.1 理论基础

#### 6.1.1 马尔科夫链基本概念

**马尔科夫性质：**
$$P(X_{n+1} = j | X_n = i, X_{n-1} = i_{n-1}, \ldots, X_0 = i_0) = P(X_{n+1} = j | X_n = i)$$

**转移概率矩阵：** $P_{ij} = P(X_{n+1} = j | X_n = i)$

**平稳分布：** $\pi$ 满足 $\pi = \pi P$，即 $\sum_i \pi_i P_{ij} = \pi_j$

**细致平衡条件：** $\pi_i P_{ij} = \pi_j P_{ji}$

#### 6.1.2 Metropolis-Hastings算法

**目标：** 从分布 $\pi(x)$ 中采样

**算法步骤：**
1. 从提议分布 $q(y|x)$ 生成候选状态 $y$
2. 计算接受概率：
   $$\alpha(x, y) = \min\left(1, \frac{\pi(y)q(x|y)}{\pi(x)q(y|x)}\right)$$
3. 以概率 $\alpha(x, y)$ 接受新状态

```python
def metropolis_hastings(target_log_pdf, proposal_std, initial_state, n_samples):
    """Metropolis-Hastings采样器"""
    samples = []
    current_state = initial_state
    n_accepted = 0
    
    for i in range(n_samples):
        # 提议新状态
        proposed_state = current_state + np.random.normal(0, proposal_std)
        
        # 计算接受概率
        log_alpha = (target_log_pdf(proposed_state) - target_log_pdf(current_state))
        alpha = min(1, np.exp(log_alpha))
        
        # 决定是否接受
        if np.random.random() < alpha:
            current_state = proposed_state
            n_accepted += 1
        
        samples.append(current_state)
    
    acceptance_rate = n_accepted / n_samples
    return np.array(samples), acceptance_rate
```

#### 6.1.3 Gibbs采样

**多变量情况：** $X = (X_1, X_2, \ldots, X_p)$

**条件分布采样：**
$$X_j^{(t+1)} \sim p(X_j | X_1^{(t+1)}, \ldots, X_{j-1}^{(t+1)}, X_{j+1}^{(t)}, \ldots, X_p^{(t)})$$

```python
def gibbs_sampler(conditional_samplers, initial_state, n_samples):
    """Gibbs采样器"""
    samples = []
    current_state = initial_state.copy()
    
    for i in range(n_samples):
        for j in range(len(current_state)):
            # 从条件分布采样
            current_state[j] = conditional_samplers[j](current_state)
        
        samples.append(current_state.copy())
    
    return np.array(samples)
```

### 6.2 收敛诊断

#### 6.2.1 Gelman-Rubin诊断

**统计量：** $\hat{R} = \sqrt{\frac{Var^+(\psi|y)}{W}}$

其中：
- $W = \frac{1}{m}\sum_{j=1}^{m} s_j^2$ （链内方差）
- $B = \frac{n}{m-1}\sum_{j=1}^{m}(\bar{\psi}_{\cdot j} - \bar{\psi}_{\cdot \cdot})^2$ （链间方差）
- $Var^+(\psi|y) = \frac{n-1}{n}W + \frac{1}{n}B$

当 $\hat{R} \to 1$ 时，认为收敛。

```python
def gelman_rubin_diagnostic(chains):
    """Gelman-Rubin收敛诊断"""
    m, n = chains.shape  # m条链，每条n个样本
    
    # 计算链内方差
    chain_means = np.mean(chains, axis=1)
    chain_vars = np.var(chains, axis=1, ddof=1)
    W = np.mean(chain_vars)
    
    # 计算链间方差
    overall_mean = np.mean(chain_means)
    B = n * np.var(chain_means, ddof=1)
    
    # 方差估计
    var_plus = ((n-1)/n) * W + (1/n) * B
    
    # R统计量
    R_hat = np.sqrt(var_plus / W)
    
    return R_hat
```

### 6.3 贝叶斯参数估计

#### 6.3.1 贝叶斯定理

$$p(\theta|D) = \frac{p(D|\theta)p(\theta)}{p(D)} \propto p(D|\theta)p(\theta)$$

其中：
- $p(\theta|D)$：后验分布
- $p(D|\theta)$：似然函数
- $p(\theta)$：先验分布
- $p(D)$：边际似然

#### 6.3.2 共轭先验

**Beta-Binomial模型：**
- 先验：$\theta \sim Beta(\alpha, \beta)$
- 似然：$X|\theta \sim Binomial(n, \theta)$
- 后验：$\theta|X \sim Beta(\alpha + x, \beta + n - x)$

```python
def bayesian_ab_test(successes_a, trials_a, successes_b, trials_b, 
                    alpha_prior=1, beta_prior=1, n_samples=10000):
    """贝叶斯A/B测试"""
    # 后验分布参数
    alpha_a = alpha_prior + successes_a
    beta_a = beta_prior + trials_a - successes_a
    
    alpha_b = alpha_prior + successes_b
    beta_b = beta_prior + trials_b - successes_b
    
    # 从后验分布采样
    samples_a = np.random.beta(alpha_a, beta_a, n_samples)
    samples_b = np.random.beta(alpha_b, beta_b, n_samples)
    
    # 计算P(θA > θB)
    prob_a_better = np.mean(samples_a > samples_b)
    
    # 计算效应大小
    effect_samples = samples_a - samples_b
    effect_mean = np.mean(effect_samples)
    effect_std = np.std(effect_samples)
    
    # 95%可信区间
    credible_interval = np.percentile(effect_samples, [2.5, 97.5])
    
    return {
        'prob_a_better': prob_a_better,
        'effect_mean': effect_mean,
        'effect_std': effect_std,
        'credible_interval': credible_interval,
        'samples_a': samples_a,
        'samples_b': samples_b
    }
```

## 7. 游戏中的复杂概率模型

### 7.1 多状态马尔科夫模型

#### 7.1.1 玩家状态转移模型

**状态空间：** $S = \{新手, 活跃, 流失, 付费\}$

**转移矩阵：**
$$P = \begin{pmatrix}
0.7 & 0.2 & 0.1 & 0 \\
0 & 0.6 & 0.3 & 0.1 \\
0 & 0.1 & 0.9 & 0 \\
0 & 0.8 & 0.1 & 0.1
\end{pmatrix}$$

**稳态概率：** 解方程 $\pi P = \pi$

```python
def player_state_simulation(transition_matrix, initial_state, n_days):
    """玩家状态转移模拟"""
    states = ['新手', '活跃', '流失', '付费']
    current_state = initial_state
    state_history = [current_state]
    
    for day in range(n_days):
        # 根据转移概率选择下一状态
        probs = transition_matrix[current_state]
        current_state = np.random.choice(len(states), p=probs)
        state_history.append(current_state)
    
    return state_history

def analyze_player_ltv(transition_matrix, revenue_per_state, discount_rate=0.01):
    """分析玩家生命周期价值"""
    n_states = len(transition_matrix)
    I = np.eye(n_states)
    
    # 基本矩阵 N = (I - Q)^(-1)，其中Q是吸收马尔科夫链的暂态部分
    # 简化为计算期望收入
    expected_days = np.linalg.inv(I - transition_matrix * (1 - discount_rate))
    ltv_vector = expected_days @ revenue_per_state
    
    return ltv_vector
```

### 7.2 随机过程在游戏中的应用

#### 7.2.1 泊松过程（事件到达）

**数学模型：**
- 时间间隔 $T \sim Exponential(\lambda)$
- 时间窗口 $[0, t]$ 内事件数 $N(t) \sim Poisson(\lambda t)$

**概率密度函数：**
$$P(N(t) = k) = \frac{(\lambda t)^k e^{-\lambda t}}{k!}$$

```python
def simulate_poisson_events(rate, time_horizon):
    """模拟泊松事件"""
    events = []
    current_time = 0
    
    while current_time < time_horizon:
        # 生成下一个事件的时间间隔
        interval = np.random.exponential(1/rate)
        current_time += interval
        
        if current_time < time_horizon:
            events.append(current_time)
    
    return events

def player_session_analysis(session_data, time_window=24):
    """玩家会话分析"""
    # 估计泊松参数
    n_sessions = len(session_data)
    lambda_hat = n_sessions / time_window
    
    # 预测下个时间窗口的会话数
    predicted_sessions = np.random.poisson(lambda_hat)
    
    # 计算置信区间
    alpha = 0.05
    lower = stats.poisson.ppf(alpha/2, lambda_hat)
    upper = stats.poisson.ppf(1-alpha/2, lambda_hat)
    
    return {
        'estimated_rate': lambda_hat,
        'predicted_sessions': predicted_sessions,
        'confidence_interval': (lower, upper)
    }
```

#### 7.2.2 排队论模型

**M/M/1队列：**
- 到达率：$\lambda$ （泊松过程）
- 服务率：$\mu$ （指数分布）
- 利用率：$\rho = \lambda/\mu$

**性能指标：**
- 平均队长：$L = \frac{\rho}{1-\rho}$
- 平均等待时间：$W = \frac{\rho}{\mu(1-\rho)}$

```python
def queue_simulation(arrival_rate, service_rate, simulation_time):
    """队列系统模拟"""
    events = []  # (time, event_type, customer_id)
    queue = []
    server_busy = False
    customer_id = 0
    
    # 生成第一个到达事件
    next_arrival = np.random.exponential(1/arrival_rate)
    events.append((next_arrival, 'arrival', customer_id))
    
    current_time = 0
    waiting_times = []
    
    while current_time < simulation_time:
        # 处理下一个事件
        events.sort()
        current_time, event_type, cust_id = events.pop(0)
        
        if event_type == 'arrival':
            customer_id += 1
            
            # 生成下一个到达
            next_arrival = current_time + np.random.exponential(1/arrival_rate)
            if next_arrival < simulation_time:
                events.append((next_arrival, 'arrival', customer_id))
            
            if not server_busy:
                # 立即开始服务
                service_time = np.random.exponential(1/service_rate)
                events.append((current_time + service_time, 'departure', cust_id))
                server_busy = True
                waiting_times.append(0)
            else:
                # 加入队列
                queue.append((current_time, cust_id))
        
        elif event_type == 'departure':
            server_busy = False
            
            if queue:
                # 服务下一个客户
                arrival_time, next_cust = queue.pop(0)
                waiting_time = current_time - arrival_time
                waiting_times.append(waiting_time)
                
                service_time = np.random.exponential(1/service_rate)
                events.append((current_time + service_time, 'departure', next_cust))
                server_busy = True
    
    return {
        'avg_waiting_time': np.mean(waiting_times),
        'max_waiting_time': np.max(waiting_times) if waiting_times else 0,
        'customers_served': len(waiting_times)
    }
```

## 8. 最佳实践与优化

### 8.1 样本量确定的数学方法

#### 8.1.1 功效分析（Power Analysis）

对于双样本t检验，所需样本量：

$$n = \frac{2(z_{\alpha/2} + z_\beta)^2 \sigma^2}{\delta^2}$$

其中：
- $\alpha$：第一类错误率
- $\beta$：第二类错误率
- $\delta$：效应大小
- $\sigma$：总体标准差

```python
def sample_size_calculation(effect_size, alpha=0.05, power=0.8, sigma=1):
    """计算所需样本量"""
    z_alpha = stats.norm.ppf(1 - alpha/2)
    z_beta = stats.norm.ppf(power)
    
    n = 2 * (z_alpha + z_beta)**2 * sigma**2 / effect_size**2
    
    return int(np.ceil(n))

def monte_carlo_power_analysis(effect_size, n_per_group, alpha=0.05, n_simulations=1000):
    """蒙特卡洛功效分析"""
    significant_results = 0
    
    for _ in range(n_simulations):
        # 生成两组数据
        group_a = np.random.normal(0, 1, n_per_group)
        group_b = np.random.normal(effect_size, 1, n_per_group)
        
        # 进行t检验
        t_stat, p_value = stats.ttest_ind(group_a, group_b)
        
        if p_value < alpha:
            significant_results += 1
    
    power = significant_results / n_simulations
    return power
```

### 8.2 并行计算与优化

#### 8.2.1 向量化操作

```python
def vectorized_monte_carlo(n_simulations, n_trials, success_prob):
    """向量化蒙特卡洛模拟"""
    # 一次性生成所有随机数
    random_matrix = np.random.random((n_simulations, n_trials))
    
    # 向量化比较
    successes = (random_matrix < success_prob).sum(axis=1)
    
    return successes

def parallel_simulation(simulation_func, n_total, n_cores=4):
    """并行蒙特卡洛模拟"""
    from multiprocessing import Pool
    
    n_per_core = n_total // n_cores
    
    with Pool(n_cores) as pool:
        results = pool.map(simulation_func, [n_per_core] * n_cores)
    
    # 合并结果
    combined_results = np.concatenate(results)
    return combined_results
```

### 8.3 结果验证与诊断

#### 8.3.1 统计假设验证

```python
def validate_simulation_results(theoretical_value, simulated_values, alpha=0.05):
    """验证模拟结果的正确性"""
    n = len(simulated_values)
    sample_mean = np.mean(simulated_values)
    sample_std = np.std(simulated_values, ddof=1)
    
    # 单样本t检验
    t_stat = (sample_mean - theoretical_value) / (sample_std / np.sqrt(n))
    p_value = 2 * (1 - stats.t.cdf(abs(t_stat), df=n-1))
    
    # 置信区间
    t_critical = stats.t.ppf(1 - alpha/2, df=n-1)
    margin_error = t_critical * sample_std / np.sqrt(n)
    ci_lower = sample_mean - margin_error
    ci_upper = sample_mean + margin_error
    
    contains_theoretical = ci_lower <= theoretical_value <= ci_upper
    
    return {
        'sample_mean': sample_mean,
        'theoretical_value': theoretical_value,
        'p_value': p_value,
        'confidence_interval': (ci_lower, ci_upper),
        'contains_theoretical': contains_theoretical,
        'conclusion': '模拟结果正确' if contains_theoretical else '模拟结果可能有误'
    }
```

## 9. 常见陷阱与注意事项

### 9.1 伪随机数质量问题

#### 9.1.1 随机数生成器选择

**线性同余生成器（LCG）：**
$$X_{n+1} = (aX_n + c) \bmod m$$

虽然简单，但存在周期性和相关性问题。

**Mersenne Twister：** 周期长达 $2^{19937}-1$，是NumPy的默认生成器。

**PCG（Permuted Congruential Generator）：** 现代高质量生成器。

```python
def test_random_generator_quality(generator_func, n_tests=10000):
    """测试随机数生成器质量"""
    samples = [generator_func() for _ in range(n_tests)]
    
    # 均匀性检验（Kolmogorov-Smirnov）
    ks_stat, ks_pvalue = stats.kstest(samples, 'uniform')
    
    # 独立性检验（游程检验）
    median = np.median(samples)
    runs = []
    current_run = 1
    
    for i in range(1, len(samples)):
        if (samples[i] > median) == (samples[i-1] > median):
            current_run += 1
        else:
            runs.append(current_run)
            current_run = 1
    runs.append(current_run)
    
    # 期望游程数
    n_above = sum(1 for x in samples if x > median)
    n_below = len(samples) - n_above
    expected_runs = (2 * n_above * n_below) / len(samples) + 1
    
    return {
        'uniformity_test': {'statistic': ks_stat, 'p_value': ks_pvalue},
        'independence_test': {'observed_runs': len(runs), 'expected_runs': expected_runs}
    }
```

### 9.2 收敛性诊断

#### 9.2.1 收敛速度分析

**理论收敛速度：** $O(n^{-1/2})$

**有效样本量：**
$$n_{eff} = \frac{n}{1 + 2\sum_{k=1}^{\infty} \rho_k}$$

其中 $\rho_k$ 是滞后k的自相关系数。

```python
def convergence_diagnostics(samples, batch_size=100):
    """收敛诊断"""
    n = len(samples)
    n_batches = n // batch_size
    
    # 批次均值
    batch_means = []
    for i in range(n_batches):
        start_idx = i * batch_size
        end_idx = (i + 1) * batch_size
        batch_means.append(np.mean(samples[start_idx:end_idx]))
    
    # 累积均值
    cumulative_means = np.cumsum(samples) / np.arange(1, n + 1)
    
    # 自相关函数
    def autocorrelation(x, max_lag=50):
        n = len(x)
        autocorr = []
        mean_x = np.mean(x)
        var_x = np.var(x)
        
        for lag in range(max_lag):
            if lag == 0:
                autocorr.append(1.0)
            else:
                covariance = np.mean([(x[i] - mean_x) * (x[i-lag] - mean_x) 
                                    for i in range(lag, n)])
                autocorr.append(covariance / var_x)
        
        return autocorr
    
    autocorr = autocorrelation(samples)
    
    # 有效样本量
    sum_autocorr = sum(autocorr[1:])  # 排除lag=0
    effective_n = n / (1 + 2 * sum_autocorr)
    
    return {
        'batch_means': batch_means,
        'cumulative_means': cumulative_means,
        'autocorrelation': autocorr,
        'effective_sample_size': effective_n
    }
```

### 9.3 数值稳定性问题

#### 9.3.1 浮点运算误差

**Kahan求和算法：**
```python
def kahan_sum(values):
    """Kahan求和算法，减少浮点误差"""
    total = 0.0
    compensation = 0.0
    
    for value in values:
        adjusted_value = value - compensation
        new_total = total + adjusted_value
        compensation = (new_total - total) - adjusted_value
        total = new_total
    
    return total

def stable_monte_carlo_integration(func, n_samples):
    """数值稳定的蒙特卡洛积分"""
    samples = [func(np.random.random()) for _ in range(n_samples)]
    
    # 使用Kahan求和
    stable_sum = kahan_sum(samples)
    
    # 在线算法计算方差
    mean = 0.0
    m2 = 0.0
    
    for i, sample in enumerate(samples, 1):
        delta = sample - mean
        mean += delta / i
        delta2 = sample - mean
        m2 += delta * delta2
    
    variance = m2 / (n_samples - 1) if n_samples > 1 else 0
    
    return {
        'estimate': stable_sum / n_samples,
        'variance': variance / n_samples,
        'standard_error': np.sqrt(variance / n_samples)
    }
```

### 9.4 多重比较问题

#### 9.4.1 Bonferroni校正

当进行 $m$ 次比较时，控制家族错误率：

$$\alpha_{adjusted} = \frac{\alpha}{m}$$

**False Discovery Rate (FDR) 控制：**

Benjamini-Hochberg程序：
1. 将p值排序：$p_{(1)} \leq p_{(2)} \leq \cdots \leq p_{(m)}$
2. 找到最大的 $k$ 使得 $p_{(k)} \leq \frac{k}{m}\alpha$
3. 拒绝前 $k$ 个假设

```python
def multiple_testing_correction(p_values, method='bonferroni', alpha=0.05):
    """多重检验校正"""
    p_values = np.array(p_values)
    m = len(p_values)
    
    if method == 'bonferroni':
        adjusted_alpha = alpha / m
        rejected = p_values <= adjusted_alpha
        
    elif method == 'bh':  # Benjamini-Hochberg
        sorted_indices = np.argsort(p_values)
        sorted_p = p_values[sorted_indices]
        
        # 找到最大的k
        k = 0
        for i in range(m):
            if sorted_p[i] <= (i + 1) / m * alpha:
                k = i + 1
        
        rejected = np.zeros(m, dtype=bool)
        if k > 0:
            rejected[sorted_indices[:k]] = True
    
    return {
        'rejected': rejected,
        'adjusted_alpha': alpha / m if method == 'bonferroni' else None,
        'number_rejected': np.sum(rejected)
    }
```

## 10. 实际应用案例分析

### 10.1 完整的抽卡系统设计与验证

```python
class AdvancedGachaSystem:
    def __init__(self, rates, items, pity_systems=None):
        """
        高级抽卡系统
        pity_systems: 字典，包含不同稀有度的保底机制
        """
        self.rates = np.array(rates)
        self.items = items
        self.pity_systems = pity_systems or {}
        self.pity_counters = {rarity: 0 for rarity in self.pity_systems.keys()}
        
    def single_draw_with_pity(self):
        """带保底的单次抽卡"""
        # 检查保底
        for rarity, pity_info in self.pity_systems.items():
            if self.pity_counters[rarity] >= pity_info['threshold']:
                self.pity_counters[rarity] = 0
                # 重置其他计数器
                for other_rarity in self.pity_counters:
                    if other_rarity != rarity:
                        self.pity_counters[other_rarity] = 0
                return self.items[pity_info['guaranteed_index']]
        
        # 正常抽卡
        rand = np.random.random()
        cumulative = 0
        
        for i, rate in enumerate(self.rates):
            cumulative += rate
            if rand <= cumulative:
                # 更新保底计数器
                drawn_rarity = self.items[i]
                for rarity in self.pity_counters:
                    if rarity == drawn_rarity:
                        self.pity_counters[rarity] = 0
                    else:
                        self.pity_counters[rarity] += 1
                
                return self.items[i]
        
        return self.items[0]  # 默认
    
    def analyze_expected_cost(self, target_item, max_draws=1000):
        """分析获得目标物品的期望成本"""
        costs = []
        
        for simulation in range(10000):
            self.pity_counters = {rarity: 0 for rarity in self.pity_systems.keys()}
            
            for draw in range(1, max_draws + 1):
                result = self.single_draw_with_pity()
                if result == target_item:
                    costs.append(draw)
                    break
            else:
                costs.append(max_draws)  # 未获得
        
        return {
            'mean_cost': np.mean(costs),
            'median_cost': np.median(costs),
            'percentiles': {
                '50%': np.percentile(costs, 50),
                '90%': np.percentile(costs, 90),
                '95%': np.percentile(costs, 95),
                '99%': np.percentile(costs, 99)
            },
            'probability_within_max': np.mean(np.array(costs) < max_draws)
        }

# 使用示例
rates = [0.6, 0.3, 0.09, 0.01]
items = ['N', 'R', 'SR', 'SSR']
pity_systems = {
    'SSR': {'threshold': 90, 'guaranteed_index': 3},
    'SR': {'threshold': 10, 'guaranteed_index': 2}
}

gacha = AdvancedGachaSystem(rates, items, pity_systems)
analysis = gacha.analyze_expected_cost('SSR')
print("获得SSR的期望成本分析:", analysis)
```

### 10.2 游戏经济系统完整建模

```python
class GameEconomyModel:
    def __init__(self, player_segments, economic_parameters):
        """
        游戏经济模型
        player_segments: 玩家分群及其比例
        economic_parameters: 经济参数
        """
        self.segments = player_segments
        self.params = economic_parameters
        
    def simulate_player_lifecycle(self, segment, days=365):
        """模拟单个玩家的生命周期"""
        segment_params = self.segments[segment]
        
        # 初始状态
        level = 1
        gold = self.params['initial_gold']
        total_spent = 0
        active_days = 0
        
        daily_data = []
        
        for day in range(days):
            # 活跃判定
            if np.random.random() < segment_params['daily_activity_prob']:
                active_days += 1
                
                # 等级提升
                if np.random.random() < segment_params['level_up_prob']:
                    level += 1
                
                # 获得金币
                daily_gold = np.random.poisson(self.params['daily_gold_base'] * level)
                gold += daily_gold
                
                # 消费决策
                spending_prob = segment_params['spending_prob'] * (1 + level * 0.1)
                if np.random.random() < spending_prob and gold > 0:
                    spent = min(gold, np.random.exponential(segment_params['avg_spending']))
                    gold -= spent
                    total_spent += spent
                
                daily_data.append({
                    'day': day,
                    'level': level,
                    'gold': gold,
                    'daily_spending': spent if 'spent' in locals() else 0,
                    'cumulative_spending': total_spent
                })
            else:
                # 流失检查
                if np.random.random() < segment_params['churn_prob']:
                    break
        
        return {
            'final_level': level,
            'final_gold': gold,
            'total_spent': total_spent,
            'active_days': active_days,
            'ltv': total_spent,
            'daily_data': daily_data
        }
    
    def run_population_simulation(self, population_size=10000, days=365):
        """运行整个玩家群体模拟"""
        results = {'segments': {}, 'overall': {}}
        
        for segment, params in self.segments.items():
            segment_size = int(population_size * params['proportion'])
            segment_results = []
            
            for _ in range(segment_size):
                player_result = self.simulate_player_lifecycle(segment, days)
                segment_results.append(player_result)
            
            # 分析分群结果
            ltvs = [r['ltv'] for r in segment_results]
            active_days = [r['active_days'] for r in segment_results]
            
            results['segments'][segment] = {
                'avg_ltv': np.mean(ltvs),
                'median_ltv': np.median(ltvs),
                'ltv_std': np.std(ltvs),
                'avg_active_days': np.mean(active_days),
                'retention_rate': np.mean([r['active_days'] > 30 for r in segment_results]),
                'sample_size': segment_size
            }
        
        # 整体分析
        all_ltvs = []
        all_active_days = []
        
        for segment, params in self.segments.items():
            segment_results = results['segments'][segment]
            segment_size = int(population_size * params['proportion'])
            
            # 按比例扩展结果
            all_ltvs.extend([segment_results['avg_ltv']] * segment_size)
            all_active_days.extend([segment_results['avg_active_days']] * segment_size)
        
        results['overall'] = {
            'total_revenue': sum(all_ltvs),
            'avg_ltv': np.mean(all_ltvs),
            'revenue_per_segment': {
                segment: results['segments'][segment]['avg_ltv'] * 
                        int(population_size * params['proportion'])
                for segment, params in self.segments.items()
            }
        }
        
        return results

# 使用示例
player_segments = {
    'whale': {
        'proportion': 0.02,
        'daily_activity_prob': 0.9,
        'spending_prob': 0.3,
        'avg_spending': 50,
        'level_up_prob': 0.1,
        'churn_prob': 0.001
    },
    'dolphin': {
        'proportion': 0.08,
        'daily_activity_prob': 0.7,
        'spending_prob': 0.1,
        'avg_spending': 10,
        'level_up_prob': 0.05,
        'churn_prob': 0.005
    },
    'f2p': {
        'proportion': 0.9,
        'daily_activity_prob': 0.3,
        'spending_prob': 0.01,
        'avg_spending': 2,
        'level_up_prob': 0.02,
        'churn_prob': 0.02
    }
}

economic_params = {
    'initial_gold': 1000,
    'daily_gold_base': 100
}

economy_model = GameEconomyModel(player_segments, economic_params)
results = economy_model.run_population_simulation(10000, 365)

print("经济模型分析结果:")
for segment, data in results['segments'].items():
    print(f"{segment}: 平均LTV = {data['avg_ltv']:.2f}, 留存率 = {data['retention_rate']:.2%}")
```

## 11. 总结与展望

### 11.1 蒙特卡洛方法的核心价值

蒙特卡洛方法在游戏策划中的核心价值体现在：

1. **理论与实践的桥梁**：将抽象的概率理论转化为可验证的数值结果
2. **复杂系统建模**：处理多变量、非线性的游戏系统交互
3. **风险量化评估**：为策划决策提供定量的风险评估
4. **优化指导**：通过模拟找到系统参数的最优配置

### 11.2 数学基础总结

**核心数学概念：**
- 大数定律保证收敛性：$\lim_{n \to \infty} \bar{X}_n = \mu$
- 中心极限定理提供误差估计：$\bar{X}_n \sim N(\mu, \sigma^2/n)$
- 收敛速度为 $O(n^{-1/2})$，与维度无关

**高级技术：**
- 方差减少技术可显著提高效率
- MCMC方法处理复杂后验分布
- 贝叶斯方法提供不确定性量化

### 11.3 实践指导原则

1. **样本量选择**：
   - 探索性分析：$10^3 - 10^4$
   - 精确估计：$10^5 - 10^6$
   - 关键决策：$\geq 10^6$

2. **结果验证**：
   - 理论值对比
   - 收敛性诊断
   - 置信区间分析

3. **性能优化**：
   - 向量化计算
   - 并行处理
   - 方差减少技术

### 11.4 未来发展方向

**技术发展：**
- 量子蒙特卡洛在复杂系统中的应用
- 机器学习与蒙特卡洛的结合
- 实时自适应参数调整

**游戏应用：**
- 更精细的玩家行为建模
- 实时经济系统调优
- 个性化内容推荐系统

掌握蒙特卡洛方法的数学原理和实践技巧，能够帮助游戏策划师构建更加科学、可靠的游戏系统，在激烈的市场竞争中获得数据驱动的优势。
