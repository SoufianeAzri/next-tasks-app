const toast_messages = {
  errors: {
    empty_fields: {
      title: "Champs vides",
      message: "Des champs ne sont pas encore remplis !",
    },
  },

  dates_errors: {
    start_date: {
      title: "Erreur de date de début",
      message: "La date de début doit être supérieure ou égale à aujourd’hui.",
    },
    end_date: {
      title: "Erreur de date de fin",
      message: "La date de fin doit être supérieure ou égale à la date de début.",
    },
  },

  tasks: {
    add_task: {
      title: "Ajout de tâche",
      message: "La tâche a été ajoutée avec succès !",
    },

    edit_task: {
      title: "Modification de tâche",
      message: "La tâche a été modifiée avec succès !",
    },

    edit_task_state: {
      title: "Modification de l’état de la tâche",
      message: "L’état de la tâche a été modifié avec succès !",
    },

    delete_member_error: {
      title: "Erreur de suppression de membre",
      message: "Impossible de supprimer le membre car il est lié à une sous-tâche !",
    },

    edit_task_periorite: {
      title: "Modification de priorité",
      message: "La priorité de la tâche a été modifiée avec succès !",
    },

    delete_task: {
      title: "Suppression de tâche",
      message: "La tâche a été supprimée avec succès !",
    },

    add_subtask: {
      title: "Ajout de sous-tâche",
      message: "La sous-tâche a été ajoutée avec succès !",
    },

    subtask_edit: {
      title: "Modification de sous-tâche",
      message: "La sous-tâche a été modifiée avec succès !",
    },

    subtask_delete: {
      title: "Suppression de sous-tâche",
      message: "La sous-tâche a été supprimée avec succès !",
    },
  },

  states: {
    add_state: {
      title: "Ajout d’état",
      message: "L’état a été ajouté avec succès !",
    },

    edit_state: {
      title: "Modification d’état",
      message: "L’état a été modifié avec succès !",
    },

    delete_state: {
      title: "Suppression d’état",
      message: "L’état a été supprimé avec succès !",
    },

    delete_state_error: {
      title: "Erreur de suppression d’état",
      message: "Impossible de supprimer cet état car il est lié à des tâches existantes !",
    },

    conflict_error: {
      title: "Erreur d’ajout d’état",
      message: "Un état avec ce nom ou cette couleur existe déjà.",
    },
  },

  users: {
    add_user: {
      message: "L’utilisateur a été ajouté avec succès.",
      title: "Ajout d’utilisateur",
    },
    edit_user: {
      message: "L’utilisateur a été mis à jour avec succès.",
      title: "Mise à jour d’utilisateur",
    },
    delete_user: {
      message: "L’utilisateur a été supprimé avec succès.",
      title: "Suppression d’utilisateur",
    },
    conflict_error: {
      message: "Cet utilisateur existe déjà.",
      title: "Erreur d’utilisateur",
    },
    delte_error: {
      message:
        "Impossible de supprimer l’utilisateur — il est assigné à une ou plusieurs tâches ou sous-tâches.",
      title: "Erreur de suppression d’utilisateur",
    },
  },
};

export { toast_messages };
