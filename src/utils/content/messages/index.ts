const toast_messages = {
  errors: {
    empty_fields: {
      title: "Empty fields errors",
      message: "There is fields not field yet !",
    },
  },

  dates_errors: {
    start_date: {
      title: "Starting date error",
      message: "Starting date must be higher or equals today",
    },
    end_date: {
      title: "End date error",
      message: "End date must be higher or equals starting date",
    },
  },

  tasks: {
    add_task: {
      title: "Task Add",
      message: "The task has been added successfully !",
    },

    edit_task: {
      title: "Task Edit",
      message: "The task has been edited successfully !",
    },

    edit_task_state: {
      title: "Task state edit",
      message: "The task state has been edited successfully !",
    },

    delete_member_error: {
      title: "Delete member error",
      message: "Cannot delete the member because it related to subtask !",
    },

    edit_task_periorite: {
      title: "Periorite edit",
      message: "The task periorite has been edited successfully !",
    },

    delete_task: {
      title: "Task Delete",
      message: "The task has been deleted successfully !",
    },

    add_subtask: {
      title: "Subtask Add",
      message: "The subtask has been added successfully !",
    },

    subtask_edit: {
      title: "Subtask edit",
      message: "The subtask has been edited successfully !",
    },

    subtask_delete: {
      title: "Subtask delete",
      message: "The subtask has been deleted successfully !",
    },
  },

  states: {
    add_state: {
      title: "State Add",
      message: "The state has been added successfully !",
    },

    edit_state: {
      title: "State Edit",
      message: "The state has been edited successfully !",
    },

    delete_state: {
      title: "State Delete",
      message: "The state has been deleted successfully !",
    },

    delete_state_error: {
      title: "State Delete Error",
      message: "Cannot delete this state because it has related tasks !",
    },

    conflict_error: {
      title: "State Add",
      message: "State with this name or color already exists",
    },
  },

  users: {
    add_user: {
      message: "The user has benn added successfully",
      title: "Add User",
    },
    edit_user: {
      message: "The user has been updated successfully",
      title: "Updated User",
    },
    delete_user: {
      message: "The user has been deleted successfully",
      title: "Updated User",
    },
    conflict_error: { message: "The user already exists", title: "User Error" },
    delte_error: {
      message:
        "Cannot delete user — they are assigned to one or more tasks or subtasks.",
      title: "Delete User Error",
    },
  },
};

export { toast_messages };
