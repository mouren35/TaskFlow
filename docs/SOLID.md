# SOLID 原则（针对 TypeScript / React 项目）

该文档简要介绍 SOLID 面向对象设计五大原则，并给出在 TypeScript + React / Meteor 项目中的实用建议与示例，帮助保持代码可维护、可扩展与可测试。

## 概要

- S — 单一职责（Single Responsibility Principle）
- O — 开放/闭合（Open/Closed Principle）
- L — 里氏替换（Liskov Substitution Principle）
- I — 接口隔离（Interface Segregation Principle）
- D — 依赖倒置（Dependency Inversion Principle）

---

## S — 单一职责（SRP）

每个模块/类/函数应只负责一件事。职责分离有助于降低耦合、提高可读性和测试性。

实践建议：

- 将 UI、数据访问和业务逻辑分离（例如：React 组件只负责渲染，viewmodel 负责数据和交互）。
- 若文件超过 ~200 行或有多类职责，考虑拆分。

示例（TypeScript）：

```ts
// viewmodels/tasks.ts — 只处理任务相关的状态与方法
export function useTasksViewModel() {
  /* fetch, subscribe, mutations */
}

// components/TaskList.tsx — 只负责渲染任务列表
function TaskList({ tasks }: { tasks: Task[] }) {
  /* render */
}
```

---

## O — 开放/闭合（OCP）

对扩展开放，对修改关闭。通过抽象、继承、或组合，使得增加新功能时尽量不修改已存在的稳定代码。

实践建议：

- 用接口/类型定义公共契约（例如：定义 Repository 接口），在需要时注入不同实现。
- 使用小的纯函数和策略模式替代大型 if/else 分支。

示例：用策略模式选择任务排序方式

```ts
type Sorter = (tasks: Task[]) => Task[];
const byDueDate: Sorter = (t) => t.sort(...);
const byPriority: Sorter = (t) => t.sort(...);
// 需要新排序时增加一个新的 Sorter 实现，不修改调用方
```

---

## L — 里氏替换（LSP）

子类型应能替换父类型且不改变程序的正确性。实现接口/继承时，应确保子类遵守父类契约。

实践建议：

- 在类型设计时明确可选字段与必需字段，避免子类缩小父类预期行为。
- 在 React 中，传递给组件的 props 类型应是通用且安全的子集。

示例：

```ts
interface NotificationSender {
  send(msg: string): Promise<void>;
}
class EmailSender implements NotificationSender {
  /* ... */
}
class MockSender implements NotificationSender {
  /* 用于测试 */
}
```

---

## I — 接口隔离（ISP）

不要强迫客户端依赖它们不需要的接口。将大接口拆分为更小、更具体的接口。

实践建议：

- 在服务/方法层定义小而专注的接口，例如：`ITaskRepository` 分为 `ICreateTask`、`IQueryTasks` 等小接口。
- 对于 React 组件，只传入必要的 props，不要一次性传入太多上下文。

示例：

```ts
interface ICreateTask {
  create(t: NewTask): Promise<string>;
}
interface ITaskQuery {
  listByDate(date: Date): Promise<Task[]>;
}
```

---

## D — 依赖倒置（DIP）

高层模块不应该依赖低层模块，二者都应该依赖于抽象（接口）；抽象不应该依赖细节，细节应该依赖抽象。

实践建议：

- 在项目中使用依赖注入或工厂函数，把具体实现（如 Meteor 方法调用、REST 客户端、mock）注入到上层逻辑中。
- 在测试中用替代实现替换真实依赖。

示例：

```ts
// 定义抽象
interface ITaskService {
  start(id: string): Promise<void>;
}

// 生产环境实现
class MeteorTaskService implements ITaskService {
  async start(id: string) {
    return Meteor.callAsync("tasks.start", id);
  }
}

// 视图层接收接口，不依赖具体实现
function useTimer(service: ITaskService) {
  /* 调用 service.start */
}
```

---

## 小结与在本仓库的落地建议

- 把 viewmodels（如 `useTasksViewModel`）和 UI（React 组件）职责分开，遵守 SRP。
- 用接口和注入（或传入实现）来让业务逻辑与 Meteor/数据库解耦，便于单元测试（DIP + ISP）。
- 遇到复杂分支时优先考虑策略模式或组合而非在现有代码上直接修改（OCP）。
- 在重构或扩展组件时，保持向后兼容，避免破坏现有契约（LSP）。

如果你愿意，我可以：

- 在 `docs/` 下添加更多带有本项目示例的 SOLID 子章节；
- 在若干关键文件中添加类型/接口并把现有实现按 SOLID 拆分（给出具体补丁）。

---

文件位置：`docs/SOLID.md`

作者：自动生成（可手动编辑以适配团队风格）
