// 应用程序主模块
const App = {
  // 初始化应用
  init() {
    // 初始化数据存储
    this.initStorage();
    // 初始化视图
    this.initView();
    // 绑定事件
    this.bindEvents();
  },

  // 初始化本地存储和模拟数据
  initStorage() {
    // 检查是否有课程数据，如果没有则创建模拟数据
    if (!localStorage.getItem('courses')) {
      const mockCourses = [
        { id: 1, name: '软件工程', color: '#3b82f6' },
        { id: 2, name: '数据结构', color: '#10b981' },
        { id: 3, name: '算法分析', color: '#f59e0b' }
      ];
      localStorage.setItem('courses', JSON.stringify(mockCourses));
    }

    // 检查是否有任务数据，如果没有则创建模拟数据
    if (!localStorage.getItem('tasks')) {
      const mockTasks = [
        { id: 1, title: '完成软件设计文档', courseId: 1, dueDate: '2025-12-10', status: 'pending' },
        { id: 2, title: '复习链表章节', courseId: 2, dueDate: '2025-12-08', status: 'completed' },
        { id: 3, title: '解决排序算法问题', courseId: 3, dueDate: '2025-12-15', status: 'pending' }
      ];
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
  },

  // 初始化视图
  initView() {
    // 加载课程列表
    this.renderCourses();
    // 加载任务列表
    this.renderTasks();
  },

  // 绑定事件
  bindEvents() {
    // 导航切换
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView(e.target.dataset.view);
      });
    });

    // 移动端菜单切换
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // 添加课程按钮
    document.getElementById('addCourseBtn')?.addEventListener('click', () => {
      this.showCourseModal();
    });

    // 保存课程
    document.getElementById('saveCourseBtn')?.addEventListener('click', () => {
      this.saveCourse();
    });

    // 添加任务按钮
    document.getElementById('addTaskBtn')?.addEventListener('click', () => {
      this.showTaskModal();
    });

    // 保存任务
    document.getElementById('saveTaskBtn')?.addEventListener('click', () => {
      this.saveTask();
    });

    // 关闭模态框
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        this.hideAllModals();
      });
    });

    // 颜色选择器同步
    const courseColor = document.getElementById('courseColor');
    const courseColorText = document.getElementById('courseColorText');
    if (courseColor && courseColorText) {
      courseColor.addEventListener('input', () => {
        courseColorText.value = courseColor.value;
      });
      courseColorText.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(courseColorText.value)) {
          courseColor.value = courseColorText.value;
        }
      });
    }
  },

  // 切换视图
  switchView(viewName) {
    // 隐藏所有视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });
    // 显示选定视图
    document.getElementById(`${viewName}View`).classList.remove('hidden');
    // 更新导航激活状态
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`.nav-link[data-view="${viewName}"]`).classList.add('active');

    // 根据视图名称加载相应数据
    if (viewName === 'courses') {
      this.renderCourses();
    } else if (viewName === 'tasks') {
      this.renderTasks();
    } else if (viewName === 'progress') {
      this.renderProgress();
    } else if (viewName === 'reports') {
      this.renderReports();
    }
  },

  // 获取课程数据
  getCourses() {
    return JSON.parse(localStorage.getItem('courses') || '[]');
  },

  // 获取任务数据
  getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  },

  // 渲染课程列表
  renderCourses() {
    const courses = this.getCourses();
    const courseList = document.getElementById('courseList');
    if (courseList) {
      courseList.innerHTML = '';
      courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'card mb-4';
        courseCard.innerHTML = `
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" style="background-color: ${course.color}"></div>
              <h3 class="text-lg font-semibold">${course.name}</h3>
            </div>
            <div class="flex space-x-2">
              <button class="edit-course-btn btn-secondary py-1 px-2 text-sm" data-id="${course.id}">编辑</button>
              <button class="delete-course-btn btn-danger py-1 px-2 text-sm" data-id="${course.id}">删除</button>
            </div>
          </div>
        `;
        courseList.appendChild(courseCard);
      });

      // 绑定课程编辑和删除事件
      this.bindCourseActions();
    }
  },

  // 渲染任务列表
  renderTasks() {
    const tasks = this.getTasks();
    const courses = this.getCourses();
    const taskList = document.getElementById('taskList');
    if (taskList) {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const course = courses.find(c => c.id === task.courseId);
        const taskCard = document.createElement('div');
        taskCard.className = `card mb-4 ${task.status === 'completed' ? 'opacity-70' : ''}`;
        taskCard.innerHTML = `
          <div class="flex flex-col md:flex-row justify-between">
            <div class="mb-3 md:mb-0">
              <h3 class="text-lg font-semibold mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}">${task.title}</h3>
              <div class="flex items-center text-sm text-gray-600 mb-1">
                <div class="w-2 h-2 rounded-full mr-2" style="background-color: ${course?.color || '#6b7280'}"></div>
                <span>${course?.name || '未分类'}</span>
              </div>
              <div class="text-sm text-gray-500">截止日期: ${task.dueDate}</div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <div class="flex space-x-2">
                <button class="toggle-status-btn btn-secondary py-1 px-3 text-sm" data-id="${task.id}">
                  ${task.status === 'pending' ? '标记完成' : '标记待办'}
                </button>
                <button class="edit-task-btn btn-secondary py-1 px-3 text-sm" data-id="${task.id}">编辑</button>
                <button class="delete-task-btn btn-danger py-1 px-3 text-sm" data-id="${task.id}">删除</button>
              </div>
            </div>
          </div>
        `;
        taskList.appendChild(taskCard);
      });

      // 绑定任务操作事件
      this.bindTaskActions();
    }
  },

  // 渲染进度页面
  renderProgress() {
    const tasks = this.getTasks();
    const courses = this.getCourses();
    const progressContainer = document.getElementById('progressContent');
    if (progressContainer) {
      // 计算总体完成情况
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // 按课程统计
      const courseStats = courses.map(course => {
        const courseTasks = tasks.filter(t => t.courseId === course.id);
        const courseCompleted = courseTasks.filter(t => t.status === 'completed').length;
        const courseRate = courseTasks.length > 0 ? Math.round((courseCompleted / courseTasks.length) * 100) : 0;
        return {
          name: course.name,
          color: course.color,
          total: courseTasks.length,
          completed: courseCompleted,
          rate: courseRate
        };
      });

      progressContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 总体进度 -->
          <div class="card">
            <h2 class="text-xl font-bold mb-4">总体进度</h2>
            <div class="text-center mb-4">
              <div class="text-4xl font-bold text-blue-600">${completionRate}%</div>
              <div class="text-gray-600">${completedTasks}/${totalTasks} 任务已完成</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div class="bg-blue-600 h-4 rounded-full" style="width: ${completionRate}%"></div>
            </div>
          </div>

          <!-- 课程进度 -->
          <div class="card">
            <h2 class="text-xl font-bold mb-4">课程进度</h2>
            <div class="space-y-4">
              ${courseStats.map(stat => `
                <div>
                  <div class="flex justify-between mb-1">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${stat.color}"></div>
                      <span class="font-medium">${stat.name}</span>
                    </div>
                    <span class="text-sm text-gray-600">${stat.completed}/${stat.total}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="h-3 rounded-full" style="width: ${stat.rate}%; background-color: ${stat.color}"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 近期截止任务 -->
        <div class="card mt-6">
          <h2 class="text-xl font-bold mb-4">近期截止任务</h2>
          <div class="space-y-3">
            ${this.renderUpcomingTasks(tasks, courses)}
          </div>
        </div>
      `;
    }
  },

  // 渲染即将截止的任务
  renderUpcomingTasks(tasks, courses) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const upcomingTasks = tasks
      .filter(t => t.status === 'pending')
      .filter(t => new Date(t.dueDate) <= nextWeek)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (upcomingTasks.length === 0) {
      return '<p class="text-gray-500 text-center py-4">未来一周内没有待办任务</p>';
    }

    return upcomingTasks.map(task => {
      const course = courses.find(c => c.id === task.courseId);
      const dueDate = new Date(task.dueDate);
      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      let urgencyClass = '';
      let urgencyText = '';

      if (daysLeft < 0) {
        urgencyClass = 'bg-red-100 text-red-800';
        urgencyText = '已逾期';
      } else if (daysLeft === 0) {
        urgencyClass = 'bg-orange-100 text-orange-800';
        urgencyText = '今天截止';
      } else if (daysLeft === 1) {
        urgencyClass = 'bg-yellow-100 text-yellow-800';
        urgencyText = '明天截止';
      } else if (daysLeft <= 3) {
        urgencyClass = 'bg-blue-100 text-blue-800';
        urgencyText = `${daysLeft}天后截止`;
      } else {
        urgencyClass = 'bg-green-100 text-green-800';
        urgencyText = `${daysLeft}天后截止`;
      }

      return `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" style="background-color: ${course?.color || '#6b7280'}"></div>
            <div>
              <div class="font-medium">${task.title}</div>
              <div class="text-sm text-gray-500">${course?.name || '未分类'} · ${task.dueDate}</div>
            </div>
          </div>
          <span class="px-3 py-1 text-xs font-medium rounded-full ${urgencyClass}">${urgencyText}</span>
        </div>
      `;
    }).join('');
  },

  // 渲染报告页面
  renderReports() {
    const tasks = this.getTasks();
    const courses = this.getCourses();
    const reportsContainer = document.getElementById('reportsContent');
    if (reportsContainer) {
      // 计算统计数据
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      reportsContainer.innerHTML = `
        <div class="card">
          <h2 class="text-xl font-bold mb-6">任务统计报告</h2>
          
          <!-- 统计概览 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">${totalTasks}</div>
              <div class="text-gray-600">总任务数</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-green-600">${completedTasks}</div>
              <div class="text-gray-600">已完成任务</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-yellow-600">${pendingTasks}</div>
              <div class="text-gray-600">待办任务</div>
            </div>
          </div>

          <!-- 图表占位 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">任务完成率</h3>
            <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <div class="text-5xl font-bold text-blue-600">${completionRate}%</div>
                <div class="text-gray-600 mt-2">完成率</div>
              </div>
            </div>
          </div>

          <!-- 按课程统计 -->
          <div>
            <h3 class="text-lg font-semibold mb-3">各课程任务统计</h3>
            <div class="space-y-4">
              ${courses.map(course => {
                const courseTasks = tasks.filter(t => t.courseId === course.id);
                const courseCompleted = courseTasks.filter(t => t.status === 'completed').length;
                const coursePending = courseTasks.filter(t => t.status === 'pending').length;
                return `
                  <div class="p-4 border border-gray-200 rounded-lg">
                    <div class="flex items-center mb-2">
                      <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${course.color}"></div>
                      <h4 class="font-medium">${course.name}</h4>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div>已完成: <span class="text-green-600 font-medium">${courseCompleted}</span></div>
                      <div>待办: <span class="text-yellow-600 font-medium">${coursePending}</span></div>
                      <div>总计: <span class="font-medium">${courseTasks.length}</span></div>
                      <div>完成率: <span class="font-medium">${courseTasks.length > 0 ? Math.round((courseCompleted / courseTasks.length) * 100) : 0}%</span></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 导出报告按钮 -->
          <div class="mt-8 text-center">
            <button id="exportReportBtn" class="btn-primary">导出报告</button>
          </div>
        </div>
      `;

      // 绑定导出报告事件
      document.getElementById('exportReportBtn')?.addEventListener('click', () => {
        alert('报告导出功能已触发！在实际应用中，这里会生成PDF或Excel报告。');
      });
    }
  },

  // 显示课程模态框
  showCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
      document.getElementById('courseId').value = '';
      document.getElementById('courseName').value = '';
      document.getElementById('courseColor').value = '#3b82f6';
      modal.classList.remove('hidden');
    }
  },

  // 显示任务模态框
  showTaskModal() {
    const modal = document.getElementById('taskModal');
    const courseSelect = document.getElementById('taskCourseId');
    if (modal && courseSelect) {
      // 清空表单
      document.getElementById('taskId').value = '';
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDueDate').value = '';
      
      // 填充课程下拉列表
      courseSelect.innerHTML = '<option value="" disabled selected>选择关联课程</option>';
      const courses = this.getCourses();
      courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
      });

      // 设置默认日期为明天
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('taskDueDate').valueAsDate = tomorrow;
      
      modal.classList.remove('hidden');
    }
  },

  // 隐藏所有模态框
  hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.add('hidden');
    });
  },

  // 保存课程
  saveCourse() {
    const courseId = document.getElementById('courseId').value;
    const courseName = document.getElementById('courseName').value.trim();
    const courseColor = document.getElementById('courseColor').value;
    
    if (!courseName) {
      alert('请输入课程名称');
      return;
    }

    const courses = this.getCourses();
    
    if (courseId) {
      // 编辑现有课程
      const index = courses.findIndex(c => c.id === parseInt(courseId));
      if (index !== -1) {
        courses[index] = { ...courses[index], name: courseName, color: courseColor };
      }
    } else {
      // 添加新课程
      const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
      courses.push({ id: newId, name: courseName, color: courseColor });
    }
    
    localStorage.setItem('courses', JSON.stringify(courses));
    this.renderCourses();
    this.hideAllModals();
  },

  // 保存任务
  saveTask() {
    const taskId = document.getElementById('taskId').value;
    const taskTitle = document.getElementById('taskTitle').value.trim();
    const taskCourseId = document.getElementById('taskCourseId').value;
    const taskDueDate = document.getElementById('taskDueDate').value;
    
    if (!taskTitle) {
      alert('请输入任务标题');
      return;
    }
    
    if (!taskCourseId) {
      alert('请关联课程');
      return;
    }

    const tasks = this.getTasks();
    
    if (taskId) {
      // 编辑现有任务
      const index = tasks.findIndex(t => t.id === parseInt(taskId));
      if (index !== -1) {
        tasks[index] = { ...tasks[index], title: taskTitle, courseId: parseInt(taskCourseId), dueDate: taskDueDate };
      }
    } else {
      // 添加新任务
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      tasks.push({ id: newId, title: taskTitle, courseId: parseInt(taskCourseId), dueDate: taskDueDate, status: 'pending' });
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.renderTasks();
    this.hideAllModals();
  },

  // 绑定课程操作事件
  bindCourseActions() {
    // 编辑课程
    document.querySelectorAll('.edit-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = parseInt(e.target.dataset.id);
        const courses = this.getCourses();
        const course = courses.find(c => c.id === courseId);
        if (course) {
          document.getElementById('courseId').value = course.id;
          document.getElementById('courseName').value = course.name;
          document.getElementById('courseColor').value = course.color;
          document.getElementById('courseModal').classList.remove('hidden');
        }
      });
    });

    // 删除课程
    document.querySelectorAll('.delete-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (confirm('确定要删除这个课程吗？相关任务将被移至未分类。')) {
          const courseId = parseInt(e.target.dataset.id);
          let courses = this.getCourses();
          courses = courses.filter(c => c.id !== courseId);
          localStorage.setItem('courses', JSON.stringify(courses));
          this.renderCourses();
        }
      });
    });
  },

  // 绑定任务操作事件
  bindTaskActions() {
    // 切换任务状态
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = parseInt(e.target.dataset.id);
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks[index].status = tasks[index].status === 'pending' ? 'completed' : 'pending';
          localStorage.setItem('tasks', JSON.stringify(tasks));
          this.renderTasks();
        }
      });
    });

    // 编辑任务
    document.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = parseInt(e.target.dataset.id);
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          document.getElementById('taskId').value = task.id;
          document.getElementById('taskTitle').value = task.title;
          document.getElementById('taskCourseId').value = task.courseId;
          document.getElementById('taskDueDate').value = task.dueDate;
          
          // 确保课程下拉列表已填充
          this.showTaskModal();
          document.getElementById('taskCourseId').value = task.courseId;
          document.getElementById('taskModal').classList.remove('hidden');
        }
      });
    });

    // 删除任务
    document.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (confirm('确定要删除这个任务吗？')) {
          const taskId = parseInt(e.target.dataset.id);
          let tasks = this.getTasks();
          tasks = tasks.filter(t => t.id !== taskId);
          localStorage.setItem('tasks', JSON.stringify(tasks));
          this.renderTasks();
        }
      });
    });
  }
};

// 文档加载完成后初始化应用
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
