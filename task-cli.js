const fs = require('fs')
const path = require('path')

const TASK_FILE = path.join(__dirname, 'tasks.json')

const readTasks = () => {
  try {
    if (!fs.existsSync(TASK_FILE))
      fs.writeFileSync(TASK_FILE, JSON.stringify([]))

    const fileContent = fs.readFileSync(TASK_FILE, 'utf-8').trim()

    if (!fileContent) return []

    return JSON.parse(fileContent)
  } catch (err) {
    console.error('Error reading tasks file:', err.message)
    return []
  }
}

const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2))
  } catch (err) {
    console.error('Error writing tasks file:', err.message)
  }
}

function addTask(description) {
  const tasks = readTasks()
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1
  const task = {
    id,
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  tasks.push(task)
  writeTasks(tasks)
  console.log(`Task added successfully (ID: ${id})`)
}

function updateTask(id, description) {
  const tasks = readTasks()
  const task = tasks.find((t) => t.id === Number(id))

  if (!task) return console.log('Task not found')

  task.description = description
  task.updatedAt = new Date().toISOString()

  writeTasks(tasks)
  console.log('Tasks updated successfully.')
}

function deleteTask(id) {
  let tasks = readTasks()
  tasks = tasks.filter((t) => t.id !== Number(id))
  writeTasks(tasks)
  console.log('Task deleted successfully')
}

function markTaskStatus(id, status) {
  const validStatuses = ['todo', 'in-progress', 'done']

  if (!validStatuses.includes(status)) {
    return console.log(
      'Invalid status. Valid statuses are: todo, in-progress, done.'
    )
  }

  const tasks = readTasks()
  const task = tasks.find((t) => t.id === Number(id))

  if (!task) return console.log('Task not found')

  task.status = status
  task.updatedAt = new Date().toISOString()

  writeTasks(tasks)
  console.log(`Task marked as ${status}.`)
}

function listTasks(filter) {
  if (!filter) {
    console.log('All tasks:')
  } else {
    console.log(`Tasks with status "${filter}":`)
  }

  const tasks = readTasks()
  const filteredTasks = filter
    ? tasks.filter((t) => t.status === filter)
    : tasks

  if (!filteredTasks.length) return console.log('No tasks found.')
  filteredTasks.forEach((t) => {
    console.log(`- [${t.status.toUpperCase()}] ID: ${t.id}`)
    console.log(`  Description: ${t.description}`)
    console.log(`  Created At: ${t.createdAt}`)
    console.log(`  Updated At: ${t.updatedAt}`)
    console.log('---------------------------------------')
  })
}

const [, , command, ...args] = process.argv
switch (command) {
  case 'add':
    addTask(args.join(' '))
    break
  case 'update':
    updateTask(args[0], args.slice(1).join(' '))
    break
  case 'delete':
    deleteTask(args[0])
    break
  case 'mark-in-progress':
    markTaskStatus(args[0], 'in-progress')
    break
  case 'mark-done':
    markTaskStatus(args[0], 'done')
    break
  case 'list':
    listTasks(args[0])
    break
  default:
    console.log(
      'Invalid command. Use add, update, delete, mark-in-progress, mark-done, or list.'
    )
}
