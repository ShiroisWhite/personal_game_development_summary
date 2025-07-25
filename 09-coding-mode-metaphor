## 编程模式的生活比喻

### **1. 轮询模式 = 不停打电话询问**
```java
// 像一个焦虑的顾客，每隔一段时间就打电话问
while (true) {
    if (checkOrderStatus()) {  // "我的外卖到了吗？"
        processOrder();
    }
    sleep(30000);  // 等30秒再问一次
}
```
**特点**：主动、持续、可能很烦人，但能确保不错过

### **2. 事件监听 = 等快递员按门铃**
```java
// 注册门铃响应，然后该干嘛干嘛
DoorBell.onRing(() -> {  // "有人按门铃时请通知我"
    openDoor();
    receivePackage();
});

// 然后可以安心做其他事，门铃响了自然知道
```
**特点**：被动、高效、即时响应

### **3. 状态机模式 = 交通信号灯**
```java
public class TrafficLight {
    private LightState currentState = RED;
    
    public void update() {
        switch (currentState) {
            case RED:
                if (timerExpired()) {
                    currentState = GREEN;  // 红灯 → 绿灯
                }
                break;
            case GREEN:
                if (timerExpired()) {
                    currentState = YELLOW; // 绿灯 → 黄灯
                }
                break;
            case YELLOW:
                if (timerExpired()) {
                    currentState = RED;    // 黄灯 → 红灯
                }
                break;
        }
    }
}
```
**比喻**：就像交通信号灯，**只能按规定路径切换状态**
- 红灯只能变绿灯
- 绿灯只能变黄灯  
- 黄灯只能变红灯
- **不可能**直接从红灯跳到黄灯

### **4. 直接调用模式 = 面对面直接对话**
```java
public class RestaurantService {
    private Kitchen kitchen;
    private Cashier cashier;
    private Waiter waiter;
    
    public void processOrder(Order order) {
        // 直接找对应的人处理，面对面沟通
        cashier.collectPayment(order);     // 直接找收银员收钱
        kitchen.prepareFood(order);        // 直接找厨房做菜
        waiter.serveFood(order);          // 直接找服务员上菜
    }
}
```
**比喻**：就像在小餐厅里，**老板直接指挥每个员工**
- 有事直接找对应的人
- 沟通最直接、最快速
- 但老板必须知道每个人在哪里、做什么

## 更形象的对比场景

### **情景：等朋友来家里**

#### **轮询方式 - 不安分的人**
```java
while (true) {
    lookOutWindow();        // 每分钟看一次窗外
    checkPhone();          // 看看有没有消息
    checkDoorbell();       // 检查门铃有没有响
    sleep(60000);         // 等1分钟再重复
}
```
**心理状态**："让我看看朋友到了没...再看看...再看看..."

#### **事件监听方式 - 佛系等待**
```java
DoorBell.onRing(() -> openDoor());           // 门铃响了就开门
Phone.onMessage(() -> checkMessage());       // 有消息就看消息
Timer.onTimeout(() -> callFriend());         // 超时了就打电话

// 然后安心玩游戏，有事件自然会通知
```
**心理状态**："该来的时候自然会来，我先玩会游戏"

#### **状态机方式 - 按计划行事**
```java
enum WaitingState {
    PREPARING,    // 准备阶段：整理房间
    WAITING,      // 等待阶段：坐着等
    CALLING,      // 催促阶段：打电话
    GIVING_UP     // 放弃阶段：朋友不来了
}

// 严格按状态转换
PREPARING → WAITING → CALLING → GIVING_UP
```
**心理状态**："按计划一步步来，到点就转下一个阶段"

#### **直接调用方式 - 事无巨细管理**
```java
public void manageFriendVisit() {
    kitchen.prepareDrinks();      // 直接让厨房准备饮料
    livingRoom.tidyUp();          // 直接让客厅整理
    door.unlock();                // 直接让门解锁
    music.playBackground();       // 直接让音响播放音乐
}
```
**心理状态**："我要亲自安排好每一个细节"


## 总结 - 选择哪种"等待方式"

- **轮询**：适合"急性子"，需要实时响应的场景
- **事件监听**：适合"佛系"，可以等待通知的场景  
- **状态机**：适合"有规矩"，状态转换有严格顺序的场景
- **直接调用**：适合"控制狂"，需要精确控制每个步骤的场景
